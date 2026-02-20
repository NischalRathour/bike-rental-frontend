import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { 
  LayoutDashboard, ShoppingBag, Clock, CheckCircle2, 
  TrendingUp, User, LogOut, ChevronRight, MapPin, Calendar 
} from 'lucide-react';
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch data on mount AND whenever the user object changes
  useEffect(() => {
    if (!authLoading && user) {
      fetchCustomerData();
    }
  }, [user, authLoading]);

  const fetchCustomerData = async () => {
    try {
      setDataLoading(true);
      // ✅ Hits the specific route we optimized in the backend
      const response = await api.get('/bookings/my'); 
      
      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        // Fallback for different response shapes
        setBookings(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('❌ Dashboard Sync Error:', err);
      setError('Connection to server lost. Retrying...');
    } finally {
      setDataLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    return bookings
      .filter(b => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  };

  if (authLoading) return (
    <div className="loader-container">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="spinner-ring" />
      <p>Verifying Session...</p>
    </div>
  );

  if (!user) return null;

  return (
    <div className="dash-container">
      {/* 🚀 TOP NAVIGATION */}
      <div className="dash-top-nav">
        <div className="nav-user-info">
          <h1 className="nav-title">Namaste, {user.name.split(' ')[0]}!</h1>
          <span className="nav-date">{new Date().toLocaleDateString('en-NP', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/bikes')} className="btn-rent-new">
            <ShoppingBag size={18} /> Rent a Bike
          </button>
          <button onClick={logout} className="btn-icon-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="dash-main-grid">
        {/* 📊 LEFT PANEL: STATS & ACTIVITY */}
        <div className="dash-left-panel">
          
          <div className="stats-row">
            {[
              { label: "Total Bookings", val: bookings.length, icon: <LayoutDashboard />, color: "#6366f1" },
              { label: "Confirmed", val: bookings.filter(b => b.status === 'Confirmed').length, icon: <CheckCircle2 />, color: "#10b981" },
              { label: "Awaiting Pay", val: bookings.filter(b => b.paymentStatus === 'Unpaid').length, icon: <Clock />, color: "#f59e0b" },
              { label: "Total Spent", val: `Rs. ${calculateTotalSpent()}`, icon: <TrendingUp />, color: "#8b5cf6" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-stat-card"
              >
                <div className="stat-card-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                <div className="stat-card-data">
                  <span className="stat-card-label">{stat.label}</span>
                  <h3 className="stat-card-value">{stat.val}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <section className="recent-activity-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button onClick={() => navigate('/my-bookings')} className="btn-text-link">History <ChevronRight size={14}/></button>
            </div>
            
            <div className="table-wrapper">
              {dataLoading ? (
                <div className="dash-skeleton">Refreshing your rides...</div>
              ) : bookings.length > 0 ? (
                <table className="dash-modern-table">
                  <thead>
                    <tr>
                      <th>Bike Model</th>
                      <th>Dates</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {bookings.slice(0, 5).map((b) => (
                        <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td className="cell-bike">
                            <div className="bike-thumb"><img src={b.bike?.image || '/placeholder.jpg'} alt="" /></div>
                            <strong>{b.bike?.name || 'Ride N Roar Bike'}</strong>
                          </td>
                          <td className="cell-date">{new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                          <td>
                            <span className={`pay-pill ${b.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                              {b.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${b.status?.toLowerCase()}`}>{b.status}</span>
                          </td>
                          <td>
                            <button onClick={() => navigate('/my-bookings')} className="btn-table-action"><ChevronRight size={16} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              ) : (
                <div className="empty-dashboard-state">
                  <p>You have no active bookings in Kathmandu.</p>
                  <button onClick={() => navigate('/bikes')} className="btn-outline-small">Browse Bikes</button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 👤 RIGHT PANEL: PROFILE SUMMARY */}
        <aside className="dash-right-panel">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="profile-summary-card">
            <div className="profile-gradient-top"></div>
            <div className="profile-avatar-container">
              <div className="avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
            </div>
            <div className="profile-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="badge-user-role">{user.role}</div>
            </div>
            
            <div className="quick-action-list">
              <button onClick={() => navigate('/profile')} className="qa-item"><User size={16}/> Account Settings</button>
              <button onClick={() => navigate('/support')} className="qa-item"><MapPin size={16}/> Support Centers</button>
              <button onClick={() => navigate('/calendar')} className="qa-item"><Calendar size={16}/> Booking Calendar</button>
            </div>
          </motion.div>

          <div className="promo-card">
            <h4>Invite & Earn</h4>
            <p>Share Ride N Roar with friends and get 10% off your next ride.</p>
            <button className="btn-promo">Get Invite Link</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerDashboard;