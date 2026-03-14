import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Bike, Edit, Trash2, X, Save, 
  TrendingUp, Leaf, DollarSign, Settings,
  Image as ImageIcon, BarChart3, Clock, Activity
} from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [bikes, setBikes] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalRentals: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', available: true, co2SavedPerKm: 0.15, images: ['']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const fleetRes = await api.get('/owner/my-fleet');
      const earningsRes = await api.get('/owner/earnings');
      const rentalsRes = await api.get('/owner/active-rentals');
      
      if (fleetRes.data.success) setBikes(fleetRes.data.bikes);
      if (earningsRes.data.success) setEarnings(earningsRes.data.data);
      if (rentalsRes.data.success) setActiveRentals(rentalsRes.data.activeRentals);
    } catch (err) { 
      console.error("Owner Sync Error", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleMaintenance = async (id) => {
    try {
      const res = await api.patch(`/owner/bike/${id}/maintenance`);
      if (res.data.success) fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Maintenance toggle failed.");
    }
  };

  const handleOpenModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setCurrentId(bike._id);
      setFormData({ ...bike });
    } else {
      setEditMode(false);
      setFormData({ name: '', brand: '', price: '', available: true, co2SavedPerKm: 0.15, images: [''] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/owner/bike/${currentId}`, formData);
      } else {
        await api.post('/owner/add-bike', formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) { 
      alert("Action failed."); 
    }
  };

  const deleteBike = async (id) => {
    if (window.confirm("CRITICAL: Decommission this unit from inventory?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchData();
      } catch (err) { 
        alert("Removal blocked: active rental bindings."); 
      }
    }
  };

  const ownerStats = [
    { label: "Fleet Count", val: bikes.length, icon: <Bike size={20}/>, color: "blue", trend: "Inventory" },
    { label: "Active Rentals", val: activeRentals.length, icon: <Clock size={20}/>, color: "amber", trend: "Live" },
    { label: "Gross Revenue", val: `Rs. ${earnings.totalEarnings.toLocaleString()}`, icon: <DollarSign size={20}/>, color: "purple", trend: "Verified" }
  ];

  if (loading) return (
    <div className="owner-loader-container">
      <div className="intelligence-spinner"></div>
      <p>Synchronizing Private Ledger...</p>
    </div>
  );

  return (
    <div className="owner-dashboard-root">
      <header className="owner-hero-header">
        <div className="titles">
          <h1 className="hero-text-glow">Fleet Intelligence</h1>
          <p>Operational control for Kathmandu private owners.</p>
        </div>
        <button className="btn-add-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Register Unit
        </button>
      </header>

      <div className="stats-intelligence-row">
        {ownerStats.map((item, i) => (
          <StatCard key={i} item={item} index={i} />
        ))}
      </div>

      <section className="notification-center-card">
        <div className="section-head">
          <div className="flex-group">
            <Activity size={20} className="pulse-icon" />
            <h2>Live Rental Stream</h2>
          </div>
          <span className="live-status">LIVE FEED</span>
        </div>

        <div className="notification-scroll">
          {activeRentals.length > 0 ? activeRentals.map((rental) => (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={rental._id} className="notification-pill">
              <div className="client-meta">
                <div className="avatar-hex">{rental.user?.name?.charAt(0)}</div>
                <div className="meta-text">
                  <strong>{rental.user?.name}</strong>
                  <span>is riding <strong>{rental.bike?.name}</strong></span>
                </div>
              </div>
              <div className="timeline-meta">
                <div className="meta-block">
                  <span className="label">RETURN DATE</span>
                  <span className="val">{new Date(rental.endDate).toLocaleDateString()}</span>
                </div>
                <div className={`status-pill ${rental.status.toLowerCase()}`}>{rental.status}</div>
              </div>
            </motion.div>
          )) : (
            <div className="empty-feed">No active transmissions detected in the fleet.</div>
          )}
        </div>
      </section>

      <section className="inventory-management">
        <div className="section-head">
          <div className="flex-group">
            <BarChart3 size={20} color="#6366f1" />
            <h2>Unit Management</h2>
          </div>
        </div>

        <div className="inventory-grid-pro">
          {bikes.map((bike) => (
            <motion.div layout key={bike._id} className="unit-card-premium">
              <div className="unit-media">
                <img src={bike.images?.[0] || "/images/default-bike.jpg"} alt={bike.name} />
                <span className={`status-pill ${bike.status?.toLowerCase()}`}>
                   {bike.status === 'Maintenance' ? '🔧 In Service' : (bike.available ? 'Available' : 'Rented')}
                </span>
              </div>
              <div className="unit-info">
                <h3>{bike.name}</h3>
                <div className="price-row">
                  <span className="price-val">Rs. {bike.price}<strong>/Day</strong></span>
                  <span className="eco-label"><Leaf size={12}/> {bike.co2SavedPerKm}kg</span>
                </div>
                <div className="unit-actions">
                  <button onClick={() => handleOpenModal(bike)} className="btn-edit-pro" title="Edit Details"><Edit size={16}/></button>
                  <button 
                    onClick={() => toggleMaintenance(bike._id)} 
                    className={`btn-maint-pro ${bike.status === 'Maintenance' ? 'active' : ''}`}
                    title="Toggle Maintenance Mode"
                  >
                    <Settings size={16} />
                  </button>
                  <button onClick={() => deleteBike(bike._id)} className="btn-del-pro" title="Decommission"><Trash2 size={16}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="premium-modal-card">
              <div className="modal-header">
                <h2>{editMode ? 'Modify Asset' : 'Register New Unit'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form-grid">
                <div className="input-group">
                  <label>Model Designation</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Rental Rate (NPR/Day)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="input-group full">
                  <label><ImageIcon size={14}/> Image Source URL</label>
                  <input type="text" value={formData.images?.[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} />
                </div>
                <button type="submit" className="btn-commit"><Save size={18}/> Commit to Database</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;