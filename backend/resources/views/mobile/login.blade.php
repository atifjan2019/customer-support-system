@extends('mobile.layout')

@section('title', 'Sign In')

@section('content')
    @include('mobile.partials.header', ['label' => 'Welcome Back'])

    <h1>Sign in to continue</h1>
    <p>Access your support dashboard and manage tickets on the go.</p>

    <form method="POST" action="{{ route('mobile.login.submit') }}" autocomplete="on">
        @csrf
        <div class="field">
            <label for="email">Email Address</label>
            <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@company.com" 
                value="{{ old('email') }}"
                autocomplete="email"
                inputmode="email"
                required
            />
        </div>
        <div class="field">
            <label for="password">Password</label>
            <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Enter your password"
                autocomplete="current-password"
                required
            />
        </div>
        <div class="actions">
            <button class="button" type="submit">Sign In</button>
            <a class="button secondary" href="{{ route('mobile.home') }}">Back to Home</a>
        </div>
    </form>
@endsection
