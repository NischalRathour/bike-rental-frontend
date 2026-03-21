import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { 
  DollarSign, Users, Activity, Leaf, RefreshCw, 
  TrendingUp, BarChart3, AlertCircle, ChevronRight, 
  ShieldCheck, ArrowUpRight, PieChart as PieIcon
} from 'lucide-react';
import "../styles/AdminDashboard.css";

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntel = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/insights');
      if (res?.data?.success) {
        setData(res.data);
        setError(null);
      }
    } catch (err) {
      setError("Marketplace Hub is offline. Checking database connection...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntel(); }, []);

  if (loading) return (
    <div className="admin-loader-container">
      <div className="spinner-indigo"></div>
      <p>Syncing Marketplace Telemetry...</p>
    </div>
  );

  const stats = data?.stats || { revenue: 0, users: 0, availableBikes: 0, co2: 0, revenueTrend: [] };
  const recentActivity = data?.recentBookings || [];
  const bikeData = data?.bikeStats || [];
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueTrend = stats.revenueTrend?.map(item => ({
    day: days[item._id - 1] || "Day",
    revenue: item.revenue
  })) || [];

  return (
    <div className="admin-page-root">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="error-banner">
            <AlertCircle size={18} /> <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <header className="admin-header-main">
        <div className="title-stack">
          <div className="badge-secure"><ShieldCheck size={12}/> ENCRYPTED NODE</div>
          <h1>System <span className="text-indigo">Intelligence</span></h1>
          <p>Live Node Telemetry: Kathmandu Marketplace</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchIntel} className="btn-primary">
            <RefreshCw size={18} className={loading ? 'spin' : ''} /> 
            <span>Sync Live Data</span>
          </button>
        </div>
      </header>

      {/* --- ROW 1: STATS (Horizontal 4-Column) --- */}
      <div className="stats-grid-premium">
        <StatCard label="Net Revenue" val={`Rs. ${stats.revenue.toLocaleString()}`} icon={<DollarSign/>} color="#6366f1" trend="+12.5%" />
        <StatCard label="Active Riders" val={stats.users} icon={<Users/>} color="#6366f1" trend="+3.2%" />
        <StatCard label="Fleet Readiness" val={`${stats.availableBikes} Units`} icon={<Activity/>} color="#6366f1" trend="Stable" />
        <StatCard label="CO2 Offset" val={`${stats.co2} kg`} icon={<Leaf/>} color="#10b981" trend="Impact" />
      </div>

      {/* --- ROW 2: PRIMARY (Horizontal 70/30 Split) --- */}
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
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><BarChart3 size={20} className="text-indigo"/></div>
            <h3>Traffic Nodes</h3>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? recentActivity.map((b, i) => (
              <div key={i} className="activity-row">
                <div className="user-info">
                  <strong>{b.user?.name || "Rider"}</strong>
                  <span>{b.bikes?.[0]?.name || "Fleet Unit"}</span>
                </div>
                <span className={`status-pill ${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
            )) : <p className="empty-msg">No active traffic nodes detected.</p>}
          </div>
        </div>
      </div>

      {/* --- ROW 3: ANALYTICS (Horizontal 50/50 Split) --- */}
      <div className="admin-secondary-grid">
        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><BarChart3 size={20} className="text-indigo"/></div>
            <h3>Fleet Popularity</h3>
          </div>
          <div className="chart-wrapper">
            {bikeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bikeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={35}>
                    {bikeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty-chart-msg">Awaiting fleet data...</div>}
          </div>
        </div>

        <div className="glass-card-white">
          <div className="card-head">
            <div className="icon-circle"><PieIcon size={20} className="text-indigo"/></div>
            <h3>Booking Split</h3>
          </div>
          <div className="chart-wrapper pie-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Revenue', value: stats.revenue > 0 ? stats.revenue : 1 },
                    { name: 'System', value: 50000 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, icon, color, trend }) => (
  <motion.div whileHover={{ y: -5 }} className="premium-stat-card">
    <div className="stat-card-top">
      <div className="stat-icon-wrap" style={{ backgroundColor: `${color}10`, color: color }}>{icon}</div>
      <div className="stat-trend"><ArrowUpRight size={12}/> {trend}</div>
    </div>
    <div className="stat-data">
      <label>{label}</label>
      <h2>{val}</h2>
    </div>
  </motion.div>
);

export default AdminDashboard;