import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Bell, LogOut, Building, History, TrendingUp, Menu, X } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();

    // Permission check helper
    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true;
        return user?.permissions?.includes(perm);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            logout();
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h2 className="mobile-logo">ISP Connect</h2>
                <button className="mobile-logout" onClick={handleLogout}>
                    <LogOut size={20} />
                </button>
            </header>

            <aside className={`sidebar ${isMenuOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>ISP Connect</h2>
                        {isMenuOpen && <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsMenuOpen(false)} />}
                    </div>
                    <p className="desktop-only" style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>{user?.role?.replace('_', ' ')}</p>
                </div>

                <nav style={{ flex: 1 }}>
                    {[
                        { to: "/", icon: <LayoutDashboard />, label: "Dashboard", perm: "dashboard.view" },
                        { to: "/leads", icon: <FileText />, label: "Leads & Complaints", perm: "leads.view" },
                        { to: "/companies", icon: <Building />, label: "Companies", perm: "companies.manage" },
                        { to: "/users", icon: <Users />, label: "Users", perm: "users.manage" },
                        { to: "/logs", icon: <History />, label: "Activity Logs", perm: "logs.view" },
                        { to: "/reports", icon: <TrendingUp size={20} />, label: "Reports", perm: "reports.view" },
                    ].map(item => {
                        // Special case: hide dashboard for tech_team as They don't care about it
                        if (item.to === '/' && user?.role === 'tech_team') return null;

                        return hasPermission(item.perm) && (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.icon} {item.label}
                            </NavLink>
                        );
                    })}

                    <NavLink
                        to="/notifications"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Bell /> Notifications
                    </NavLink>
                </nav>

                <button onClick={handleLogout} className="nav-link" style={{ marginTop: 'auto', background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut /> Sign Out
                </button>
            </aside>

            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 900,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Welcome back, {user?.name}</h1>
                </header>
                <Outlet />
            </main>
        </div>
    );
}
