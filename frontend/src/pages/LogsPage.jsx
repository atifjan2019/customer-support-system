import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { History, User, Activity, Calendar, Search } from 'lucide-react';
import { useState } from 'react';

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const { data: logsData, isLoading } = useQuery({
        queryKey: ['activity_logs', selectedDate],
        queryFn: async () => {
            const { data } = await api.get('/logs', {
                params: { date: selectedDate }
            });
            return data.data || data;
        },
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
            <div className="card mb-4" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} className="text-muted" />
                    <input
                        type="date"
                        className="form-control"
                        style={{ width: 'auto' }}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {selectedDate && (
                        <button
                            className="btn"
                            style={{ padding: '0.5rem', background: 'transparent', fontSize: '0.8rem' }}
                            onClick={() => setSelectedDate('')}
                        >
                            Clear
                        </button>
                    )}
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
