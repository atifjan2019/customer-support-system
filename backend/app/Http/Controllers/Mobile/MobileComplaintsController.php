<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Lead;
use Illuminate\Http\Request;

class MobileComplaintsController extends Controller
{
    public function create()
    {
        return view('mobile.complaints-form', [
            'lead' => new Lead([
                'lead_type' => 'complaint',
                'status' => 'open',
                'priority' => 'high',
            ]),
            'complaint' => new Complaint(),
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'string', 'max:50'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:2000'],
            'severity' => ['nullable', 'string', 'max:50'],
        ]);

        $user = auth()->user();

        $lead = Lead::create([
            'lead_type' => 'complaint',
            'customer_name' => $data['customer_name'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'priority' => $data['priority'] ?? 'high',
            'status' => 'open',
            'created_by' => $user?->id,
            'company_id' => $user?->company_id,
        ]);

        $lead->complaint()->create([
            'category' => $data['category'],
            'description' => $data['description'],
            'severity' => $data['severity'] ?? 'normal',
        ]);

        return redirect()->route('mobile.complaints.show', $lead);
    }

    public function show(Lead $lead)
    {
        $this->ensureComplaint($lead);

        return view('mobile.complaints-show', [
            'lead' => $lead->load(['assignedAgent', 'complaint']),
        ]);
    }

    public function edit(Lead $lead)
    {
        $this->ensureComplaint($lead);

        return view('mobile.complaints-form', [
            'lead' => $lead->load('complaint'),
            'complaint' => $lead->complaint,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $this->ensureComplaint($lead);

        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'string', 'max:50'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:2000'],
            'severity' => ['nullable', 'string', 'max:50'],
        ]);

        $lead->update([
            'customer_name' => $data['customer_name'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'priority' => $data['priority'] ?? $lead->priority,
        ]);

        $lead->complaint()->update([
            'category' => $data['category'],
            'description' => $data['description'],
            'severity' => $data['severity'] ?? $lead->complaint?->severity,
        ]);

        return redirect()->route('mobile.complaints.show', $lead);
    }

    public function resolve(Request $request, Lead $lead)
    {
        $this->ensureComplaint($lead);

        $data = $request->validate([
            'resolution_notes' => ['required', 'string', 'max:2000'],
        ]);

        $lead->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        $minutes = $lead->created_at ? $lead->created_at->diffInMinutes(now()) : null;

        $lead->complaint()->update([
            'resolution_notes' => $data['resolution_notes'],
            'resolution_time_minutes' => $minutes,
        ]);

        return redirect()->route('mobile.complaints.show', $lead);
    }

    public function destroy(Lead $lead)
    {
        $this->ensureComplaint($lead);

        $lead->complaint()->delete();
        $lead->delete();

        return redirect()->route('mobile.complaints');
    }

    private function ensureComplaint(Lead $lead): void
    {
        if ($lead->lead_type !== 'complaint') {
            abort(404);
        }

        $user = auth()->user();
        if ($user && $user->role !== 'super_admin' && $user->company_id && $lead->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
