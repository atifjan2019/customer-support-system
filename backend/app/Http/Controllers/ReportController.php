<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $fromDate = $request->query('from_date', Carbon::now()->subDays(30)->toDateString());
        $toDate = $request->query('to_date', Carbon::now()->toDateString());

        $query = Lead::whereBetween('created_at', [
            Carbon::parse($fromDate)->startOfDay(),
            Carbon::parse($toDate)->endOfDay()
        ]);

        // General Stats
        $stats = [
            'total' => (clone $query)->count(),
            'resolved' => (clone $query)->where('status', 'resolved')->count(),
            'pending' => (clone $query)->whereIn('status', ['open', 'in_progress'])->count(),
            'avg_resolution_time' => $this->calculateAvgResolutionTime(clone $query),
        ];

        // Type Breakdown
        $typeBreakdown = (clone $query)
            ->select('lead_type', DB::raw('count(*) as count'))
            ->groupBy('lead_type')
            ->get();

        // Company Breakdown
        $companyBreakdown = (clone $query)
            ->whereNotNull('company_id')
            ->select('company_id', DB::raw('count(*) as count'))
            ->with('companyRel:id,name')
            ->groupBy('company_id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->companyRel ? $item->companyRel->name : 'Unknown',
                    'count' => $item->count
                ];
            });

        // Daily Trend
        $dailyTrend = (clone $query)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => $stats,
            'type_breakdown' => $typeBreakdown,
            'company_breakdown' => $companyBreakdown,
            'daily_trend' => $dailyTrend,
            'period' => [
                'from' => $fromDate,
                'to' => $toDate
            ]
        ]);
    }

    private function calculateAvgResolutionTime($query)
    {
        $resolvedLeads = $query->where('status', 'resolved')
            ->whereNotNull('resolved_at')
            ->get();

        if ($resolvedLeads->isEmpty()) return 0;

        $totalMinutes = $resolvedLeads->reduce(function ($carry, $lead) {
            $created = Carbon::parse($lead->created_at);
            $resolved = Carbon::parse($lead->resolved_at);
            return $carry + $resolved->diffInMinutes($created);
        }, 0);

        return round($totalMinutes / $resolvedLeads->count() / 60, 1); // Returns hours
    }
}
