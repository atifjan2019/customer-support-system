import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Trash2, Edit, Building, Mail, Phone, MapPin, X } from 'lucide-react';

export default function CompaniesPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    // --- QUERIES ---
    const { data: companies = [], isLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const { data } = await api.get('/companies');
            return data;
        },
    });

    // --- MUTATIONS ---
    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (editMode) return api.put(`/companies/${editId}`, data);
            return api.post('/companies', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/companies/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        }
    });

    const handleCreate = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            deleteMutation.mutate(id);
        }
    };

    const openEdit = (company) => {
        setFormData({
            name: company.name,
            email: company.email || '',
            phone: company.phone || '',
            address: company.address || ''
        });
        setEditMode(true);
        setEditId(company.id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', address: '' });
        setEditMode(false);
        setEditId(null);
        setShowModal(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Company Management</h2>
                    <p className="text-muted">Manage your client companies</p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Company
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Company Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Contact Info</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Address</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center" style={{ padding: '2rem' }}>Loading...</td></tr>
                        ) : companies.length === 0 ? (
                            <tr><td colSpan="4" className="text-center" style={{ padding: '2rem' }}>No companies found.</td></tr>
                        ) : (
                            companies.map(company => (
                                <tr key={company.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Building size={16} className="text-muted" />
                                            <span style={{ fontWeight: 600 }}>{company.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
                                            {company.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} /> {company.email}</div>}
                                            {company.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12} /> {company.phone}</div>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}><div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{company.address || 'N/A'}</div></td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }} onClick={() => openEdit(company)}>
                                                <Edit size={16} color="var(--primary)" />
                                            </button>
                                            <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }} onClick={() => handleDelete(company.id)}>
                                                <Trash2 size={16} color="var(--danger)" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>{editMode ? 'Edit Company' : 'Add New Company'}</h3>
                            <X style={{ cursor: 'pointer' }} onClick={resetForm} />
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group"><label className="form-label">Company Name</label>
                                <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group"><label className="form-label">Email Address</label>
                                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="form-group"><label className="form-label">Phone Number</label>
                                <input className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group"><label className="form-label">Address</label>
                                <textarea className="form-control" rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-block" style={{ backgroundColor: 'var(--bg-dark)' }} onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-block" disabled={saveMutation.isPending}>
                                    {saveMutation.isPending ? 'Saving...' : (editMode ? 'Update Company' : 'Create Company')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
