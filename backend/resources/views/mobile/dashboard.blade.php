@extends('mobile.layout')

@section('title', 'Dashboard')

@section('content')
    @include('mobile.partials.header', ['label' => 'Dashboard'])

    <h1>Today's Overview</h1>
    <p>Real-time metrics from your support system.</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;">
        <div class="list-item" style="text-align: center; padding: 20px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--primary);">{{ $openComplaints }}</div>
            <div style="font-size: 13px; color: var(--text-muted);">Open Complaints</div>
        </div>
        <div class="list-item" style="text-align: center; padding: 20px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--warning);">{{ $pendingRequests }}</div>
            <div style="font-size: 13px; color: var(--text-muted);">Pending Leads</div>
        </div>
        <div class="list-item" style="text-align: center; padding: 20px;">
            <div style="font-size: 28px; font-weight: 700; color: var(--success);">{{ $resolvedToday }}</div>
            <div style="font-size: 13px; color: var(--text-muted);">Resolved Today</div>
        </div>
        <div class="list-item" style="text-align: center; padding: 20px;">
            <div style="font-size: 28px; font-weight: 700; color: #3b82f6;">{{ $totalLeads }}</div>
            <div style="font-size: 13px; color: var(--text-muted);">Total Leads</div>
        </div>
    </div>

    <h2>Recent Activity</h2>
    <div class="list">
        @forelse ($recentActivity as $lead)
            <div class="list-item">
                <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                    <strong>{{ $lead->name ?? 'Lead' }}</strong>
                    <span class="badge badge-{{ $lead->status === 'resolved' ? 'success' : ($lead->status === 'pending' ? 'warning' : 'primary') }}">{{ ucfirst($lead->status ?? 'open') }}</span>
                </div>
                <div class="meta">{{ ucfirst($lead->lead_type ?? 'update') }}</div>
                @if ($lead->assignedAgent)
                    <div class="meta">Assigned to {{ $lead->assignedAgent->name }}</div>
                @endif
            </div>
        @empty
            <div class="list-item" style="text-align: center; color: var(--text-muted);">
                <p>No recent activity yet.</p>
            </div>
        @endforelse
    </div>

    <div class="actions">
        <a class="button" href="{{ route('mobile.leads') }}">View All Leads</a>
        <a class="button secondary" href="{{ route('mobile.complaints') }}">View Complaints</a>
    </div>
@endsection
