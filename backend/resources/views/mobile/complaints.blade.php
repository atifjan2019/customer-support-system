@extends('mobile.layout')

@section('title', 'Complaints')

@section('content')
    @include('mobile.partials.header', ['label' => 'Complaints'])

    <h1>Customer Complaints</h1>
    <p>Track urgent issues and manage resolution status.</p>

    <div class="actions" style="margin-top: 16px; margin-bottom: 8px;">
        <a class="button" href="{{ route('mobile.complaints.create') }}">+ Log New Complaint</a>
    </div>

    <div class="list">
        @forelse ($leads as $lead)
            <a href="{{ route('mobile.complaints.show', $lead) }}" style="text-decoration: none; color: inherit;">
                <div class="list-item">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                        <strong>{{ $lead->customer_name ?? $lead->company ?? 'Complaint' }}</strong>
                        <span class="badge badge-{{ $lead->status === 'resolved' ? 'success' : 'warning' }}">{{ ucfirst($lead->complaint->severity ?? 'normal') }}</span>
                    </div>
                    <div class="meta">{{ ucfirst($lead->status ?? 'open') }}</div>
                    @if ($lead->complaint?->category)
                        <div class="meta">🏷️ {{ $lead->complaint->category }}</div>
                    @endif
                    @if ($lead->complaint?->description)
                        <div class="meta" style="margin-top: 4px;">{{ Str::limit($lead->complaint->description, 60) }}</div>
                    @endif
                    @if ($lead->assignedAgent)
                        <div class="meta">👤 {{ $lead->assignedAgent->name }}</div>
                    @endif
                </div>
            </a>
        @empty
            <div class="list-item" style="text-align: center; color: var(--text-muted); padding: 32px;">
                <p>✅ No complaints found.</p>
                <p style="font-size: 13px;">All caught up! Great work.</p>
            </div>
        @endforelse
    </div>
@endsection
