import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Activity, Leaf, RefreshCw, TrendingUp, BarChart3, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/insights');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Telemetry Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntel(); }, []);

  const generateAuditReport = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text("RIDE N ROAR: OPERATIONS AUDIT", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ["Total Revenue", `Rs. ${data.stats.revenue.toLocaleString()}`],
        ["CO2 Saved", `${data.stats.co2} kg`],
        ["Active Riders", data.stats.users],
        ["Fleet Ready", data.stats.availableBikes]
      ],
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`Audit_Report_${new Date().getTime()}.pdf`);
  };

  if (loading || !data) return (
    <div className="admin-dashboard-loading">
      <div className="spinner-neon"></div>
      <p>Syncing Operations Intelligence...</p>
    </div>
  );

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = data.stats.revenueTrend?.map(item => ({
    day: days[item._id - 1] || "Day",
    revenue: item.revenue
  })) || [];

  return (
    <div className="admin-dashboard-wrapper" style={{ padding: '120px 4% 40px', background: '#f8fafc' }}>
      <header className="dashboard-header-pro" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 className="text-glow" style={{ fontSize: '2.5rem', fontWeight: 900 }}>Fleet <span style={{ color: '#6366f1' }}>Intelligence</span></h1>
          <p style={{ color: '#64748b', fontWeight: '600' }}>Live Telemetry: Kathmandu Marketplace</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <button onClick={generateAuditReport} className="btn-action-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
            <Download size={18}/> Audit
          </button>
          <button onClick={fetchIntel} className="btn-action-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 25px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> Sync Data
          </button>
        </div>
      </header>

      <div className="stats-grid-pro" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
        <StatCard label="Revenue" val={`Rs. ${data.stats.revenue.toLocaleString()}`} icon={<DollarSign/>} color="#10b981" />
        <StatCard label="Eco Impact" val={`${data.stats.co2}kg`} icon={<Leaf/>} color="#06b6d4" />
        <StatCard label="Riders" val={data.stats.users} icon={<Users/>} color="#6366f1" />
        <StatCard label="Available Fleet" val={data.stats.availableBikes} icon={<Activity/>} color="#f59e0b" />
      </div>

      <div className="dashboard-main-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="chart-container-glass" style={{ background: '#fff', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}><TrendingUp color="#6366f1"/> Revenue Pulse</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="activity-card-glass" style={{ background: '#fff', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 800 }}><BarChart3 size={18}/> Recent Node Traffic</h3>
          {data.recentBookings.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '15px', marginBottom: '10px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{b.user?.name || "Guest"}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{b.bike?.name || "Premium Unit"}</p>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1' }}>{b.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, icon, color }) => (
  <div className="glass-stat-card" style={{ background: '#fff', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0', borderBottom: `4px solid ${color}` }}>
    <div style={{ color: color, marginBottom: '10px' }}>{icon}</div>
    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: '800' }}>{label}</p>
    <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.7rem' }}>{val}</h2>
  </div>
);

export default AdminDashboard;