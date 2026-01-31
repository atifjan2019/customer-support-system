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
        $totalLeads = Lead::count();
        $openComplaints = Lead::where('lead_type', 'complaint')->whereIn('status', ['open', 'in_progress'])->count();
        $resolvedToday = Lead::whereDate('resolved_at', today())->count();
        $pendingRequests = Lead::where('lead_type', 'new_connection')->where('status', 'open')->count();

        // Recent Activity (Simple 5 latest leads)
        $recentActivity = Lead::with('assignedAgent')->latest()->take(5)->get();

        return response()->json([
            'total_leads' => $totalLeads,
            'open_complaints' => $openComplaints,
            'resolved_today' => $resolvedToday,
            'pending_requests' => $pendingRequests,
            'recent_activity' => $recentActivity
        ]);
    }
}
