<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#EE314F">
    <title>@yield('title', 'ISP Support')</title>
    <style>
        :root {
            --primary: #EE314F;
            --primary-hover: #c91e3b;
            --primary-light: rgba(238, 49, 79, 0.1);
            --text-dark: #1a1a1a;
            --text-muted: #64748b;
            --bg-white: #ffffff;
            --bg-gray: #f8fafc;
            --border: #e2e8f0;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
            color-scheme: light;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--bg-gray);
            color: var(--text-dark);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }
        .app-header {
            background: var(--primary);
            color: white;
            padding: 16px 20px;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow-md);
        }
        .app-header-content {
            max-width: 520px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .app-logo {
            font-weight: 700;
            font-size: 18px;
            letter-spacing: -0.02em;
        }
        .app-logo span {
            font-weight: 400;
            opacity: 0.85;
        }
        .container {
            padding: 20px;
            max-width: 520px;
            margin: 0 auto;
            padding-bottom: 100px;
        }
        .card {
            background: var(--bg-white);
            border-radius: 16px;
            padding: 24px;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border);
        }
        .pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 999px;
            background: var(--primary-light);
            color: var(--primary);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.02em;
            text-transform: uppercase;
        }
        h1 {
            margin: 20px 0 8px;
            font-size: 26px;
            font-weight: 700;
            color: var(--text-dark);
            letter-spacing: -0.02em;
        }
        h2 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-dark);
            margin-top: 24px;
            margin-bottom: 12px;
        }
        p {
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .actions {
            display: grid;
            gap: 12px;
            margin-top: 24px;
        }
        .button {
            text-decoration: none;
            color: white;
            background: var(--primary);
            padding: 14px 20px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-sm);
        }
        .button:hover, .button:active {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        .button.secondary {
            background: var(--bg-white);
            color: var(--text-dark);
            border: 1.5px solid var(--border);
        }
        .button.secondary:hover, .button.secondary:active {
            background: var(--bg-gray);
            border-color: #cbd5e1;
        }
        .nav {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            padding: 16px 20px;
            background: var(--bg-white);
            border-bottom: 1px solid var(--border);
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }
        .nav::-webkit-scrollbar {
            display: none;
        }
        .nav a {
            color: var(--text-muted);
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s ease;
        }
        .nav a:hover {
            color: var(--text-dark);
            background: var(--bg-gray);
        }
        .nav a.active {
            color: var(--primary);
            background: var(--primary-light);
            font-weight: 600;
        }
        .field {
            display: grid;
            gap: 8px;
            margin-bottom: 16px;
        }
        .field label {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-dark);
        }
        .field input, .field select, .field textarea {
            padding: 14px 16px;
            border-radius: 12px;
            border: 1.5px solid var(--border);
            background: var(--bg-white);
            color: var(--text-dark);
            font-size: 16px;
            transition: all 0.2s ease;
            width: 100%;
        }
        .field input:focus, .field select:focus, .field textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-light);
        }
        .field input::placeholder {
            color: #94a3b8;
        }
        .list {
            display: grid;
            gap: 12px;
            margin-top: 16px;
        }
        .list-item {
            background: var(--bg-white);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid var(--border);
            transition: all 0.2s ease;
        }
        .list-item:hover {
            border-color: #cbd5e1;
            box-shadow: var(--shadow-sm);
        }
        .list-item strong {
            display: block;
            color: var(--text-dark);
            font-weight: 600;
            margin-bottom: 4px;
        }
        .list-item div {
            color: var(--text-muted);
            font-size: 14px;
        }
        .alert {
            padding: 14px 16px;
            border-radius: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            font-weight: 500;
        }
        .alert-success {
            background: rgba(16, 185, 129, 0.1);
            color: #047857;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .meta {
            color: var(--text-muted);
            font-size: 13px;
            margin-top: 4px;
        }
        .badge {
            display: inline-flex;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }
        .badge-primary {
            background: var(--primary-light);
            color: var(--primary);
        }
        .badge-success {
            background: rgba(16, 185, 129, 0.15);
            color: #059669;
        }
        .badge-warning {
            background: rgba(245, 158, 11, 0.15);
            color: #d97706;
        }
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--bg-white);
            border-top: 1px solid var(--border);
            padding: 8px 16px;
            padding-bottom: max(8px, env(safe-area-inset-bottom));
            display: none;
        }
        @media (max-width: 520px) {
            .nav {
                display: none;
            }
            .bottom-nav {
                display: flex;
                justify-content: space-around;
            }
            .bottom-nav a {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                color: var(--text-muted);
                text-decoration: none;
                font-size: 11px;
                font-weight: 500;
                padding: 6px 12px;
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            .bottom-nav a.active {
                color: var(--primary);
            }
            .bottom-nav svg {
                width: 22px;
                height: 22px;
            }
        }
    </style>
</head>
<body>
    <header class="app-header">
        <div class="app-header-content">
            <div class="app-logo">ISP <span>Support</span></div>
            @auth
                <form method="POST" action="{{ route('mobile.logout') }}" style="margin: 0;">
                    @csrf
                    <button type="submit" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;">Sign out</button>
                </form>
            @endauth
        </div>
    </header>

    <nav class="nav">
        <a href="{{ route('mobile.home') }}" class="{{ request()->routeIs('mobile.home') ? 'active' : '' }}">Home</a>
        @guest
            <a href="{{ route('mobile.login') }}" class="{{ request()->routeIs('mobile.login') ? 'active' : '' }}">Login</a>
        @endguest
        @auth
            <a href="{{ route('mobile.dashboard') }}" class="{{ request()->routeIs('mobile.dashboard') ? 'active' : '' }}">Dashboard</a>
            <a href="{{ route('mobile.leads') }}" class="{{ request()->routeIs('mobile.leads*') ? 'active' : '' }}">Leads</a>
            <a href="{{ route('mobile.complaints') }}" class="{{ request()->routeIs('mobile.complaints*') ? 'active' : '' }}">Complaints</a>
            <a href="{{ route('mobile.settings') }}" class="{{ request()->routeIs('mobile.settings') ? 'active' : '' }}">Settings</a>
        @endauth
    </nav>

    <div class="container">
        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif
        @if ($errors->any())
            <div class="alert alert-error">
                {{ $errors->first() }}
            </div>
        @endif
        <div class="card">
            @yield('content')
        </div>
    </div>

    <nav class="bottom-nav">
        <a href="{{ route('mobile.home') }}" class="{{ request()->routeIs('mobile.home') ? 'active' : '' }}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Home
        </a>
        @auth
            <a href="{{ route('mobile.dashboard') }}" class="{{ request()->routeIs('mobile.dashboard') ? 'active' : '' }}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Dashboard
            </a>
            <a href="{{ route('mobile.leads') }}" class="{{ request()->routeIs('mobile.leads*') ? 'active' : '' }}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Leads
            </a>
            <a href="{{ route('mobile.complaints') }}" class="{{ request()->routeIs('mobile.complaints*') ? 'active' : '' }}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Complaints
            </a>
            <a href="{{ route('mobile.settings') }}" class="{{ request()->routeIs('mobile.settings') ? 'active' : '' }}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Settings
            </a>
        @else
            <a href="{{ route('mobile.login') }}" class="{{ request()->routeIs('mobile.login') ? 'active' : '' }}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                Login
            </a>
        @endauth
    </nav>
</body>
</html>
