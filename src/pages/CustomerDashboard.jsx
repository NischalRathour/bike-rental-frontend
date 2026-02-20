import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import "../styles/CustomerDashboard.css"; 

const CustomerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        setDataLoading(true);
        // ✅ Hits router.get("/my", ...) in your bookingRoutes.js
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

  if (authLoading) return <div className="loader">Namaste! Syncing...</div>;
  if (!user) return null;

  return (
    <div className="dash-container">
      <header className="dash-header">
        <h1>Namaste, {user.name}!</h1>
        <p>Manage your Kathmandu bike rentals here.</p>
      </header>
      
      <div className="stats-grid">
        <div className="stat-card"><h3>{bookings.length}</h3><p>Total Rides</p></div>
        <div className="stat-card"><h3>{bookings.filter(b => b.paymentStatus === 'Paid').length}</h3><p>Paid</p></div>
      </div>
      
      <div className="bookings-section">
        <h2>Your Recent Activity</h2>
        {dataLoading ? <p>Loading your fleet...</p> : (
           <table className="dash-table">
             <thead>
               <tr><th>Bike</th><th>Status</th><th>Payment</th></tr>
             </thead>
             <tbody>
               {bookings.map(b => (
                 <tr key={b._id}>
                   <td>{b.bike?.name || 'Ride N Roar'}</td>
                   <td><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></td>
                   <td><span className={`pay ${b.paymentStatus.toLowerCase()}`}>{b.paymentStatus}</span></td>
                 </tr>
               ))}
             </tbody>
           </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;