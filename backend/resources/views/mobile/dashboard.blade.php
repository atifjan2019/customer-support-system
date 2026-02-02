@extends('mobile.layout')

@section('title', 'Mobile Dashboard')

@section('content')
    @include('mobile.partials.header', ['label' => 'Dashboard'])

    <h1>Today at a glance</h1>
    <p>Quick snapshot of live metrics pulled from your Laravel data.</p>

    <div class="list">
        <div class="list-item">
            <strong>Open complaints</strong>
            <div>{{ $openComplaints }} awaiting response</div>
        </div>
        <div class="list-item">
            <strong>New leads</strong>
            <div>{{ $pendingRequests }} pending requests</div>
        </div>
        <div class="list-item">
            <strong>Resolved today</strong>
            <div>{{ $resolvedToday }} tickets closed</div>
        </div>
        <div class="list-item">
            <strong>Total leads</strong>
            <div>{{ $totalLeads }} in your pipeline</div>
        </div>
    </div>

    <h2 style="margin-top: 24px; font-size: 18px;">Recent activity</h2>
    <div class="list">
        @forelse ($recentActivity as $lead)
            <div class="list-item">
                <strong>{{ $lead->name ?? 'Lead' }}</strong>
                <div>{{ ucfirst($lead->lead_type ?? 'update') }} • {{ ucfirst($lead->status ?? 'open') }}</div>
                @if ($lead->assignedAgent)
                    <div style="color:#94a3b8; font-size: 12px;">Assigned to {{ $lead->assignedAgent->name }}</div>
                @endif
            </div>
        @empty
            <div class="list-item">No recent activity yet.</div>
        @endforelse
    </div>

    <div class="actions">
        <a class="button" href="{{ route('mobile.home') }}">Back to home</a>
    </div>
@endsection
