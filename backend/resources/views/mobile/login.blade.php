@extends('mobile.layout')

@section('title', 'Mobile Login')

@section('content')
    @include('mobile.partials.header', ['label' => 'Secure Login'])

    <h1>Welcome back</h1>
    <p>Use your support account to sign in and access live tickets.</p>

    <form method="POST" action="{{ route('mobile.login.submit') }}">
        @csrf
        <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" placeholder="agent@isp.com" value="{{ old('email') }}" />
        </div>
        <div class="field">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" />
        </div>
        <div class="actions">
            <button class="button" type="submit">Sign in</button>
            <a class="button secondary" href="{{ route('mobile.home') }}">Back</a>
        </div>
    </form>
@endsection
