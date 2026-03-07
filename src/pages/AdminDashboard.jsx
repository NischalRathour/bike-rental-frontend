import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Activity, Leaf, Zap, RefreshCw, Download } from 'lucide-react';
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
        alert(`📊 REPORT GENERATED\n\nDate: ${r.generatedAt}\nRevenue: Rs. ${r.metrics.grossRevenue}\nEco Impact: ${r.metrics.ecoImpact}\nStatus: ${r.status}`);
        console.log("Full Audit Log:", r);
      }
    } catch (err) {
      alert("Report Engine Sync Error: Check Backend Routes");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const days = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = data.stats.revenueTrend?.map(item => ({
    day: days[item._id] || "Day",
    revenue: item.revenue
  })) || [{ day: 'N/A', revenue: 0 }];

  const statConfig = [
    { label: "Gross Revenue", val: `Rs. ${data.stats.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: "green", trend: "+12%" },
    { label: "Fleet Availability", val: `${data.stats.availableBikes || 0} Units`, icon: <Activity />, color: "blue", trend: "Live" },
    { label: "Carbon Offset", val: `${data.stats.totalCo2Saved || 0} KG`, icon: <Leaf />, color: "green-glow", trend: "Eco-Logic" },
    { label: "Eco-Efficiency", val: `${data.stats.ecoScore || 0}%`, icon: <Zap />, color: "purple", trend: "Optimal" },
  ];

  if (loading && !data.stats.totalBookings) return <div className="admin-loader">Synchronizing Telemetry...</div>;

  return (
    <div className="admin-glass-base">
      <header className="admin-modern-header">
        <div className="title-block">
          <h1 className="hero-gradient-text">Operations Intelligence</h1>
          <p className="subtitle-faded">Real-time System Monitoring</p>
        </div>
        <div className="header-actions">
          <button onClick={handleGenerateReport} className="btn-glass-secondary">
            <Download size={16}/> Export Report
          </button>
          <button onClick={fetchData} className={`btn-glass-primary ${loading ? 'anim-spin' : ''}`}>
            <RefreshCw size={16}/> Sync Engine
          </button>
        </div>
      </header>

      <div className="stats-grid-visual">
        {statConfig.map((item, i) => <StatCard key={i} item={item} index={i} />)}
      </div>

      <div className="dashboard-main-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="analytics-card-glass">
          <h3>Revenue & Sustainability Pulse</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRev)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="side-panel-glass">
          <h3>Recent Booking Traffic</h3>
          <div className="traffic-list">
            {data.recentBookings?.map((b) => (
              <div key={b._id} className="traffic-item">
                <div className="user-initials">{b.user?.name?.charAt(0) || "U"}</div>
                <div className="traffic-info">
                  <p className="p-main">{b.user?.name || "Guest"}</p>
                  <p className="p-sub">{b.bike?.name || "Generic Unit"}</p>
                </div>
                <div className={`tag-status ${b.status?.toLowerCase()}`}>{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;