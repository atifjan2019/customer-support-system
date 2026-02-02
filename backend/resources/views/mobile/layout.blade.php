<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'NativePHP Mobile')</title>
    <style>
        :root {
            color-scheme: light;
        }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }
        .container {
            padding: 24px;
            max-width: 520px;
            margin: 0 auto;
        }
        .card {
            background: #111827;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.45);
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(59, 130, 246, 0.15);
            color: #93c5fd;
            font-size: 12px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }
        h1 {
            margin: 16px 0 8px;
            font-size: 28px;
        }
        p {
            color: #cbd5f5;
            line-height: 1.6;
        }
        .actions {
            display: grid;
            gap: 12px;
            margin-top: 20px;
        }
        .button {
            text-decoration: none;
            color: #0f172a;
            background: #38bdf8;
            padding: 12px 16px;
            border-radius: 12px;
            font-weight: 600;
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
        .button.secondary {
            background: transparent;
            color: #e2e8f0;
            border: 1px solid rgba(148, 163, 184, 0.4);
        }
        .nav {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .nav a {
            color: #94a3b8;
            text-decoration: none;
        }
        .nav a.active {
            color: #e2e8f0;
            font-weight: 600;
        }
        .field {
            display: grid;
            gap: 6px;
            margin-bottom: 12px;
        }
        .field label {
            font-size: 12px;
            color: #94a3b8;
        }
        .field input {
            padding: 12px;
            border-radius: 10px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: #0b1120;
            color: #e2e8f0;
        }
        .list {
            display: grid;
            gap: 12px;
            margin-top: 16px;
        }
        .list-item {
            background: rgba(15, 23, 42, 0.7);
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        @mobile
            <native:top-bar title="ISP Support" subtitle="Mobile" />
        @endmobile
        <div class="nav">
            <a href="{{ route('mobile.home') }}" class="{{ request()->routeIs('mobile.home') ? 'active' : '' }}">Home</a>
            <a href="{{ route('mobile.login') }}" class="{{ request()->routeIs('mobile.login') ? 'active' : '' }}">Login</a>
            <a href="{{ route('mobile.dashboard') }}" class="{{ request()->routeIs('mobile.dashboard') ? 'active' : '' }}">Dashboard</a>
            <a href="{{ route('mobile.leads') }}" class="{{ request()->routeIs('mobile.leads') ? 'active' : '' }}">Leads</a>
            <a href="{{ route('mobile.complaints') }}" class="{{ request()->routeIs('mobile.complaints') ? 'active' : '' }}">Complaints</a>
            <a href="{{ route('mobile.settings') }}" class="{{ request()->routeIs('mobile.settings') ? 'active' : '' }}">Settings</a>
        </div>
        <div class="card">
            @if (session('status'))
                <div class="list-item" style="border-color: rgba(56, 189, 248, 0.5); color: #bae6fd;">
                    {{ session('status') }}
                </div>
                <div style="height: 12px;"></div>
            @endif
            @if ($errors->any())
                <div class="list-item" style="border-color: rgba(248, 113, 113, 0.5); color: #fecaca;">
                    {{ $errors->first() }}
                </div>
                <div style="height: 12px;"></div>
            @endif
            @yield('content')
        </div>
    </div>
</body>
</html>
