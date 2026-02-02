@extends('mobile.layout')

@section('title', $mode === 'edit' ? 'Edit Lead' : 'Create Lead')

@section('content')
    @include('mobile.partials.header', ['label' => $mode === 'edit' ? 'Edit Lead' : 'New Lead'])

    <h1>{{ $mode === 'edit' ? 'Update lead' : 'Create a new lead' }}</h1>
    <p>Capture customer details for follow-up and assignment.</p>

    <form method="POST" action="{{ $mode === 'edit' ? route('mobile.leads.update', $lead) : route('mobile.leads.store') }}">
        @csrf
        @if ($mode === 'edit')
            @method('PUT')
        @endif

        <div class="field">
            <label for="customer_name">Customer name</label>
            <input id="customer_name" name="customer_name" type="text" value="{{ old('customer_name', $lead->customer_name) }}" />
        </div>
        <div class="field">
            <label for="phone">Phone</label>
            <input id="phone" name="phone" type="text" value="{{ old('phone', $lead->phone) }}" />
        </div>
        <div class="field">
            <label for="address">Address</label>
            <input id="address" name="address" type="text" value="{{ old('address', $lead->address) }}" />
        </div>
        <div class="field">
            <label for="lead_type">Lead type</label>
            <input id="lead_type" name="lead_type" type="text" value="{{ old('lead_type', $lead->lead_type) }}" />
        </div>
        <div class="field">
            <label for="status">Status</label>
            <input id="status" name="status" type="text" value="{{ old('status', $lead->status) }}" />
        </div>
        <div class="field">
            <label for="priority">Priority</label>
            <input id="priority" name="priority" type="text" value="{{ old('priority', $lead->priority) }}" />
        </div>

        <div class="actions">
            <button class="button" type="submit">{{ $mode === 'edit' ? 'Save changes' : 'Create lead' }}</button>
            <a class="button secondary" href="{{ route('mobile.leads') }}">Cancel</a>
        </div>
    </form>
@endsection
