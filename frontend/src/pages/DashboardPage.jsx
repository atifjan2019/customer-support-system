import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard_stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data;
        },
    });

    if (isLoading) return <div className="text-center p-4">Loading dashboard...</div>;
    if (error) return <div className="text-center p-4 text-danger">Error loading stats</div>;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Leads</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.total_leads}</p>
                </div>
                <div className="card">
                    <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Open Complaints</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.open_complaints}</p>
                </div>
                <div className="card">
                    <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Resolved Today</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.resolved_today}</p>
                </div>
                <div className="card">
                    <h3 className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pending Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.pending_requests}</p>
                </div>
            </div>

            {/* Desktop View */}
            <div className="card table-responsive desktop-only" style={{ padding: 0 }}>
                <h2 style={{ fontSize: '1.25rem', padding: '1.5rem', marginBottom: 0 }}>Recent Activity</h2>
                {stats.recent_activity.length === 0 ? (
                    <p className="text-muted" style={{ padding: '1.5rem' }}>No recent activity to show.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Type</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_activity.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{lead.customer_name}</td>
                                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{lead.lead_type.replace('_', ' ')}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${lead.status === 'resolved' ? 'badge-open' : 'badge-open'}`} style={{ textTransform: 'capitalize', backgroundColor: lead.status === 'resolved' ? 'var(--success)' : '', color: lead.status === 'resolved' ? 'white' : '' }}>
                                            {lead.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile View */}
            <div className="mobile-only">
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Recent Activity</h2>
                {stats.recent_activity.length === 0 ? (
                    <p className="text-muted">No recent activity to show.</p>
                ) : (
                    <div className="leads-mobile-grid">
                        {stats.recent_activity.map(lead => (
                            <div key={lead.id} className="lead-card">
                                <div>
                                    <div className="lead-card-type" style={{ color: lead.lead_type === 'complaint' ? 'var(--danger)' : 'var(--success)' }}>
                                        {lead.lead_type.replace('_', ' ')}
                                    </div>
                                    <div className="lead-card-name">{lead.customer_name}</div>
                                </div>
                                <div className="lead-card-footer">
                                    <div className="lead-card-time">
                                        {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(/ /g, '/')}
                                    </div>
                                    <div className="lead-card-status-dot" style={{ backgroundColor: lead.status === 'resolved' ? 'var(--success)' : 'var(--warning)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
