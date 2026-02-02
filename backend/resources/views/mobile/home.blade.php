@extends('mobile.layout')

@section('title', 'Mobile Home')

@section('content')
    @include('mobile.partials.header', ['label' => 'NativePHP Mobile'])

    <h1>Support app on the go</h1>
    <p>
        This is the first NativePHP screen for your customer support system. From here you can sign in,
        check open complaints, and monitor new leads.
    </p>

    <div class="actions">
        @auth
            <a class="button" href="{{ route('mobile.dashboard') }}">Open dashboard</a>
            <form method="POST" action="{{ route('mobile.logout') }}">
                @csrf
                <button class="button secondary" type="submit">Sign out</button>
            </form>
        @else
            <a class="button" href="{{ route('mobile.login') }}">Sign in</a>
            <a class="button secondary" href="{{ route('mobile.dashboard') }}">Preview dashboard</a>
        @endauth
    </div>
@endsection
