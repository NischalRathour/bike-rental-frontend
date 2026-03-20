import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
  Bike, Leaf, Award, Activity, 
  MapPin, ShieldCheck, ChevronRight, 
  Search, Settings, LogOut, Clock
} from 'lucide-react';
import "../styles/CustomerDashboard.css";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) setBookings(res.data.bookings);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loader-overlay"><div className="spinner"></div></div>;

  // Calculate Aggregated Data
  const totalCo2 = (bookings.length * 1.8).toFixed(1);
  const rewardPoints = bookings.length * 50;

  return (
    <div className="dash-container">
      <div className="dash-main-layout">
        
        {/* 👤 LEFT SIDEBAR: PROFILE & TOOLS */}
        <aside className="dash-sidebar">
          <div className="profile-card-premium">
            <div className="avatar-main">{user?.name?.charAt(0) || "U"}</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{user?.name || "Rider"}</h3>
            <div className="role-tag"><ShieldCheck size={14}/> Verified Explorer</div>
            
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800', marginBottom: '15px' }}>DASHBOARD MENU</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/bikes" className="nav-link-item"><Activity size={18}/> Fleet Console</Link>
                <Link to="/my-bookings" className="nav-link-item"><Clock size={18}/> History</Link>
                <Link to="/profile" className="nav-link-item"><Settings size={18}/> Settings</Link>
                <button onClick={logout} className="nav-link-item" style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                  <LogOut size={18}/> Terminate Session
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* 📊 MAIN CONTENT AREA */}
        <main className="dash-main-content">
          <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '0.8rem' }}>COMMAND CENTER</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '5px 0' }}>Namaste, {user?.name.split(' ')[0]}</h1>
            </div>
            <Link to="/bikes"><button className="btn-rent-new">New Adventure</button></Link>
          </header>

          {/* 🌿 TOP STATS ROW */}
          <div className="stats-header-grid">
            <div className="stat-pill-premium">
              <div className="stat-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}><Leaf size={26}/></div>
              <div><p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', margin: 0 }}>CO2 SAVED</p><h3>{totalCo2} kg</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box" style={{ background: '#eef2ff', color: '#6366f1' }}><Award size={26}/></div>
              <div><p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', margin: 0 }}>REWARD POINTS</p><h3>{rewardPoints} pts</h3></div>
            </div>
            <div className="stat-pill-premium">
              <div className="stat-icon-box" style={{ background: '#fff7ed', color: '#f97316' }}><Bike size={26}/></div>
              <div><p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', margin: 0 }}>TOTAL RIDES</p><h3>{bookings.length}</h3></div>
            </div>
          </div>

          {/* 📋 ACTIVITY LOG CARD */}
          <div className="activity-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: '900' }}>Recent Activity Log</h3>
              <div className="live-tag">LIVE FEED</div>
            </div>

            <div className="table-scroll-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Impact</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: '800' }}>{b.bike?.name || "Premium Ride Unit"}</td>
                      <td>{new Date(b.startDate).toLocaleDateString()}</td>
                      <td style={{ color: '#10b981', fontWeight: '700' }}>+{(Math.random() * 2).toFixed(1)}kg CO2</td>
                      <td>
                        <span className={`status-badge ${b.status.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td><Link to={`/payment/${b._id}`} style={{ color: '#6366f1' }}><ChevronRight size={18}/></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;