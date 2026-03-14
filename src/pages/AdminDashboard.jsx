import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Activity, Leaf, Zap, RefreshCw, Download, BarChart3, TrendingUp } from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, recentBookings: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) setData(res.data);
    } catch (err) { 
      console.error("Telemetry Sync Error", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await api.get('/admin/report');
      if (res.data.success) {
        const r = res.data.report;
        alert(`📊 INTELLIGENCE REPORT\n\nGenerated: ${r.generatedAt}\nGross Revenue: Rs. ${r.metrics.grossRevenue}\nEco Impact: ${r.metrics.ecoImpact}\nSystem Status: ${r.status}`);
      }
    } catch (err) {
      alert("Report Engine Sync Error");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const days = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = data.stats.revenueTrend?.map(item => ({
    day: days[item._id] || "Day",
    revenue: item.revenue
  })) || [{ day: 'N/A', revenue: 0 }];

  const statConfig = [
    { label: "Gross Revenue", val: `Rs. ${data.stats.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign size={20}/>, color: "green", trend: "+12.5%" },
    { label: "Active Fleet", val: `${data.stats.availableBikes || 0} Units`, icon: <Activity size={20}/>, color: "blue", trend: "Optimal" },
    { label: "Carbon Offset", val: `${data.stats.totalCo2Saved || 0} KG`, icon: <Leaf size={20}/>, color: "emerald", trend: "Eco-Friendly" },
    { label: "Eco Score", val: `${data.stats.ecoScore || 0}%`, icon: <Zap size={20}/>, color: "purple", trend: "A+ Grade" },
  ];

  if (loading && !data.stats.totalBookings) return (
    <div className="admin-dashboard-loading">
      <div className="spinner-neon"></div>
      <p>Deciphering System Telemetry...</p>
    </div>
  );

  return (
    <div className="admin-dashboard-wrapper">
      <header className="dashboard-header-pro">
        <div className="header-intel">
          <h1 className="text-glow">Operations Intelligence</h1>
          <p>Real-time telemetry from Kathmandu Fleet</p>
        </div>
        <div className="header-actions-pro">
          <button onClick={handleGenerateReport} className="btn-action-outline">
            <Download size={18}/> <span>Export Audit</span>
          </button>
          <button onClick={fetchData} className={`btn-action-primary ${loading ? 'loading-spin' : ''}`}>
            <RefreshCw size={18}/> <span>Sync Data</span>
          </button>
        </div>
      </header>

      {/* 📊 STAT CARDS ROW */}
      <div className="stats-grid-pro">
        {statConfig.map((item, i) => (
          <StatCard key={i} item={item} index={i} />
        ))}
      </div>

      <div className="dashboard-main-layout">
        {/* 📈 REVENUE CHART */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="chart-container-glass"
        >
          <div className="chart-header">
            <div className="chart-title">
              <TrendingUp size={18} color="#6366f1" />
              <h3>Revenue Sustainability Pulse</h3>
            </div>
            <span className="live-badge">LIVE FEED</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value}`} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRev)" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 📋 RECENT ACTIVITY SIDEBAR */}
        <div className="activity-panel-glass">
          <div className="panel-header">
            <BarChart3 size={18} color="#a855f7" />
            <h3>Recent Node Traffic</h3>
          </div>
          <div className="activity-scroll-list">
            {data.recentBookings?.length > 0 ? data.recentBookings.map((b) => (
              <div key={b._id} className="activity-card-mini">
                <div className="activity-avatar">{b.user?.name?.charAt(0) || "U"}</div>
                <div className="activity-info">
                  <p className="user-name">{b.user?.name || "Anonymous"}</p>
                  <p className="bike-model">{b.bike?.name || "Ride Unit"}</p>
                </div>
                <div className={`status-tag-pro ${b.status?.toLowerCase()}`}>
                  {b.status}
                </div>
              </div>
            )) : <p className="empty-msg">No recent activity detected.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;