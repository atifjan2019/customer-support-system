<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Lead;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $complaints = Complaint::with('lead', 'lead.assignedAgent')
            ->paginate(10);
        
        return response()->json($complaints);
    }

    public function show($id)
    {
        $complaint = Complaint::with('lead', 'lead.assignedAgent')
            ->findOrFail($id);
        
        return response()->json($complaint);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'category' => 'required|string',
            'severity' => 'required|in:minor,major,critical',
            'description' => 'required|string',
        ]);

        $complaint = Complaint::create($validated);
        
        // Ensure lead type is updated if needed
        $lead = Lead::find($request->lead_id);
        if ($lead->lead_type !== 'complaint') {
            $lead->update(['lead_type' => 'complaint']);
        }

        return response()->json($complaint, 201);
    }

    public function resolve(Request $request, $id)
    {
        $validated = $request->validate([
            'resolution_notes' => 'required|string',
            'resolution_time_minutes' => 'nullable|integer',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update($validated);

        // Also resolve the lead
        $complaint->lead->update([
            'status' => 'resolved',
            'resolved_at' => now()
        ]);

        return response()->json($complaint);
    }
}
