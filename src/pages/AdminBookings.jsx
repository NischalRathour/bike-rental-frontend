import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  CheckCircle, 
  XCircle, 
  Bike, 
  User, 
  Users, 
  CreditCard, 
  Search, 
  Download, 
  Calendar, 
  MoreVertical, 
  Filter, 
  Check, 
  Trash2, 
  RefreshCw,
  Clock // ✅ Added 'Clock' to fix the error
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // --- ⚙️ OPERATIONAL ACTIONS ---
  const updateStatus = async (id, newStatus) => {
    const confirmMsg = `Change booking #${id.slice(-6)} status to ${newStatus.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.put(`/admin/bookings/${id}/status`, { status: newStatus });
      if (res.data.success) {
        // Optimistic UI Update: Update the local state immediately
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      alert("System sync error. Please try again.");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("CRITICAL: Purge this booking record from the ledger?")) return;
    try {
      const res = await api.delete(`/admin/bookings/${id}`);
      if (res.data.success) setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert("Deletion failed."); }
  };

  // --- 🔍 FILTER LOGIC ---
  const filtered = bookings.filter(b => {
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesSearch = b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <div className="admin-loader-container">
      <RefreshCw className="spin-pro" size={40} />
      <p>Synchronizing Global Ledger...</p>
    </div>
  );

  return (
    <div className="admin-bookings-root">
      {/* --- HUD: KPI CARDS --- */}
      <div className="metrics-ribbon">
        <MetricCard title="Gross Volume" value={`Rs. ${bookings.reduce((a, b) => a + (b.totalPrice || 0), 0).toLocaleString()}`} icon={<CreditCard size={20}/>} />
        <MetricCard title="Pending Review" value={bookings.filter(b => b.status === 'Pending').length} color="#f59e0b" icon={<Clock size={20}/>} />
        <MetricCard title="Active Fleet" value={bookings.filter(b => b.status === 'Confirmed').length} color="#6366f1" icon={<Bike size={20}/>} />
      </div>

      <div className="data-table-container">
        {/* --- UTILITY BAR --- */}
        <div className="table-utilities">
          <div className="search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search reference or customer..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-stack">
            <select onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
              <option value="All">All Transactions</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="btn-primary-sm" onClick={fetchBookings}><RefreshCw size={14}/> Refresh</button>
          </div>
        </div>

        {/* --- MAIN DATA GRID --- */}
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>REFERENCE</th>
              <th>CLIENT</th>
              <th>VEHICLE UNITS</th>
              <th>REVENUE</th>
              <th>STATUS</th>
              <th style={{textAlign: 'right'}}>COMMANDS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {filtered.map((b) => (
                <motion.tr 
                  key={b._id} 
                  layout 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="table-row-hover"
                >
                  <td className="font-mono text-xs">#{b._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-mini">{b.user?.name?.charAt(0)}</div>
                      <div>
                        <p className="font-bold m-0">{b.user?.name || "Guest Rider"}</p>
                        <small className="text-muted">{b.user?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {b.bikes?.length > 1 ? (
                      <span className="badge-group"><Users size={12}/> Group ({b.bikes.length})</span>
                    ) : (
                      <span className="bike-name">{b.bikes?.[0]?.name || "Unassigned"}</span>
                    )}
                  </td>
                  <td className="font-bold">Rs. {b.totalPrice?.toLocaleString()}</td>
                  <td>
                    <span className={`pill-status ${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div className="command-group">
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(b._id, 'Confirmed')} className="cmd-btn approve" title="Confirm Ride"><Check size={16}/></button>
                          <button onClick={() => updateStatus(b._id, 'Cancelled')} className="cmd-btn cancel" title="Deny Ride"><XCircle size={16}/></button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button onClick={() => updateStatus(b._id, 'Completed')} className="cmd-btn complete" title="Mark as Done"><CheckCircle size={16}/></button>
                      )}
                      <button onClick={() => deleteRecord(b._id)} className="cmd-btn purge" title="Delete Log"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color = "#0f172a" }) => (
  <div className="metric-card">
    <div className="metric-icon" style={{color}}>{icon}</div>
    <div>
      <p className="metric-title">{title}</p>
      <h2 className="metric-value" style={{color}}>{value}</h2>
    </div>
  </div>
);

export default AdminBookings;