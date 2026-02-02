@extends('mobile.layout')

@section('title', 'Lead Details')

@section('content')
    @include('mobile.partials.header', ['label' => 'Lead Details'])

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <h1 style="margin: 0;">{{ $lead->customer_name ?? 'Lead' }}</h1>
        <span class="badge badge-{{ $lead->status === 'resolved' ? 'success' : 'primary' }}">{{ ucfirst($lead->status ?? 'open') }}</span>
    </div>
    <p>{{ ucfirst($lead->lead_type ?? 'Request') }} • Priority: {{ ucfirst($lead->priority ?? 'Normal') }}</p>

    <div class="list">
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">📞</span>
                <div>
                    <strong>Phone</strong>
                    <div>{{ $lead->phone ?? 'Not provided' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">📍</span>
                <div>
                    <strong>Address</strong>
                    <div>{{ $lead->address ?? 'Not provided' }}</div>
                </div>
            </div>
        </div>
        @if ($lead->assignedAgent)
            <div class="list-item">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">👤</span>
                    <div>
                        <strong>Assigned Agent</strong>
                        <div>{{ $lead->assignedAgent->name }}</div>
                    </div>
                </div>
            </div>
        @endif
    </div>

    <div class="actions">
        <a class="button" href="{{ route('mobile.leads.edit', $lead) }}">Edit Lead</a>
        <form method="POST" action="{{ route('mobile.leads.destroy', $lead) }}" onsubmit="return confirm('Are you sure you want to delete this lead?');">
            @csrf
            @method('DELETE')
            <button class="button secondary" type="submit" style="width: 100%; color: var(--danger);">Delete Lead</button>
        </form>
        <a class="button secondary" href="{{ route('mobile.leads') }}">Back to Leads</a>
    </div>
@endsection
