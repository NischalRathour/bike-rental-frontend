import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DollarSign, ShoppingCart, Bike, Users, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, totalBikes: 0, totalUsers: 0, pendingBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.stats); // Matches your controller
        setBookings(res.data.recentBookings);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdminData(); }, []);

  if (loading) return <div className="admin-loader">Syncing Kathmandu Fleet...</div>;

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <DollarSign color="#10b981" />
          <p>Revenue</p>
          <h3>Rs. {stats.totalRevenue.toLocaleString()}</h3>
        </div>
        {/* Add other StatCards for Bookings, Bikes, and Users here */}
      </div>

      <section className="recent-activity">
        <h2>Live Requests ({stats.pendingBookings} Pending)</h2>
        <table>
          <thead>
            <tr><th>Customer</th><th>Bike</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.user?.name}</td>
                <td>{b.bike?.name}</td>
                <td><span className={`status-${b.status.toLowerCase()}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;