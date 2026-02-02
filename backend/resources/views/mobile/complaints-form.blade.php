@extends('mobile.layout')

@section('title', $mode === 'edit' ? 'Edit Complaint' : 'Log Complaint')

@section('content')
    @include('mobile.partials.header', ['label' => $mode === 'edit' ? 'Edit Complaint' : 'New Complaint'])

    <h1>{{ $mode === 'edit' ? 'Update complaint' : 'Log a complaint' }}</h1>
    <p>Record customer complaints and severity for quick response.</p>

    <form method="POST" action="{{ $mode === 'edit' ? route('mobile.complaints.update', $lead) : route('mobile.complaints.store') }}">
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
            <label for="priority">Priority</label>
            <input id="priority" name="priority" type="text" value="{{ old('priority', $lead->priority) }}" />
        </div>
        <div class="field">
            <label for="category">Category</label>
            <input id="category" name="category" type="text" value="{{ old('category', $complaint->category ?? '') }}" />
        </div>
        <div class="field">
            <label for="severity">Severity</label>
            <input id="severity" name="severity" type="text" value="{{ old('severity', $complaint->severity ?? '') }}" />
        </div>
        <div class="field">
            <label for="description">Description</label>
            <input id="description" name="description" type="text" value="{{ old('description', $complaint->description ?? '') }}" />
        </div>

        <div class="actions">
            <button class="button" type="submit">{{ $mode === 'edit' ? 'Save changes' : 'Create complaint' }}</button>
            <a class="button secondary" href="{{ route('mobile.complaints') }}">Cancel</a>
        </div>
    </form>
@endsection
