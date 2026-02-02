@extends('mobile.layout')

@section('title', 'Settings')

@section('content')
    @include('mobile.partials.header', ['label' => 'Settings'])

    <h1>Device & Sync</h1>
    <p>Manage push notifications and offline sync snapshots.</p>

    <div class="list">
        <div class="list-item">
            <strong>Push token</strong>
            <div style="word-break: break-all;">{{ $pushToken ?? 'Not enrolled yet' }}</div>
        </div>
        <div class="list-item">
            <strong>Network</strong>
            <div>
                {{ $network?->connected ? 'Connected' : 'Offline' }}
                @if ($network?->type)
                    • {{ ucfirst($network->type) }}
                @endif
            </div>
        </div>
        <div class="list-item">
            <strong>Last sync</strong>
            <div>{{ $syncStatus['last_synced_at'] ?? 'Never' }}</div>
        </div>
        <div class="list-item">
            <strong>Cached leads</strong>
            <div>{{ $syncStatus['leads_count'] ?? 0 }}</div>
        </div>
        <div class="list-item">
            <strong>Cached complaints</strong>
            <div>{{ $syncStatus['complaints_count'] ?? 0 }}</div>
        </div>
    </div>

    <div class="actions">
        <form method="POST" action="{{ route('mobile.settings.push.enroll') }}">
            @csrf
            <button class="button" type="submit">Enable push notifications</button>
        </form>
        <form method="POST" action="{{ route('mobile.settings.sync') }}">
            @csrf
            <button class="button secondary" type="submit">Sync now</button>
        </form>
    </div>
@endsection
