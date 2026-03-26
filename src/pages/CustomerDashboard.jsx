import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
  Bike, Leaf, Award, Activity, 
  ShieldCheck, ChevronRight, 
  Settings, LogOut, Clock, Zap
} from 'lucide-react';
import "../styles/CustomerDashboard.css";

const CustomerDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth(); // ✅ Get authLoading from context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      // ✅ Only fetch if we actually have a user
      if (!user) return;
      
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setBookings(res.data.bookings || []);
        }
      } catch (err) { 
        console.error("Dashboard Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    if (!authLoading) {
      fetchDashboard();
    }
  }, [user, authLoading]);

  // 🏁 1. Loading State (Premium Spinner)
  if (loading || authLoading) {
    return (
      <div className="loader-overlay-premium">
        <div className="spinner-quantum"></div>
        <p>Syncing Command Center...</p>
      </div>
    );
  }

  // 📊 2. Aggregated Data Logic (Safe Calculations)
  const totalCo2 = (bookings.length * 1.8).toFixed(1);
  const rewardPoints = bookings.length * 50;
  const firstName = user?.name ? user.name.split(' ')[0] : "Explorer";

  return (
    <div className="dash-container">
      <div className="dash-main-layout">
        
        {/* 👤 LEFT SIDEBAR */}
        <aside className="dash-sidebar">
          <div className="profile-card-premium">
            <div className="avatar-main">
              {user?.name ? user.name.charAt(0).toUpperCase() : <Zap size={20} />}
            </div>
            <h3 className="profile-name-text">{user?.name || "Premium Rider"}</h3>
            <div className="role-tag"><ShieldCheck size={14}/> Verified Explorer</div>
            
            <nav className="sidebar-nav-group">
              <p className="menu-label">COMMAND MENU</p>
              <Link to="/bikes" className="nav-link-item"><Activity size={18}/> Fleet Console</Link>
              <Link to="/my-bookings" className="nav-link-item"><Clock size={18}/> Travel History</Link>
              <Link to="/profile" className="nav-link-item"><Settings size={18}/> Account Settings</Link>
              <button onClick={logout} className="nav-link-item logout-red-btn">
                <LogOut size={18}/> Terminate Session
              </button>
            </nav>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT */}
        <main className="dash-main-content">
          <header className="dash-header-premium">
            <div>
              <span className="dash-kicker">OPERATIONAL STATUS: ACTIVE</span>
              <h1 className="dash-welcome-title">Namaste, {firstName}</h1>
            </div>
            <Link to="/bikes" className="no-underline">
               <button className="btn-rent-new">Initialize New Adventure</button>
            </Link>
          </header>

          {/* 🌿 STATS ROW */}
          <div className="stats-header-grid">
            <div className="stat-pill-premium">
              <div className="stat-icon-box eco"><Leaf size={24}/></div>
              <div><p className="stat-label">IMPACT SAVED</p><h3>{totalCo2} kg CO₂</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box points"><Award size={24}/></div>
              <div><p className="stat-label">REWARD POINTS</p><h3>{rewardPoints} pts</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box rides"><Bike size={24}/></div>
              <div><p className="stat-label">TOTAL EXPEDITIONS</p><h3>{bookings.length}</h3></div>
            </div>
          </div>

          {/* 📋 RECENT ACTIVITY */}
          <section className="activity-card-premium">
            <div className="card-header-flex">
              <h3 className="card-title">Expedition Ledger</h3>
              <div className="live-pulse-tag"><div className="pulse-dot"></div> LIVE FEED</div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Vehicle Asset</th>
                    <th>Departure</th>
                    <th>Eco Impact</th>
                    <th>Status</th>
                    <th>Command</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map((b) => (
                    <tr key={b._id} className="table-row-hover">
                      <td className="font-bold-asset">{b.bike?.name || "Fleet Unit"}</td>
                      <td>{new Date(b.startDate).toLocaleDateString('en-NP')}</td>
                      <td className="eco-text">+{(Math.random() * 2).toFixed(1)}kg</td>
                      <td>
                        <span className={`status-badge-premium ${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/payment/${b._id}`} className="action-icon-link">
                           <ChevronRight size={18}/>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="empty-state-text">No expeditions found in your ledger.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;