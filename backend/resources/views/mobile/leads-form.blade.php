@extends('mobile.layout')

@section('title', $mode === 'edit' ? 'Edit Lead' : 'Create Lead')

@section('content')
    @include('mobile.partials.header', ['label' => $mode === 'edit' ? 'Edit Lead' : 'New Lead'])

    <h1>{{ $mode === 'edit' ? 'Update Lead' : 'Create New Lead' }}</h1>
    <p>{{ $mode === 'edit' ? 'Modify customer details below.' : 'Capture customer details for follow-up.' }}</p>

    <form method="POST" action="{{ $mode === 'edit' ? route('mobile.leads.update', $lead) : route('mobile.leads.store') }}">
        @csrf
        @if ($mode === 'edit')
            @method('PUT')
        @endif

        <div class="field">
            <label for="customer_name">Customer Name</label>
            <input id="customer_name" name="customer_name" type="text" placeholder="John Doe" value="{{ old('customer_name', $lead->customer_name) }}" required />
        </div>
        <div class="field">
            <label for="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" inputmode="tel" placeholder="+1 234 567 8900" value="{{ old('phone', $lead->phone) }}" />
        </div>
        <div class="field">
            <label for="address">Address</label>
            <input id="address" name="address" type="text" placeholder="123 Main Street" value="{{ old('address', $lead->address) }}" />
        </div>
        <div class="field">
            <label for="lead_type">Lead Type</label>
            <input id="lead_type" name="lead_type" type="text" placeholder="Installation, Support, Upgrade" value="{{ old('lead_type', $lead->lead_type) }}" />
        </div>
        <div class="field">
            <label for="status">Status</label>
            <input id="status" name="status" type="text" placeholder="pending, in-progress, resolved" value="{{ old('status', $lead->status) }}" />
        </div>
        <div class="field">
            <label for="priority">Priority</label>
            <input id="priority" name="priority" type="text" placeholder="low, normal, high" value="{{ old('priority', $lead->priority) }}" />
        </div>

        <div class="actions">
            <button class="button" type="submit">{{ $mode === 'edit' ? 'Save Changes' : 'Create Lead' }}</button>
            <a class="button secondary" href="{{ route('mobile.leads') }}">Cancel</a>
        </div>
    </form>
@endsection
