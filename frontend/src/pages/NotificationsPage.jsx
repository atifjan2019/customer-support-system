import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Bell, CheckCircle, Clock, Info, Check } from 'lucide-react';

export default function NotificationsPage() {
    const queryClient = useQueryClient();

    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications');
            return data.data || data;
        },
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id) => api.patch(`/notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => api.post('/notifications/mark-all-read'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={18} color="var(--success)" />;
            case 'warning': return <Clock size={18} color="var(--warning)" />;
            case 'danger': return <Info size={18} color="var(--danger)" />;
            default: return <Bell size={18} color="var(--primary)" />;
        }
    };

    if (isLoading) return <div className="text-center p-4">Loading notifications...</div>;

    const notifications = Array.isArray(notificationsData) ? notificationsData : [];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Notifications</h2>
                    <p className="text-muted">Stay updated with leads and SLA alerts</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}
                        onClick={() => markAllReadMutation.mutate()}
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="card" style={{ padding: 0 }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Bell size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.map((notif, index) => (
                            <div
                                key={notif.id}
                                style={{
                                    padding: '1.25rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    borderBottom: index !== notifications.length - 1 ? '1px solid var(--border)' : 'none',
                                    backgroundColor: notif.is_read ? 'transparent' : 'rgba(238, 49, 79, 0.03)',
                                    opacity: notif.is_read ? 0.7 : 1,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div style={{ marginTop: '0.25rem' }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: notif.is_read ? 500 : 700 }}>
                                            {notif.title}
                                        </h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(notif.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.5rem 0', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {notif.message}
                                    </p>
                                    {!notif.is_read && (
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--primary)',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontWeight: 600
                                            }}
                                            onClick={() => markAsReadMutation.mutate(notif.id)}
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
