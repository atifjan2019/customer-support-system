<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class MobileLeadsController extends Controller
{
    public function index()
    {
        $leads = $this->baseQuery()->latest()->take(25)->get();

        return view('mobile.leads', [
            'title' => 'Leads',
            'leads' => $leads,
        ]);
    }

    public function complaints()
    {
        $leads = $this->baseQuery()
            ->where('lead_type', 'complaint')
            ->latest()
            ->take(25)
            ->get();

        return view('mobile.complaints', [
            'title' => 'Complaints',
            'leads' => $leads,
        ]);
    }

    public function create()
    {
        return view('mobile.leads-form', [
            'lead' => new Lead([
                'lead_type' => 'new_connection',
                'status' => 'open',
                'priority' => 'normal',
            ]),
            'mode' => 'create',
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'lead_type' => ['required', 'string', 'in:new_connection,complaint,follow_up,upgrade,other'],
            'status' => ['required', 'string', 'in:open,resolved,pending'],
            'priority' => ['nullable', 'string', 'max:50'],
        ]);

        $user = auth()->user();

        $lead = Lead::create([
            'lead_type' => $data['lead_type'],
            'customer_name' => $data['customer_name'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'status' => $data['status'],
            'priority' => $data['priority'] ?? 'normal',
            'created_by' => $user?->id,
            'company_id' => $user?->company_id,
        ]);

        return redirect()->route('mobile.leads.show', $lead);
    }

    public function show(Lead $lead)
    {
        $this->ensureLeadAccess($lead);

        return view('mobile.leads-show', [
            'lead' => $lead->load(['assignedAgent', 'complaint']),
        ]);
    }

    public function edit(Lead $lead)
    {
        $this->ensureLeadAccess($lead);

        return view('mobile.leads-form', [
            'lead' => $lead,
            'mode' => 'edit',
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $this->ensureLeadAccess($lead);

        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'lead_type' => ['required', 'string', 'in:new_connection,complaint,follow_up,upgrade,other'],
            'status' => ['required', 'string', 'in:open,resolved,pending'],
            'priority' => ['nullable', 'string', 'max:50'],
        ]);

        $lead->update([
            'lead_type' => $data['lead_type'],
            'customer_name' => $data['customer_name'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'status' => $data['status'],
            'priority' => $data['priority'] ?? $lead->priority,
        ]);

        return redirect()->route('mobile.leads.show', $lead);
    }

    public function destroy(Lead $lead)
    {
        $this->ensureLeadAccess($lead);

        $lead->complaint()?->delete();
        $lead->delete();

        return redirect()->route('mobile.leads');
    }

    private function baseQuery()
    {
        $user = auth()->user();
        $query = Lead::query()->with(['assignedAgent', 'complaint']);

        if ($user && $user->role !== 'super_admin' && $user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        return $query;
    }

    private function ensureLeadAccess(Lead $lead): void
    {
        $user = auth()->user();

        if ($user && $user->role !== 'super_admin' && $user->company_id && $lead->company_id !== $user->company_id) {
            abort(403);
        }
    }
}
