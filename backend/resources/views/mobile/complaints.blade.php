@extends('mobile.layout')

@section('title', 'Complaints')

@section('content')
    @include('mobile.partials.header', ['label' => 'Complaints'])

    <h1>Open complaints</h1>
    <p>Track urgent customer issues and update resolution notes.</p>

    <div class="actions">
        <a class="button" href="{{ route('mobile.complaints.create') }}">Log complaint</a>
    </div>

    <div class="list">
        @forelse ($leads as $lead)
            <div class="list-item">
                <strong>
                    <a href="{{ route('mobile.complaints.show', $lead) }}" style="color: inherit; text-decoration: none;">
                        {{ $lead->customer_name ?? $lead->company ?? 'Complaint' }}
                    </a>
                </strong>
                <div>{{ ucfirst($lead->status ?? 'open') }} • Severity: {{ $lead->complaint->severity ?? 'normal' }}</div>
                @if ($lead->complaint?->category)
                    <div style="color:#94a3b8; font-size: 12px;">{{ $lead->complaint->category }}</div>
                @endif
                @if ($lead->complaint?->description)
                    <div style="color:#94a3b8; font-size: 12px;">{{ $lead->complaint->description }}</div>
                @endif
                @if ($lead->assignedAgent)
                    <div style="color:#94a3b8; font-size: 12px;">Assigned to {{ $lead->assignedAgent->name }}</div>
                @endif
            </div>
        @empty
            <div class="list-item">No complaints found.</div>
        @endforelse
    </div>
@endsection
