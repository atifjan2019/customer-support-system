import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { History, User, Activity, Calendar, Search, Building, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogsPage() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');

    const { data: logsData, isLoading } = useQuery({
        queryKey: ['activity_logs', selectedDate, selectedCompany],
        queryFn: async () => {
            const { data } = await api.get('/logs', {
                params: {
                    date: selectedDate,
                    company_id: selectedCompany
                }
            });
            return data.data || data;
        },
    });

    const { data: companies = [] } = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const { data } = await api.get('/companies');
            return data;
        },
        enabled: user?.role === 'super_admin'
    });

    if (isLoading) return <div className="text-center p-4">Loading system logs...</div>;

    const logs = Array.isArray(logsData) ? logsData : [];

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Activity Logs</h2>
                    <p className="text-muted">Audit trail of all system actions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4" style={{ padding: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                        <input
                            type="text"
                            placeholder="Search actions, users..."
                            className="form-control"
                            style={{ paddingLeft: '2.5rem', height: '42px', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {user?.role === 'super_admin' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0 0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', height: '42px' }}>
                            <Building size={16} className="text-muted" />
                            <select
                                className="form-control"
                                style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.9rem', width: 'auto', minWidth: '150px' }}
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0 0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', height: '42px' }}>
                        <Calendar size={16} className="text-muted" />
                        <input
                            type="date"
                            className="form-control"
                            style={{
                                width: 'auto',
                                border: 'none',
                                background: 'transparent',
                                padding: 0,
                                fontSize: '0.9rem',
                                color: 'var(--text-main)'
                            }}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {selectedDate && (
                            <button
                                className="btn"
                                style={{ padding: '0.25rem', color: 'var(--danger)', marginLeft: '0.25rem' }}
                                onClick={() => setSelectedDate('')}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="card table-responsive desktop-only" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Performed By</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr><td colSpan="4" className="text-center" style={{ padding: '2rem' }}>No activity logs found.</td></tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Activity size={16} color="var(--primary)" />
                                            <span style={{ fontWeight: 600 }}>{log.action}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{log.description}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <User size={14} className="text-muted" />
                                            {log.user?.name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={12} />
                                            {new Date(log.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                                            <span style={{ opacity: 0.5 }}>•</span>
                                            {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="mobile-only">
                {filteredLogs.length === 0 ? (
                    <div className="text-center p-4">No activity logs found.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredLogs.map(log => (
                            <div key={log.id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Activity size={16} color="var(--primary)" />
                                        <span style={{ fontWeight: 600 }}>{log.action}</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(log.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(/ /g, '/')}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>{log.description}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <User size={12} className="text-muted" />
                                        {log.user?.name || 'Unknown'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={12} />
                                        {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
