import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Filter, MoreVertical, MapPin, Phone, User, Calendar, Building, MessageSquare, X, Clock, AlertTriangle } from 'lucide-react';

export default function LeadsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [manageModalLead, setManageModalLead] = useState(null);
    const [manageNote, setManageNote] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Permission Helper
    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true;
        return user?.permissions?.includes(perm);
    };

    // Form State
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        address: '',
        location: '',
        company_id: '',
        company: '',
        lead_type: 'new_connection',
        priority: 'medium'
    });

    // --- QUERIES ---
    const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
        queryKey: ['leads', filterStatus, searchTerm],
        queryFn: async () => {
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (searchTerm) params.search = searchTerm;
            const { data } = await api.get('/leads', { params });
            const leadsData = data.data || data;

            return [...leadsData].sort((a, b) => {
                if (a.status === 'resolved' && b.status !== 'resolved') return 1;
                if (a.status !== 'resolved' && b.status === 'resolved') return -1;
                if (a.status !== 'resolved' && b.status !== 'resolved') {
                    const timeA = new Date(a.created_at).getTime();
                    const timeB = new Date(b.created_at).getTime();
                    return timeA - timeB;
                }
                return 0;
            });
        },
    });

    const { data: companies = [] } = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const { data } = await api.get('/companies');
            return data;
        },
    });

    // --- MUTATIONS ---
    const createLeadMutation = useMutation({
        mutationFn: (newLead) => api.post('/leads', newLead),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
            setShowModal(false);
            setFormData({
                customer_name: '', phone: '', address: '', location: '',
                company_id: '', company: '', lead_type: 'new_connection', priority: 'medium'
            });
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, notes }) => api.patch(`/leads/${id}/status`, { status, notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
            setManageModalLead(null);
            setManageNote('');
        }
    });

    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const handleCreate = (e) => {
        e.preventDefault();
        createLeadMutation.mutate(formData);
    };

    const handleManageUpdate = (newStatus) => {
        if (!manageModalLead) return;
        updateStatusMutation.mutate({
            id: manageModalLead.id,
            status: newStatus,
            notes: manageNote
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'badge-open';
            case 'resolved': return 'badge-open';
            default: return '';
        }
    };

    const getRowColor = (status) => {
        switch (status) {
            case 'resolved': return '#f0fdf4';
            case 'open': return '#fef2f2';
            default: return 'transparent';
        }
    };

    const getSLATimer = (createdAt, status) => {
        if (status === 'resolved') return <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>Resolved</span>;
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffMs = now - createdDate;
        const diffHours = diffMs / (1000 * 60 * 60);
        const slaLimit = 24;

        if (diffHours >= slaLimit) {
            const overdueHours = Math.floor(diffHours - slaLimit);
            const overdueMins = Math.floor(((diffHours - slaLimit) % 1) * 60);
            return (
                <div style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertTriangle size={14} /> 24h done + {overdueHours}h {overdueMins}m overdue
                </div>
            );
        } else {
            const remainsHours = Math.floor(slaLimit - diffHours);
            const remainsMins = Math.floor(((slaLimit - diffHours) % 1) * 60);
            return (
                <div style={{ color: 'var(--warning)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {remainsHours}h {remainsMins}m remaining
                </div>
            );
        }
    };

    const handleCompanyChange = (e) => {
        const id = e.target.value;
        const comp = companies.find(c => c.id == id);
        setFormData({ ...formData, company_id: id, company: comp ? comp.name : '' });
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Leads & Complaints</h2>
                    <p className="text-muted">Manage new connections and customer issues</p>
                </div>
                {hasPermission('leads.create') && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={20} style={{ marginRight: '0.5rem' }} /> New Lead
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="card mb-4" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="form-control" style={{ width: '200px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Desktop Table View */}
            <div className="card table-responsive desktop-only" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Customer</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>SLA / Timer</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingLeads ? (
                            <tr><td colSpan="6" className="text-center" style={{ padding: '2rem' }}>Loading...</td></tr>
                        ) : leads.length === 0 ? (
                            <tr><td colSpan="6" className="text-center" style={{ padding: '2rem' }}>No leads found.</td></tr>
                        ) : (
                            leads.map(lead => (
                                <tr key={lead.id}
                                    onClick={() => { if (hasPermission('leads.manage')) { setManageModalLead(lead); setManageNote(lead.notes || ''); } }}
                                    style={{ borderBottom: '1px solid var(--border)', backgroundColor: getRowColor(lead.status), cursor: hasPermission('leads.manage') ? 'pointer' : 'default' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{lead.customer_name}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ textTransform: 'capitalize', color: lead.lead_type === 'complaint' ? 'var(--danger)' : 'var(--success)' }}>
                                            {lead.lead_type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{getSLATimer(lead.created_at, lead.status)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${getStatusColor(lead.status)}`}>{lead.status.replace('_', ' ')}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, '/')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {hasPermission('leads.manage') && (
                                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <MessageSquare size={14} /> Manage
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Grid View */}
            <div className="mobile-only">
                {isLoadingLeads ? (
                    <div className="text-center p-4">Loading leads...</div>
                ) : leads.length === 0 ? (
                    <div className="text-center p-4">No leads found.</div>
                ) : (
                    <div className="leads-mobile-grid">
                        {leads.map(lead => (
                            <div key={lead.id} className="lead-card" onClick={() => { if (hasPermission('leads.manage')) { setManageModalLead(lead); setManageNote(lead.notes || ''); } }}>
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

            {/* CREATE MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Add New Lead</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group"><label className="form-label">Type</label>
                                <select className="form-control" value={formData.lead_type} onChange={e => setFormData({ ...formData, lead_type: e.target.value })}>
                                    <option value="new_connection">New Connection</option><option value="complaint">Complaint</option>
                                </select>
                            </div>
                            <div className="form-group"><label className="form-label">Company</label>
                                <select className="form-control" value={formData.company_id} onChange={handleCompanyChange}>
                                    <option value="">Select Company...</option>
                                    {companies.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                </select>
                            </div>
                            <div className="text-muted mb-2" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Details</div>
                            <div className="form-group"><label className="form-label">Customer Name</label>
                                <input className="form-control" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} required />
                            </div>
                            <div className="form-group"><label className="form-label">Phone</label>
                                <input className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div className="form-group"><label className="form-label">Location/City</label>
                                <input className="form-control" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="form-group"><label className="form-label">Full Address</label>
                                <textarea className="form-control" rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-block" style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-block" disabled={createLeadMutation.isPending}>
                                    {createLeadMutation.isPending ? 'Saving...' : 'Create Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MANAGE MODAL */}
            {manageModalLead && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Manage Lead</h3>
                            <X style={{ cursor: 'pointer' }} onClick={() => setManageModalLead(null)} />
                        </div>
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{manageModalLead.customer_name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={14} />
                                    <a href={`tel:${manageModalLead.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                                        {manageModalLead.phone}
                                    </a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={14} /> {manageModalLead.address}</div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <span className={`badge ${getStatusColor(manageModalLead.status)}`}>{manageModalLead.status.toUpperCase()}</span>
                                    <span style={{ marginLeft: '0.5rem' }}>{manageModalLead.lead_type.replace('_', ' ').toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-control" rows="4" value={manageNote} onChange={e => setManageNote(e.target.value)} placeholder="Add technical notes..."></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            {manageModalLead.status === 'resolved' ? (
                                (user?.role === 'super_admin' || user?.id === manageModalLead.created_by) && (
                                    <button className="btn btn-primary btn-block" style={{ backgroundColor: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleManageUpdate('open')}>
                                        {updateStatusMutation.isPending ? 'Updating...' : 'Add Note & Reopen Case'}
                                    </button>
                                )
                            ) : (
                                <>
                                    <button className="btn btn-primary btn-block" onClick={() => handleManageUpdate('resolved')}>
                                        {updateStatusMutation.isPending ? 'Updating...' : 'Add Note & Resolve'}
                                    </button>
                                    <button className="btn btn-block" style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={() => handleManageUpdate(manageModalLead.status)}>
                                        {updateStatusMutation.isPending ? 'Updating...' : 'Update Note Only'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
