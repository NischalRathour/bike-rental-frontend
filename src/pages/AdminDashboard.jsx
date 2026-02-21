import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, ShoppingBag, Bike, Users, RefreshCw, 
  ChevronRight, Filter, Download, Leaf, Award, Trash2 
} from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, bookings: [] });
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData({ stats: res.data.stats, bookings: res.data.recentBookings });
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Delete this booking record forever?")) {
      try {
        await api.delete(`/admin/bookings/${id}`);
        fetchData();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await api.get('/admin/report');
      if (res.data.success) {
        const blob = new Blob([JSON.stringify(res.data.report, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `RideNRoar_Report_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }
    } catch (err) { alert("Report generation failed"); }
  };

  useEffect(() => { fetchData(); }, []);

  const statConfig = [
    { label: "Revenue", val: `Rs. ${data.stats.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: "green", trend: "+12.5%" },
    { label: "Bookings", val: data.stats.totalBookings || 0, icon: <ShoppingBag />, color: "blue", trend: "+5.2%" },
    { label: "CO2 Saved", val: `${data.stats.totalCo2Saved || 0} KG`, icon: <Leaf />, color: "green-glow", trend: "Eco-Friendly" },
    { label: "Fleet Eco-Score", val: `${data.stats.ecoScore || 0}/100`, icon: <Award />, color: "purple", trend: "Top Tier" },
  ];

  return (
    <div className="dashboard-content-wrapper">
      <div className="page-header">
        <div>
          <h1 className="advanced-title">Fleet Command Center</h1>
          <p className="subtitle-text">Real-time telemetry for Kathmandu Division. Last synced: {lastSynced}</p>
        </div>
        <div className="header-button-group">
          <button onClick={handleGenerateReport} className="export-btn"><Download size={16}/> Export Report</button>
          <button onClick={fetchData} className={`sync-btn ${loading ? 'anim-spin' : ''}`}>
            <RefreshCw size={18} /> {loading ? 'Syncing...' : 'Refresh Fleet'}
          </button>
        </div>
      </div>

      <div className="stats-grid-modern">
        {statConfig.map((item, i) => <StatCard key={i} item={item} index={i} />)}
      </div>

      <section className="table-card-premium">
        <div className="table-header">
          <h2>Live Rental Requests</h2>
          <div className="live-status-pill"><span className="pulse-ring"></span> {data.stats.pendingBookings || 0} Urgent</div>
        </div>

        <div className="custom-table-wrapper">
          <table className="modern-data-table">
            <thead>
              <tr><th>Customer</th><th>Vehicle</th><th>Status</th><th>Operational Action</th></tr>
            </thead>
            <tbody>
              {data.bookings.map((b) => (
                <tr key={b._id} className="table-row-hover">
                  <td>
                    <div className="customer-cell">
                      <div className="initials">{b.user?.name?.charAt(0)}</div>
                      <div><p className="c-name">{b.user?.name}</p><p className="c-email">{b.user?.email}</p></div>
                    </div>
                  </td>
                  <td><span className="bike-tag">{b.bike?.name}</span></td>
                  <td><span className={`badge-status ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  <td>
                    <div className="action-btn-group">
                      <button className="manage-action-btn">Details</button>
                      <button onClick={() => deleteBooking(b._id)} className="delete-action-btn"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;