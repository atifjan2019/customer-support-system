import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { History, User, Activity, Calendar, Search, Building, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogsPage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState('');


    const { data: logsData, isLoading } = useQuery({
        queryKey: ['activity_logs', selectedDate],
        queryFn: async () => {
            const { data } = await api.get('/logs', {
                params: {
                    date: selectedDate
                }
            });
            return data.data || data;
        },
    });

    if (isLoading) return <div className="text-center p-4">Loading system logs...</div>;

    const logs = Array.isArray(logsData) ? logsData : [];

    const filteredLogs = logs; // Search removed as requested

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Activity Logs</h2>
                    <p className="text-muted">Audit trail of all system actions</p>
                </div>
            </div>

            {/* Premium Filter Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '300px' }}>
                    <Calendar size={16} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        zIndex: 1
                    }} />
                    <input
                        type="date"
                        className="form-control"
                        style={{
                            height: '48px',
                            paddingLeft: '2.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            backgroundColor: '#fff',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {selectedDate && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedDate('');
                            }}
                            style={{
                                position: 'absolute',
                                right: '40px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                zIndex: 2
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div >

            {/* Desktop View */}
            < div className="card table-responsive desktop-only" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performed By</th>
                            <th style={{ padding: '1.25rem 1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center" style={{ padding: '4rem 2rem' }}>
                                    <div style={{ opacity: 0.5, marginBottom: '1rem' }}><History size={48} /></div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No activity logs found</h3>
                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Try adjusting your filters or check back later.</p>
                                </td>
                            </tr>
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
            </div >

            {/* Mobile View */}
            < div className="mobile-only" >
                {
                    filteredLogs.length === 0 ? (
                        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                            <div style={{ opacity: 0.3, marginBottom: '1rem' }}><History size={48} /></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>No logs found</h3>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Try adjusting your filters.</p>
                        </div>
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
                    )
                }
            </div >
        </div >
    );
}
