@extends('mobile.layout')

@section('title', 'Settings')

@section('content')
    @include('mobile.partials.header', ['label' => 'Settings'])

    <h1>Device & Sync</h1>
    <p>Manage notifications and offline sync preferences.</p>

    <div class="list">
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: var(--primary-light); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="none" stroke="var(--primary)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </div>
                <div style="flex: 1;">
                    <strong>Push Token</strong>
                    <div style="font-size: 12px; word-break: break-all;">{{ $pushToken ? Str::limit($pushToken, 30) : 'Not enrolled' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: {{ $network?->connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="none" stroke="{{ $network?->connected ? 'var(--success)' : 'var(--danger)' }}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                </div>
                <div style="flex: 1;">
                    <strong>Network Status</strong>
                    <div style="font-size: 12px;">{{ $network?->connected ? 'Connected' : 'Offline' }}{{ $network?->type ? ' (' . ucfirst($network->type) . ')' : '' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: rgba(59, 130, 246, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="none" stroke="#3b82f6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <div style="flex: 1;">
                    <strong>Last Sync</strong>
                    <div style="font-size: 12px;">{{ $syncStatus['last_synced_at'] ?? 'Never synced' }}</div>
                </div>
            </div>
        </div>
        <div class="list-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: rgba(245, 158, 11, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="none" stroke="var(--warning)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path></svg>
                </div>
                <div style="flex: 1;">
                    <strong>Cached Data</strong>
                    <div style="font-size: 12px;">{{ $syncStatus['leads_count'] ?? 0 }} leads • {{ $syncStatus['complaints_count'] ?? 0 }} complaints</div>
                </div>
            </div>
        </div>
    </div>

    <div class="actions">
        <form method="POST" action="{{ route('mobile.settings.push.enroll') }}">
            @csrf
            <button class="button" type="submit" style="width: 100%;">Enable Push Notifications</button>
        </form>
        <form method="POST" action="{{ route('mobile.settings.sync') }}">
            @csrf
            <button class="button secondary" type="submit" style="width: 100%;">Sync Now</button>
        </form>
    </div>
@endsection
