@extends('mobile.layout')

@section('title', 'ISP Support')

@section('content')
    @include('mobile.partials.header', ['label' => 'ISP Support'])

    <h1>Customer Support Portal</h1>
    <p>
        Your complete mobile solution for managing customer complaints, tracking leads, and resolving issues faster.
    </p>

    <div class="list" style="margin-top: 20px;">
        <div class="list-item">
            <strong>📊 Real-time Dashboard</strong>
            <div>Monitor live metrics and ticket status</div>
        </div>
        <div class="list-item">
            <strong>📋 Lead Management</strong>
            <div>Track and assign customer requests</div>
        </div>
        <div class="list-item">
            <strong>⚡ Quick Resolution</strong>
            <div>Resolve complaints on the go</div>
        </div>
    </div>

    <div class="actions">
        @auth
            <a class="button" href="{{ route('mobile.dashboard') }}">Open Dashboard</a>
        @else
            <a class="button" href="{{ route('mobile.login') }}">Sign In</a>
            <a class="button secondary" href="{{ route('mobile.dashboard') }}">Preview Dashboard</a>
        @endauth
    </div>
@endsection
