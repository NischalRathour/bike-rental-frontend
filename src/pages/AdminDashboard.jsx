import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { 
  DollarSign, Users, Activity, Leaf, RefreshCw, 
  TrendingUp, BarChart3, AlertCircle, 
  ShieldCheck, ArrowUpRight, PieChart as PieIcon,
  Loader2
} from 'lucide-react';
import "../styles/AdminDashboard.css";

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // 🛰️ Fetch Intelligence from Backend
  const fetchIntel = useCallback(async (isManual = false) => {
    try {
      if (isManual) setSyncing(true);
      
      const res = await api.get('/admin/insights');
      
      if (res?.data?.success) {
        setData(res.data);
        setError(null);
      }
    } catch (err) {
      setError("Marketplace Hub Link Failure. Attempting Re-sync...");
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // 🔄 Initial Load & Auto-Polling (Every 60 Seconds)
  useEffect(() => {
    fetchIntel();
    const interval = setInterval(() => fetchIntel(), 60000);
    return () => clearInterval(interval);
  }, [fetchIntel]);

  if (loading) return (
    <div className="admin-loader-container">
      <Loader2 className="animate-spin text-indigo" size={40} />
      <p>Syncing Marketplace Telemetry...</p>
    </div>
  );

  // 📂 Data Normalization Logic
  const stats = data?.stats || { revenue: 0, users: 0, availableBikes: 0, co2: 0, revenueTrend: [] };
  const recentActivity = data?.recentBookings || [];
  const bikeData = data?.bikeStats || [];
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueTrend = stats.revenueTrend?.map(item => ({
    day: days[item._id - 1] || `Day ${item._id}`,
    revenue: item.revenue
  })) || [];

  return (
    <div className="admin-page-root">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="error-banner"
          >
            <AlertCircle size={18} /> <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏗️ DASHBOARD HEADER */}
      <header className="admin-header-main">
        <div className="title-stack">
          <div className="badge-secure"><ShieldCheck size={12}/> SECURE COMMAND NODE</div>
          <h1>System <span className="text-indigo">Intelligence</span></h1>
          <p>Real-time Telemetry: Kathmandu Fleet Hub</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => fetchIntel(true)} 
            className={`btn-sync ${syncing ? 'syncing' : ''}`}
            disabled={syncing}
          >
            <RefreshCw size={18} className={syncing ? 'spin-anim' : ''} /> 
            <span>{syncing ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>
        </div>
      </header>

      {/* 📈 STATS ROW */}
      <div className="stats-grid-premium">
        <StatCard 
          label="Net Revenue" 
          val={`Rs. ${stats.revenue.toLocaleString()}`} 
          icon={<DollarSign/>} 
          color="#6366f1" 
          trend="+12.5%" 
        />
        <StatCard 
          label="Active Riders" 
          val={stats.users} 
          icon={<Users/>} 
          color="#6366f1" 
          trend="+3.2%" 
        />
        <StatCard 
          label="Fleet Readiness" 
          val={`${stats.availableBikes} Units`} 
          icon={<Activity/>} 
          color="#8b5cf6" 
          trend="Optimal" 
        />
        <StatCard 
          label="CO2 Offset" 
          val={`${stats.co2} kg`} 
          icon={<Leaf/>} 
          color="#10b981" 
          trend="Impact" 
        />
      </div>

      {/* 📊 MAIN CHARTS SECTION */}
      <div className="admin-grid-layout">
        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><TrendingUp size={20} className="text-indigo"/></div>
            <h3>Revenue Velocity</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><Activity size={20} className="text-indigo"/></div>
            <h3>Live Traffic Nodes</h3>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? recentActivity.map((b, i) => (
              <div key={i} className="activity-row">
                <div className="user-info">
                  <strong>{b.user?.name || "Anonymous Node"}</strong>
                  <span>{b.bikes?.[0]?.name || "Unspecified Unit"}</span>
                </div>
                <div className="activity-meta">
                   <span className={`status-pill ${b.status?.toLowerCase()}`}>{b.status}</span>
                   <span className="time-stamp">{new Date(b.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            )) : <p className="empty-msg">No active traffic nodes detected.</p>}
          </div>
        </div>
      </div>

      {/* 📉 SECONDARY ANALYTICS */}
      <div className="admin-secondary-grid">
        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><BarChart3 size={20} className="text-indigo"/></div>
            <h3>Fleet Popularity</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bikeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={35}>
                  {bikeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><PieIcon size={20} className="text-indigo"/></div>
            <h3>System Health Split</h3>
          </div>
          <div className="chart-wrapper pie-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active Revenue', value: stats.revenue > 0 ? stats.revenue : 1 },
                    { name: 'Operational Costs', value: stats.revenue * 0.2 || 1000 }
                  ]}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={10}
                  dataKey="value"
                  animationBegin={200}
                >
                  {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-label">
                <h4>{stats.revenue > 0 ? 'Optimal' : 'Monitoring'}</h4>
                <span>Fleet Health</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🃏 STAT CARD COMPONENT
const StatCard = ({ label, val, icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -8, transition: { duration: 0.2 } }} 
    className="premium-stat-card"
  >
    <div className="stat-card-top">
      <div className="stat-icon-wrap" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="stat-trend">
        <ArrowUpRight size={14}/> {trend}
      </div>
    </div>
    <div className="stat-data">
      <label>{label}</label>
      <h2>{val}</h2>
    </div>
    <div className="stat-progress-bar">
        <div className="progress-fill" style={{ width: '70%', backgroundColor: color }}></div>
    </div>
  </motion.div>
);

export default AdminDashboard;