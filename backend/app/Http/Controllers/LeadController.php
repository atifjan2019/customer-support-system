<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Services\NotificationBridgeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['assignedAgent', 'creator']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('lead_type')) {
            $query->where('lead_type', $request->lead_type);
        }

        // If user is tech team, only show assigned leads
        if (Auth::user()->role === 'tech_team') {
            $query->where('assigned_to', Auth::id());
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_type' => 'required|in:new_connection,complaint',
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'location' => 'nullable|string',
            'company' => 'nullable|string',
            'company_id' => 'nullable|exists:companies,id',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $lead = $request->user()->createdLeads()->create([
            ...$validated,
            'status' => 'open',
            'company' => $request->company,
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Created Lead',
            'target_type' => 'Lead',
            'target_id' => $lead->id,
            'description' => "Created lead for customer: {$lead->customer_name}",
        ]);

        return response()->json($lead, 201);
    }

    public function show($id)
    {
        return Lead::with(['assignedAgent', 'creator', 'complaint'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->update($request->all());
        return response()->json($lead);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved',
            'notes' => 'nullable|string'
        ]);
        
        $lead = Lead::findOrFail($id);
        
        $updateData = [
            'status' => $request->status,
            'resolved_at' => $request->status === 'resolved' ? now() : null,
        ];
        
        if ($request->has('notes')) {
            $updateData['notes'] = $request->notes;
        }

        $lead->update($updateData);

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Status Updated',
            'target_type' => 'Lead',
            'target_id' => $lead->id,
            'description' => "Changed status of {$lead->customer_name} to " . strtoupper($request->status),
        ]);

        // Notify Creator if someone else resolves/reopens
        if ($lead->created_by !== Auth::id()) {
            NotificationBridgeService::bridge(
                $lead->created_by,
                'Lead Status Updated',
                "Your lead for {$lead->customer_name} is now " . strtoupper($request->status),
                $request->status === 'resolved' ? 'success' : 'info'
            );
        }
        
        return response()->json($lead);
    }

    public function assignAgent(Request $request, $id)
    {
        $request->validate(['agent_id' => 'required|exists:users,id']);
        $lead = Lead::findOrFail($id);
        $lead->assigned_to = $request->agent_id;
        $lead->save();

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'Agent Assigned',
            'target_type' => 'Lead',
            'target_id' => $lead->id,
            'description' => "Assigned lead {$lead->customer_name} to " . \App\Models\User::find($request->agent_id)->name,
        ]);

        // Notify the assigned agent
        NotificationBridgeService::bridge(
            $request->agent_id,
            'New Lead Assigned',
            "You have been assigned to lead: {$lead->customer_name}",
            'info'
        );

        return response()->json($lead);
    }
}
