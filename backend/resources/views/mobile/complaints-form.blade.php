@extends('mobile.layout')

@section('title', $mode === 'edit' ? 'Edit Complaint' : 'Log Complaint')

@section('content')
    @include('mobile.partials.header', ['label' => $mode === 'edit' ? 'Edit Complaint' : 'New Complaint'])

    <h1>{{ $mode === 'edit' ? 'Update Complaint' : 'Log New Complaint' }}</h1>
    <p>{{ $mode === 'edit' ? 'Modify complaint details below.' : 'Record customer complaints for quick resolution.' }}</p>

    <form method="POST" action="{{ $mode === 'edit' ? route('mobile.complaints.update', $lead) : route('mobile.complaints.store') }}">
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
            <label for="priority">Priority</label>
            <input id="priority" name="priority" type="text" placeholder="low, normal, high, urgent" value="{{ old('priority', $lead->priority) }}" />
        </div>
        <div class="field">
            <label for="category">Category</label>
            <input id="category" name="category" type="text" placeholder="Billing, Technical, Service" value="{{ old('category', $complaint->category ?? '') }}" />
        </div>
        <div class="field">
            <label for="severity">Severity</label>
            <input id="severity" name="severity" type="text" placeholder="low, medium, high, critical" value="{{ old('severity', $complaint->severity ?? '') }}" />
        </div>
        <div class="field">
            <label for="description">Description</label>
            <input id="description" name="description" type="text" placeholder="Describe the issue..." value="{{ old('description', $complaint->description ?? '') }}" />
        </div>

        <div class="actions">
            <button class="button" type="submit">{{ $mode === 'edit' ? 'Save Changes' : 'Log Complaint' }}</button>
            <a class="button secondary" href="{{ route('mobile.complaints') }}">Cancel</a>
        </div>
    </form>
@endsection
