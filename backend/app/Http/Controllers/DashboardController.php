<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $user = auth()->user();
        $query = Lead::query();

        // Apply filters
        if ($user->role !== 'super_admin') {
            if ($user->company_id) {
                $query->where('company_id', $user->company_id);
            }
            if ($user->role === 'tech_team') {
                $query->where('assigned_to', $user->id);
            }
        }

        // Stats clones
        $totalLeads = (clone $query)->count();
        $openComplaints = (clone $query)->where('lead_type', 'complaint')
            ->whereIn('status', ['open', 'in_progress'])->count();
        $resolvedToday = (clone $query)->whereDate('resolved_at', today())->count();
        $pendingRequests = (clone $query)->where('lead_type', 'new_connection')
            ->where('status', 'open')->count();

        // Recent Activity
        $recentActivity = (clone $query)->with('assignedAgent')->latest()->take(5)->get();

        return response()->json([
            'total_leads' => $totalLeads,
            'open_complaints' => $openComplaints,
            'resolved_today' => $resolvedToday,
            'pending_requests' => $pendingRequests,
            'recent_activity' => $recentActivity
        ]);
    }
}
