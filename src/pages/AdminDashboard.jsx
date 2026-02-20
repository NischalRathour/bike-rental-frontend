import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, ShoppingBag, Bike, Users, RefreshCw, 
  ChevronRight, Filter, Download 
} from 'lucide-react';

// ✅ Component Imports
import StatCard from '../components/admin/StatCard';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, bookings: [] });
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard');
      if (data.success) {
        setData({ stats: data.stats, bookings: data.recentBookings });
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) { 
      console.error("Admin Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const statConfig = [
    { label: "Revenue", val: `Rs. ${data.stats.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: "green", trend: "+12%" },
    { label: "Bookings", val: data.stats.totalBookings || 0, icon: <ShoppingBag />, color: "blue", trend: "+5%" },
    { label: "Fleet", val: data.stats.totalBikes || 0, icon: <Bike />, color: "purple", trend: "Stable" },
    { label: "Customers", val: data.stats.totalUsers || 0, icon: <Users />, color: "orange", trend: "+18%" },
  ];

  return (
    <div className="dashboard-content-wrapper">
      {/* 🚀 PAGE HEADER (Inside the viewport) */}
      <div className="page-header">
        <div>
          <h1 className="advanced-title">Fleet Command Center</h1>
          <p className="subtitle-text">Real-time telemetry for Kathmandu Division. Last synced: {lastSynced}</p>
        </div>
        <div className="header-button-group">
          <button className="export-btn"><Download size={16}/> Export Report</button>
          <button onClick={fetchData} className={`sync-btn ${loading ? 'anim-spin' : ''}`}>
            <RefreshCw size={18} /> {loading ? 'Syncing...' : 'Refresh Fleet'}
          </button>
        </div>
      </div>

      {/* 📊 STATS GRID */}
      <div className="stats-grid-modern">
        {statConfig.map((item, i) => (
          <StatCard key={i} item={item} index={i} />
        ))}
      </div>

      {/* 📋 TABLE SECTION */}
      <section className="table-card-premium">
        <div className="table-header">
          <div className="table-title-group">
            <h2>Live Rental Requests</h2>
            <div className="live-status-pill">
              <span className="pulse-ring"></span>
              {data.stats.pendingBookings || 0} Urgent Requests
            </div>
          </div>
          <div className="table-filters">
            <button className="filter-pill"><Filter size={14}/> Filter</button>
          </div>
        </div>

        <div className="custom-table-wrapper">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Vehicle Details</th>
                <th>Status</th>
                <th>Operational Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.bookings.length > 0 ? (
                  data.bookings.map((b) => (
                    <motion.tr 
                      key={b._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="table-row-hover"
                    >
                      <td>
                        <div className="customer-cell">
                          <div className="initials">{b.user?.name?.charAt(0)}</div>
                          <div>
                            <p className="c-name">{b.user?.name}</p>
                            <p className="c-email">{b.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="bike-cell">
                          <span className="bike-tag">{b.bike?.name || "Standard Unit"}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-status ${b.status?.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <button className="manage-action-btn">
                          Open Details <ChevronRight size={14}/>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-table-msg">No active rental requests found.</td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;