@extends('mobile.layout')

@section('title', 'Leads')

@section('content')
    @include('mobile.partials.header', ['label' => 'Lead Management'])

    <h1>Customer Leads</h1>
    <p>Review and manage customer requests and assignments.</p>

    <div class="actions" style="margin-top: 16px; margin-bottom: 8px;">
        <a class="button" href="{{ route('mobile.leads.create') }}">+ Create New Lead</a>
    </div>

    <div class="list">
        @forelse ($leads as $lead)
            <a href="{{ route('mobile.leads.show', $lead) }}" style="text-decoration: none; color: inherit;">
                <div class="list-item">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                        <strong>{{ $lead->customer_name ?? $lead->company ?? 'Lead' }}</strong>
                        <span class="badge badge-{{ $lead->status === 'resolved' ? 'success' : ($lead->priority === 'high' ? 'warning' : 'primary') }}">{{ ucfirst($lead->status ?? 'open') }}</span>
                    </div>
                    <div class="meta">{{ ucfirst($lead->lead_type ?? 'request') }} • Priority: {{ ucfirst($lead->priority ?? 'normal') }}</div>
                    @if ($lead->phone)
                        <div class="meta">📞 {{ $lead->phone }}</div>
                    @endif
                    @if ($lead->assignedAgent)
                        <div class="meta">👤 Assigned to {{ $lead->assignedAgent->name }}</div>
                    @endif
                </div>
            </a>
        @empty
            <div class="list-item" style="text-align: center; color: var(--text-muted); padding: 32px;">
                <p>📝 No leads found yet.</p>
                <p style="font-size: 13px;">Create your first lead to get started.</p>
            </div>
        @endforelse
    </div>
@endsection
