import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Trash2, Edit, Shield, Mail, Phone, Users, Building, X, CheckSquare, Square } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
    { id: 'dashboard.view', label: 'View Dashboard' },
    { id: 'leads.view', label: 'View Leads' },
    { id: 'leads.create', label: 'Create Leads' },
    { id: 'leads.manage', label: 'Manage/Resolve Leads' },
    { id: 'companies.manage', label: 'Manage Companies' },
    { id: 'users.manage', label: 'Manage Users' },
    { id: 'logs.view', label: 'View Audit Logs' },
    { id: 'reports.view', label: 'View Reports' },
];

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        phone: '',
        company_id: '',
        is_active: true,
        permissions: [] // Array of permission IDs
    });

    useEffect(() => {
        fetchUsers();
        fetchCompanies();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data.data || data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const { data } = await api.get('/companies');
            setCompanies(data);
        } catch (error) {
            console.error('Failed to fetch companies', error);
        }
    };

    const handlePermissionToggle = (permId) => {
        setFormData(prev => {
            const isSelected = prev.permissions.includes(permId);
            return {
                ...prev,
                permissions: isSelected
                    ? prev.permissions.filter(id => id !== permId)
                    : [...prev.permissions, permId]
            };
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;
                await api.put(`/users/${editId}`, dataToSend);
            } else {
                await api.post('/users', formData);
            }

            resetForm();
            fetchUsers();
        } catch (error) {
            alert('Failed to save user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const openEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            phone: user.phone || '',
            company_id: user.company_id || '',
            is_active: Boolean(user.is_active),
            permissions: user.permissions || []
        });
        setEditMode(true);
        setEditId(user.id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'employee',
            phone: '',
            company_id: '',
            is_active: true,
            permissions: []
        });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin': return { bg: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa' };
            case 'tech_team': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
            case 'company_owner': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' };
            default: return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' };
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>User Management</h2>
                    <p className="text-muted">Manage system access and roles</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add User
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>User</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Permissions</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center" style={{ padding: '2rem' }}>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center" style={{ padding: '2rem' }}>No users found.</td></tr>
                        ) : (
                            users.map(user => {
                                const badgeStyle = getRoleBadge(user.role);
                                return (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: badgeStyle.bg, color: badgeStyle.color, textTransform: 'capitalize' }}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '300px' }}>
                                                {user.role === 'super_admin' ? (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Full Access</span>
                                                ) : (
                                                    user.permissions?.map(p => (
                                                        <span key={p} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                                            {p.split('.')[0]}
                                                        </span>
                                                    )) || <span className="text-muted text-xs">No permissions</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={user.is_active ? 'text-success' : 'text-danger'} style={{ fontSize: '0.875rem' }}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }} onClick={() => openEdit(user)}>
                                                    <Edit size={16} color="var(--primary)" />
                                                </button>
                                                {user.id !== 1 && (
                                                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }} onClick={() => handleDelete(user.id)}>
                                                        <Trash2 size={16} color="var(--danger)" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>{editMode ? 'Edit User' : 'Add New User'}</h3>
                            <X style={{ cursor: 'pointer' }} onClick={resetForm} />
                        </div>
                        <form onSubmit={handleCreate}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Password {editMode && <span className="text-muted text-xs">(Blank to keep)</span>}</label>
                                    <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editMode} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="employee">Employee</option>
                                        <option value="tech_team">Tech Team</option>
                                        <option value="company_owner">Company Owner</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Assign to Company</label>
                                <select className="form-control" value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                                    <option value="">No Company (Direct Staff)</option>
                                    {companies.map(comp => (<option key={comp.id} value={comp.id}>{comp.name}</option>))}
                                </select>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <label className="form-label" style={{ marginBottom: '1rem', display: 'block', fontWeight: 600 }}>Page Permissions</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    {AVAILABLE_PERMISSIONS.map(perm => (
                                        <div
                                            key={perm.id}
                                            onClick={() => handlePermissionToggle(perm.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem' }}
                                        >
                                            {formData.permissions.includes(perm.id) ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} className="text-muted" />}
                                            <span style={{ fontSize: '0.875rem' }}>{perm.label}</span>
                                        </div>
                                    ))}
                                </div>
                                {formData.role === 'super_admin' && (
                                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                                        * Super Admins automatically have full access regardless of selection.
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-block" style={{ backgroundColor: 'var(--bg-dark)' }} onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-block">
                                    {editMode ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
