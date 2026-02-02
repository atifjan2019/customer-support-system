<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Lead;

class MobileDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Lead::query();

        if ($user && $user->role !== 'super_admin' && $user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        $totalLeads = (clone $query)->count();
        $openComplaints = (clone $query)
            ->where('lead_type', 'complaint')
            ->where('status', 'open')
            ->count();
        $resolvedToday = (clone $query)
            ->whereDate('resolved_at', today())
            ->count();
        $pendingRequests = (clone $query)
            ->where('lead_type', 'new_connection')
            ->where('status', 'open')
            ->count();
        $recentActivity = (clone $query)
            ->with('assignedAgent')
            ->latest()
            ->take(5)
            ->get();

        return view('mobile.dashboard', [
            'totalLeads' => $totalLeads,
            'openComplaints' => $openComplaints,
            'resolvedToday' => $resolvedToday,
            'pendingRequests' => $pendingRequests,
            'recentActivity' => $recentActivity,
        ]);
    }
}
