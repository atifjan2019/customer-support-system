@extends('mobile.layout')

@section('title', 'Leads')

@section('content')
    @include('mobile.partials.header', ['label' => 'Leads'])

    <h1>Latest leads</h1>
    <p>Review the most recent customer requests and assignments.</p>

    <div class="actions">
        <a class="button" href="{{ route('mobile.leads.create') }}">Create lead</a>
    </div>

    <div class="list">
        @forelse ($leads as $lead)
            <div class="list-item">
                <strong>
                    <a href="{{ route('mobile.leads.show', $lead) }}" style="color: inherit; text-decoration: none;">
                        {{ $lead->customer_name ?? $lead->company ?? 'Lead' }}
                    </a>
                </strong>
                <div>{{ ucfirst($lead->lead_type ?? 'request') }} • {{ ucfirst($lead->status ?? 'open') }}</div>
                <div style="color:#94a3b8; font-size: 12px;">
                    Priority: {{ $lead->priority ?? 'normal' }}
                </div>
                @if ($lead->phone)
                    <div style="color:#94a3b8; font-size: 12px;">{{ $lead->phone }}</div>
                @endif
                @if ($lead->assignedAgent)
                    <div style="color:#94a3b8; font-size: 12px;">Assigned to {{ $lead->assignedAgent->name }}</div>
                @endif
            </div>
        @empty
            <div class="list-item">No leads found yet.</div>
        @endforelse
    </div>
@endsection
