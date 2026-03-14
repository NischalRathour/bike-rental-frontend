import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
// ✅ ADDED 'Leaf' TO THE IMPORT LIST BELOW
import { 
  Bike, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  MapPin, 
  User, 
  Activity, 
  Clock,
  Leaf 
} from 'lucide-react';
import "../styles/CustomerDashboard.css"; 

const CustomerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        setDataLoading(true);
        const res = await api.get('/bookings/my');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error", err);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchMyRides();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner"></div>
        <p>Namaste! Syncing your Kathmandu fleet...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dash-container">
      {/* 🚀 TOP NAVIGATION AREA */}
      <header className="dash-top-nav">
        <div className="nav-title-box">
          <h1 className="nav-title">My Command Center</h1>
          <p>Logged in as <span className="user-email">{user.email}</span></p>
        </div>
        <Link to="/bikes">
          <button className="btn-rent-new">
            <Bike size={18} /> Rent New Bike
          </button>
        </Link>
      </header>

      <div className="dash-main-grid">
        {/* 📊 MAIN CONTENT (LEFT) */}
        <main className="dash-content-area">
          
          {/* STATS ROW */}
          <div className="stats-row">
            <div className="glass-stat-card">
              <div className="stat-card-icon blue"><Activity size={24} /></div>
              <div>
                <h3>{bookings.length}</h3>
                <p>Total Rides</p>
              </div>
            </div>
            <div className="glass-stat-card">
              <div className="stat-card-icon green"><CheckCircle size={24} /></div>
              <div>
                <h3>{bookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid').length}</h3>
                <p>Completed Payments</p>
              </div>
            </div>
            <div className="glass-stat-card">
              <div className="stat-card-icon orange"><Clock size={24} /></div>
              <div>
                <h3>{bookings.filter(b => b.status?.toLowerCase() === 'pending').length}</h3>
                <p>Active Requests</p>
              </div>
            </div>
          </div>

          {/* RECENT BOOKINGS TABLE */}
          <div className="bookings-section-modern">
            <div className="section-header">
              <h2>Recent Activity Log</h2>
              <span className="live-tag">LIVE UPDATES</span>
            </div>

            {dataLoading ? (
              <div className="table-loader">Fetching ride data...</div>
            ) : (
              <div className="table-responsive">
                <table className="dash-modern-table">
                  <thead>
                    <tr>
                      <th>VEHICLE</th>
                      <th>DATE RANGE</th>
                      <th>TOTAL PRICE</th>
                      <th>STATUS</th>
                      <th>PAYMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map(b => (
                        <tr key={b._id}>
                          <td className="bike-name-td">
                            <div className="bike-mini-icon"><Bike size={14}/></div>
                            {b.bike?.name || 'Ride N Roar'}
                          </td>
                          <td className="date-td">
                             <Calendar size={12} /> {new Date(b.startDate).toLocaleDateString()}
                          </td>
                          <td className="price-td">Rs. {b.totalPrice}</td>
                          <td>
                            <span className={`status-pill ${b.status?.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <span className={`pay-pill ${b.paymentStatus?.toLowerCase()}`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-state">No rides found. Ready for your first adventure?</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* 👤 PROFILE SIDEBAR (RIGHT) */}
        <aside className="dash-sidebar">
          <div className="profile-summary-card">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p className="role-badge"><User size={12}/> Verified Customer</p>
            <div className="profile-divider"></div>
            <div className="profile-details-list">
              <div className="detail-item">
                <MapPin size={14} /> <span>Kathmandu, NP</span>
              </div>
              <div className="detail-item">
                <CreditCard size={14} /> <span>Membership: Basic</span>
              </div>
            </div>
            <button className="btn-edit-profile">Settings</button>
          </div>

          <div className="eco-impact-box-mini">
             <Leaf size={20} color="#10b981" />
             <p>Your CO2 offset: <strong>{(bookings.length * 2.4).toFixed(1)}kg</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerDashboard;