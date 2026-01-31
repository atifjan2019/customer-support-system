import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Bell, LogOut, Building, History, TrendingUp } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();

    // Permission check helper
    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true;
        return user?.permissions?.includes(perm);
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>ISP Connect</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.role?.replace('_', ' ')}</p>
                </div>

                <nav style={{ flex: 1 }}>
                    {hasPermission('dashboard.view') && (
                        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard /> Dashboard
                        </NavLink>
                    )}

                    {hasPermission('leads.view') && (
                        <NavLink to="/leads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FileText /> Leads & Complaints
                        </NavLink>
                    )}

                    {hasPermission('companies.manage') && (
                        <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Building /> Companies
                        </NavLink>
                    )}

                    {hasPermission('users.manage') && (
                        <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Users /> Users
                        </NavLink>
                    )}

                    {hasPermission('logs.view') && (
                        <NavLink to="/logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <History /> Activity Logs
                        </NavLink>
                    )}

                    {hasPermission('reports.view') && (
                        <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <TrendingUp size={20} /> Reports
                        </NavLink>
                    )}

                    <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Bell /> Notifications
                    </NavLink>
                </nav>

                <button onClick={logout} className="nav-link" style={{ marginTop: 'auto', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
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
