@extends('mobile.layout')

@section('title', 'Complaint Details')

@section('content')
    @include('mobile.partials.header', ['label' => 'Complaint'])

    <h1>{{ $lead->customer_name ?? 'Complaint' }}</h1>
    <p>{{ ucfirst($lead->status ?? 'open') }} • Severity: {{ $lead->complaint->severity ?? 'normal' }}</p>

    <div class="list">
        <div class="list-item">
            <strong>Category</strong>
            <div>{{ $lead->complaint->category ?? 'N/A' }}</div>
        </div>
        <div class="list-item">
            <strong>Description</strong>
            <div>{{ $lead->complaint->description ?? 'N/A' }}</div>
        </div>
        <div class="list-item">
            <strong>Priority</strong>
            <div>{{ $lead->priority ?? 'high' }}</div>
        </div>
        @if ($lead->assignedAgent)
            <div class="list-item">
                <strong>Assigned agent</strong>
                <div>{{ $lead->assignedAgent->name }}</div>
            </div>
        @endif
    </div>

    @if ($lead->status !== 'resolved')
        <h2 style="margin-top: 24px; font-size: 18px;">Resolve complaint</h2>
        <form method="POST" action="{{ route('mobile.complaints.resolve', $lead) }}">
            @csrf
            <div class="field">
                <label for="resolution_notes">Resolution notes</label>
                <input id="resolution_notes" name="resolution_notes" type="text" placeholder="Describe the fix" />
            </div>
            <div class="actions">
                <button class="button" type="submit">Mark resolved</button>
            </div>
        </form>
    @else
        <div class="list-item" style="margin-top: 16px;">
            <strong>Resolution</strong>
            <div>{{ $lead->complaint->resolution_notes ?? 'Resolved' }}</div>
        </div>
    @endif

    <div class="actions">
        <a class="button" href="{{ route('mobile.complaints.edit', $lead) }}">Edit</a>
        <form method="POST" action="{{ route('mobile.complaints.destroy', $lead) }}">
            @csrf
            @method('DELETE')
            <button class="button secondary" type="submit">Delete</button>
        </form>
        <a class="button secondary" href="{{ route('mobile.complaints') }}">Back</a>
    </div>
@endsection
