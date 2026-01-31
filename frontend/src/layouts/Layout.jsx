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

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <header className="mobile-header" style={{
                display: 'none',
                padding: '0.75rem 1rem',
                backgroundColor: '#000',
                color: 'white',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                borderBottom: '1px solid #333'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>ISP Connect</h2>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <LogOut size={20} />
                </button>
            </header>

            <aside className={`sidebar ${isMenuOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>ISP Connect</h2>
                        {isMenuOpen && <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsMenuOpen(false)} />}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>{user?.role?.replace('_', ' ')}</p>
                </div>

                <nav style={{ flex: 1 }}>
                    {[
                        { to: "/", icon: <LayoutDashboard />, label: "Dashboard", perm: "dashboard.view" },
                        { to: "/leads", icon: <FileText />, label: "Leads & Complaints", perm: "leads.view" },
                        { to: "/companies", icon: <Building />, label: "Companies", perm: "companies.manage" },
                        { to: "/users", icon: <Users />, label: "Users", perm: "users.manage" },
                        { to: "/logs", icon: <History />, label: "Activity Logs", perm: "logs.view" },
                        { to: "/reports", icon: <TrendingUp size={20} />, label: "Reports", perm: "reports.view" },
                    ].map(item => hasPermission(item.perm) && (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}

                    <NavLink
                        to="/notifications"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Bell /> Notifications
                    </NavLink>
                </nav>

                <button onClick={logout} className="nav-link" style={{ marginTop: 'auto', background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut /> Sign Out
                </button>
            </aside>

            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Welcome back, {user?.name}</h1>
                    <div className="card" style={{ padding: '0.5rem 1rem' }}>
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                    </div>
                </header>
                <Outlet />
            </main>
        </div>
    );
}
