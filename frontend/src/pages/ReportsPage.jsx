import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Calendar, Download, Filter, TrendingUp, PieChart, Activity, Clock, AlertCircle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({
        from_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
    });

    const { data: reportData, isLoading, isError, error } = useQuery({
        queryKey: ['reports', dateRange],
        queryFn: async () => {
            const { data } = await api.get('/reports', { params: dateRange });
            return data;
        },
        retry: 1
    });

    if (isLoading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Activity className="animate-spin" size={48} color="var(--primary)" />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating Analysis...</p>
        </div>
    );

    if (isError) return (
        <div className="card text-center" style={{ padding: '3rem', margin: '2rem auto', maxWidth: '500px' }}>
            <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
            <h3>Failed to load reports</h3>
            <p className="text-muted">{error?.response?.data?.message || error.message}</p>
            <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    // Safeguards for chart data
    const barData = {
        labels: reportData?.company_breakdown?.length ? reportData.company_breakdown.map(c => c.name) : ['No Data'],
        datasets: [{
            label: 'Leads per Company',
            data: reportData?.company_breakdown?.length ? reportData.company_breakdown.map(c => c.count) : [0],
            backgroundColor: 'rgba(238, 49, 79, 0.6)',
            borderColor: '#ee314f',
            borderWidth: 1,
        }]
    };

    const pieData = {
        labels: reportData?.type_breakdown?.length ? reportData.type_breakdown.map(t => t.lead_type.replace('_', ' ').toUpperCase()) : ['No Data'],
        datasets: [{
            data: reportData?.type_breakdown?.length ? reportData.type_breakdown.map(t => t.count) : [1],
            backgroundColor: reportData?.type_breakdown?.length ? ['#ee314f', '#10b981', '#f59e0b', '#3b82f6'] : ['#cccccc'],
        }]
    };

    const lineData = {
        labels: reportData?.daily_trend?.length ? reportData.daily_trend.map(d => d.date) : [new Date().toLocaleDateString()],
        datasets: [{
            label: 'Leads Over Time',
            data: reportData?.daily_trend?.length ? reportData.daily_trend.map(d => d.count) : [0],
            borderColor: '#ee314f',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(238, 49, 79, 0.1)',
        }]
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Performance Reports</h2>
                    <p className="text-muted">Analyze system efficiency and team productivity</p>
                </div>
                <button
                    className="btn"
                    style={{ border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => window.print()}
                >
                    <Download size={18} /> Export PDF
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-4" style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label className="form-label">From Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dateRange.from_date}
                        onChange={e => setDateRange({ ...dateRange, from_date: e.target.value })}
                    />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <label className="form-label">To Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dateRange.to_date}
                        onChange={e => setDateRange({ ...dateRange, to_date: e.target.value })}
                    />
                </div>
                <button className="btn btn-primary" style={{ height: '42px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} /> Refresh
                </button>
            </div>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card text-center" style={{ borderTop: '4px solid var(--primary)' }}>
                    <TrendingUp size={24} color="var(--primary)" style={{ marginBottom: '0.5rem', marginInline: 'auto' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{reportData?.stats?.total || 0}</div>
                    <div className="text-muted text-xs">Total Leads Created</div>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--success)' }}>
                    <Activity size={24} color="var(--success)" style={{ marginBottom: '0.5rem', marginInline: 'auto' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{reportData?.stats?.resolved || 0}</div>
                    <div className="text-muted text-xs">Successfully Resolved</div>
                </div>
                <div className="card text-center" style={{ borderTop: '4px solid var(--warning)' }}>
                    <Clock size={24} color="var(--warning)" style={{ marginBottom: '0.5rem', marginInline: 'auto' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{reportData?.stats?.avg_resolution_time || 0}h</div>
                    <div className="text-muted text-xs">Avg. Resolution Time</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={18} color="var(--primary)" /> Growth Trend
                    </h3>
                    <div style={{ height: '300px' }}>
                        <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={18} color="var(--primary)" /> Category Breakdown
                    </h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Company Performance (Leads Count)</h3>
                <div style={{ height: '350px' }}>
                    <Bar
                        data={barData}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                                x: { grid: { display: false } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
