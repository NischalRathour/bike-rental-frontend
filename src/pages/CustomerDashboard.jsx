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
  const { user, logout, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
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

  if (loading || authLoading) {
    return (
      <div className="loader-overlay-premium">
        <div className="spinner-quantum"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Calculations
  const totalCo2 = (bookings.length * 1.8).toFixed(1);
  const rewardPoints = bookings.length * 50;
  const firstName = user?.name ? user.name.split(' ')[0] : "Rider";

  return (
    <div className="dash-container">
      <div className="dash-main-layout">
        
        {/* 👤 SIDEBAR */}
        <aside className="dash-sidebar">
          <div className="profile-card-premium">
            <div className="avatar-main">
              {user?.name ? user.name.charAt(0).toUpperCase() : <Zap size={20} />}
            </div>
            <h3 className="profile-name-text">{user?.name || "Guest Rider"}</h3>
            <div className="role-tag"><ShieldCheck size={14}/> Verified Customer</div>
            
            <nav className="sidebar-nav-group">
              <p className="menu-label">Main Menu</p>
              <Link to="/bikes" className="nav-link-item"><Activity size={18}/> Browse Bikes</Link>
              <Link to="/my-bookings" className="nav-link-item"><Clock size={18}/> My Bookings</Link>
              <Link to="/profile" className="nav-link-item"><Settings size={18}/> Edit Profile</Link>
              <button onClick={logout} className="nav-link-item logout-red-btn">
                <LogOut size={18}/> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT */}
        <main className="dash-main-content">
          <header className="dash-header-premium">
            <div>
              <span className="dash-kicker">Account Status: Online</span>
              <h1 className="dash-welcome-title">Welcome back, {firstName}</h1>
            </div>
            <Link to="/bikes" className="no-underline">
               <button className="btn-rent-new">Rent a New Bike</button>
            </Link>
          </header>

          {/* 🌿 STATS ROW */}
          <div className="stats-header-grid">
            <div className="stat-pill-premium">
              <div className="stat-icon-box eco"><Leaf size={24}/></div>
              <div><p className="stat-label">Eco Savings</p><h3>{totalCo2} kg CO₂</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box points"><Award size={24}/></div>
              <div><p className="stat-label">Points Earned</p><h3>{rewardPoints} pts</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box rides"><Bike size={24}/></div>
              <div><p className="stat-label">Total Rides</p><h3>{bookings.length}</h3></div>
            </div>
          </div>

          {/* 📋 RECENT BOOKINGS */}
          <section className="activity-card-premium">
            <div className="card-header-flex">
              <h3 className="card-title">Recent Activity</h3>
              <div className="live-pulse-tag"><div className="pulse-dot"></div> System Sync</div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Bike Model</th>
                    <th>Date</th>
                    <th>Eco Impact</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map((b) => (
                    <tr key={b._id} className="table-row-hover">
                      <td className="font-bold-asset">{b.bike?.name || "Unknown Model"}</td>
                      <td>{new Date(b.startDate).toLocaleDateString('en-NP')}</td>
                      <td className="eco-text">+{ (Math.random() * 1.5 + 0.5).toFixed(1) }kg</td>
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
                      <td colSpan="5" className="empty-state-text">You haven't rented any bikes yet.</td>
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