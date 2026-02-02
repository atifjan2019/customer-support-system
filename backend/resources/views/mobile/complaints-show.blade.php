@extends('mobile.layout')

@section('title', 'Complaint Details')

@section('content')
    @include('mobile.partials.header', ['label' => 'Complaint Details'])

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <h1 style="margin: 0;">{{ $lead->customer_name ?? 'Complaint' }}</h1>
        <span class="badge badge-{{ $lead->status === 'resolved' ? 'success' : 'warning' }}">{{ ucfirst($lead->complaint->severity ?? 'normal') }}</span>
    </div>
    <p>{{ ucfirst($lead->status ?? 'Open') }} Complaint</p>

    <div class="list">
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">🏷️</span>
                <div>
                    <strong>Category</strong>
                    <div>{{ $lead->complaint->category ?? 'Not specified' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">📝</span>
                <div>
                    <strong>Description</strong>
                    <div>{{ $lead->complaint->description ?? 'No description provided' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">⚡</span>
                <div>
                    <strong>Priority</strong>
                    <div>{{ ucfirst($lead->priority ?? 'High') }}</div>
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

    @if ($lead->status !== 'resolved')
        <h2>Resolve Complaint</h2>
        <form method="POST" action="{{ route('mobile.complaints.resolve', $lead) }}">
            @csrf
            <div class="field">
                <label for="resolution_notes">Resolution Notes</label>
                <input id="resolution_notes" name="resolution_notes" type="text" placeholder="Describe how the issue was resolved..." required />
            </div>
            <div class="actions" style="margin-top: 12px;">
                <button class="button" type="submit" style="background: var(--success);">Mark as Resolved</button>
            </div>
        </form>
    @else
        <div class="list" style="margin-top: 20px;">
            <div class="list-item" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">✅</span>
                    <div>
                        <strong style="color: #059669;">Resolution</strong>
                        <div>{{ $lead->complaint->resolution_notes ?? 'Resolved' }}</div>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <div class="actions">
        <a class="button" href="{{ route('mobile.complaints.edit', $lead) }}">Edit Complaint</a>
        <form method="POST" action="{{ route('mobile.complaints.destroy', $lead) }}" onsubmit="return confirm('Are you sure you want to delete this complaint?');">
            @csrf
            @method('DELETE')
            <button class="button secondary" type="submit" style="width: 100%; color: var(--danger);">Delete Complaint</button>
        </form>
        <a class="button secondary" href="{{ route('mobile.complaints') }}">Back to Complaints</a>
    </div>
@endsection
