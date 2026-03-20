import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Bike, Edit, Trash2, X, Save, 
  TrendingUp, Leaf, DollarSign, Settings,
  Image as ImageIcon, BarChart3, Clock, Activity, Wallet
} from 'lucide-react';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', category: 'Sport', images: [''], description: '', status: 'Available'
  });

  const fetchOwnerStats = async () => {
    try {
      const res = await api.get('/owner/dashboard');
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error("Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOwnerStats(); }, []);

  const openModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setFormData({ ...bike });
    } else {
      setEditMode(false);
      setFormData({ name: '', brand: '', price: '', category: 'Sport', images: [''], description: '', status: 'Available' });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, images: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) await api.put(`/owner/bike/${formData._id}`, formData);
      else await api.post('/owner/add-bike', formData);
      setIsModalOpen(false);
      fetchOwnerStats();
    } catch (err) { alert("Action failed."); }
  };

  const handleMaintenance = async (id) => {
    try {
      await api.patch(`/owner/bike/${id}/maintenance`);
      fetchOwnerStats();
    } catch (err) { alert("Operation failed."); }
  };

  const deleteBike = async (id) => {
    if (window.confirm("Purge unit from fleet?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchOwnerStats();
      } catch (err) { alert("Deletion blocked."); }
    }
  };

  if (loading || !data) return <div className="owner-loader-container"><div className="intelligence-spinner"></div><p>Synchronizing Private Ledger...</p></div>;

  return (
    <div className="owner-dashboard-root" style={{ padding: '100px 5% 40px', background: '#f8fafc' }}>
      <header className="owner-hero-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 className="hero-text-glow" style={{ fontWeight: 900, fontSize: '2.5rem' }}>Fleet <span style={{ color: '#6366f1' }}>Intelligence</span></h1>
          <p style={{ color: '#64748b' }}>Private Fleet Management Node • Kathmandu</p>
        </div>
        <button className="btn-add-primary" onClick={() => openModal()} style={{ background: '#0f172a', color: '#fff', padding: '15px 30px', borderRadius: '15px', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Plus size={20} /> Register Unit
        </button>
      </header>

      <div className="stats-intelligence-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
        <StatCard label="Net Revenue" val={`Rs. ${data.stats.earnings.toLocaleString()}`} icon={<Wallet/>} color="#10b981" />
        <StatCard label="Live Rentals" val={data.stats.activeRentals} icon={<Activity/>} color="#6366f1" />
        <StatCard label="Fleet Count" val={data.stats.totalBikes} icon={<Bike/>} color="#f59e0b" />
      </div>

      <div className="owner-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div className="inventory-section">
          <h3 style={{ marginBottom: '20px', fontWeight: 800 }}>Asset Management</h3>
          <div className="inventory-grid-pro" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {data.myBikes.map(bike => (
              <div key={bike._id} className="unit-card-premium" style={{ background: '#fff', padding: '20px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                <div className="unit-media" style={{ position: 'relative' }}>
                   <img src={bike.images?.[0] || "/default-bike.jpg"} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px' }} alt="" />
                   {/* ✅ FIXED LINE BELOW */}
                   <span className={`status-pill ${(bike.status || 'Available').toLowerCase()}`} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', fontWeight: '800', padding: '5px 12px', borderRadius: '100px', background: 'rgba(255,255,255,0.9)' }}>
                    {bike.status || 'Available'}
                  </span>
                </div>
                <h4 style={{ margin: 0 }}>{bike.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#6366f1' }}>Rs. {bike.price}</span>
                  <div className="unit-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn" onClick={() => openModal(bike)}><Edit size={16}/></button>
                    <button className="action-btn" onClick={() => handleMaintenance(bike._id)}><Settings size={16}/></button>
                    <button className="action-btn del" onClick={() => deleteBike(bike._id)}><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notification-center" style={{ background: '#fff', padding: '30px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Live Rental Stream</h3>
          <div className="rental-list">
            {data.activeRentals.length > 0 ? data.activeRentals.map(rental => (
              <div key={rental._id} className="notification-pill" style={{ padding: '15px', background: '#f8fafc', borderRadius: '15px', marginBottom: '12px', borderLeft: '4px solid #6366f1' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{rental.user?.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Riding: {rental.bike?.name}</p>
                {/* ✅ FIXED LINE BELOW */}
                <div className={`status-pill ${(rental.status || 'Active').toLowerCase()}`} style={{ marginTop: '5px', fontSize: '0.7rem', fontWeight: 700 }}>{rental.status || 'Active'}</div>
              </div>
            )) : (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>No active transmissions.</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="premium-modal-card">
              <div className="modal-header">
                <h2>{editMode ? 'Modify Asset' : 'Register New Unit'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form-grid">
                <div className="input-group">
                  <label>Model Name</label>
                  <input name="name" type="text" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="input-group">
                  <label>Daily Rate (NPR)</label>
                  <input name="price" type="number" value={formData.price} onChange={handleFormChange} required />
                </div>
                <div className="input-group full">
                  <label><ImageIcon size={14}/> Image URL</label>
                  <input name="image" type="text" value={formData.images[0]} onChange={handleFormChange} />
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

const StatCard = ({ label, val, icon, color }) => (
  <div className="glass-stat-card" style={{ background: '#fff', padding: '30px', borderRadius: '30px', borderBottom: `5px solid ${color}`, border: '1px solid #e2e8f0' }}>
    <div style={{ color: color, marginBottom: '10px' }}>{icon}</div>
    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: '800' }}>{label}</p>
    <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.8rem' }}>{val}</h2>
  </div>
);

export default OwnerDashboard;