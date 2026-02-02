@extends('mobile.layout')

@section('title', 'Lead Details')

@section('content')
    @include('mobile.partials.header', ['label' => 'Lead Details'])

    <h1>{{ $lead->customer_name ?? 'Lead' }}</h1>
    <p>{{ ucfirst($lead->lead_type ?? 'request') }} • {{ ucfirst($lead->status ?? 'open') }}</p>

    <div class="list">
        <div class="list-item">
            <strong>Phone</strong>
            <div>{{ $lead->phone ?? 'N/A' }}</div>
        </div>
        <div class="list-item">
            <strong>Address</strong>
            <div>{{ $lead->address ?? 'N/A' }}</div>
        </div>
        <div class="list-item">
            <strong>Priority</strong>
            <div>{{ $lead->priority ?? 'normal' }}</div>
        </div>
        @if ($lead->assignedAgent)
            <div class="list-item">
                <strong>Assigned agent</strong>
                <div>{{ $lead->assignedAgent->name }}</div>
            </div>
        @endif
    </div>

    <div class="actions">
        <a class="button" href="{{ route('mobile.leads.edit', $lead) }}">Edit</a>
        <form method="POST" action="{{ route('mobile.leads.destroy', $lead) }}">
            @csrf
            @method('DELETE')
            <button class="button secondary" type="submit">Delete</button>
        </form>
        <a class="button secondary" href="{{ route('mobile.leads') }}">Back</a>
    </div>
@endsection
