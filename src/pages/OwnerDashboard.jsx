import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Plus, Edit, Trash2, X, Save, Wallet, Activity, 
  UploadCloud, ShieldCheck, Zap, Loader2, LayoutGrid
} from 'lucide-react';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [data, setData] = useState({ stats: {}, revenueTrend: [], myBikes: [], activeRentals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: '', name: '', brand: '', price: '', type: 'Commuter', cc: '150cc', images: [''], available: true
  });

  const fetchOwnerStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/dashboard');
      if (res.data.success) setData(res.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOwnerStats(); }, [fetchOwnerStats]);

  const handleImageUpload = () => {
    if (!window.cloudinary) return alert("Upload service not ready.");
    window.cloudinary.openUploadWidget({
      cloudName: "dlkwoqzq8", uploadPreset: "fleet_preset", sources: ["local", "url"]
    }, (error, result) => {
      if (!error && result.event === "success") {
        setFormData(prev => ({ ...prev, images: [result.info.secure_url] }));
      }
    });
  };

  const openModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setFormData({ ...bike });
    } else {
      setEditMode(false);
      const newId = "B-" + Math.floor(1000 + Math.random() * 9000);
      setFormData({ _id: newId, name: '', brand: '', price: '', type: 'Commuter', cc: '150cc', images: [''], available: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) await api.put(`/owner/bike/${formData._id}`, formData);
      else await api.post('/owner/add-bike', formData);
      setIsModalOpen(false);
      fetchOwnerStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save bike.");
    }
  };

  const deleteBike = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchOwnerStats();
      } catch (err) { alert("Delete failed."); }
    }
  };

  if (loading) return (
    <div className="premium-loader">
      <Loader2 className="spinner-icon" size={48} />
      <p>Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="owner-root">
      <header className="owner-header">
        <div className="header-text">
          <span className="badge-live">Online</span>
          <h1>My <span className="gradient-text">Dashboard</span></h1>
          <p>Owner ID: {data.ownerId || 'User-42'}</p>
        </div>
        <div className="header-btns">
          <button className="btn-secondary" onClick={() => alert("Payout requested")}><Wallet size={18} /> Payout</button>
          <button className="btn-primary" onClick={() => openModal()}><Plus size={20} /> Add Bike</button>
        </div>
      </header>

      {/* KPI SECTION */}
      <div className="kpi-grid">
        <StatCard label="Total Earnings" val={`Rs. ${data.stats?.earnings || 0}`} icon={<ShieldCheck/>} color="#6366f1" />
        <StatCard label="Active Bookings" val={data.stats?.activeRentals || 0} icon={<Zap/>} color="#10b981" />
        <StatCard label="My Bikes" val={data.stats?.totalBikes || 0} icon={<LayoutGrid/>} color="#f59e0b" />
      </div>

      <main className="dashboard-content">
        {/* INVENTORY */}
        <div className="inventory-pane">
          <div className="pane-header">
            <h3>My Bikes</h3>
            <button onClick={fetchOwnerStats} className="refresh-link">Refresh List</button>
          </div>
          <div className="asset-grid">
            {data.myBikes?.length > 0 ? data.myBikes.map(bike => (
              <motion.div whileHover={{ y: -8 }} key={bike._id} className="asset-card">
                <div className="asset-img">
                  <img src={bike.images?.[0] || 'default.jpg'} alt="" />
                  <div className={`tag ${bike.available ? 'online' : 'busy'}`}>
                    {bike.available ? 'Available' : 'Rented'}
                  </div>
                </div>
                <div className="asset-info">
                  <h4>{bike.name} <span>{bike.brand}</span></h4>
                  <div className="asset-footer">
                    <span className="price">Rs. {bike.price}</span>
                    <div className="asset-actions">
                      <button onClick={() => openModal(bike)} className="edit" title="Edit"><Edit size={16}/></button>
                      <button onClick={() => deleteBike(bike._id)} className="trash" title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : <p className="empty-msg">No bikes added yet.</p>}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="side-pane">
           <div className="glass-card">
              <h3>Income Flow</h3>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.revenueTrend?.length > 0 ? data.revenueTrend : [{day: 'N/A', amount: 0}]}>
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {data.revenueTrend?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === data.revenueTrend.length - 1 ? '#6366f1' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-card mt-20">
              <h3>Recent Rentals</h3>
              <div className="event-list">
                {data.activeRentals?.length > 0 ? data.activeRentals.map(rental => (
                  <div key={rental._id} className="event-item">
                    <div className="event-dot"></div>
                    <div className="event-details">
                      <p><strong>{rental.user?.name}</strong> rented <strong>{rental.bikes?.[0]?.name}</strong></p>
                      <span>{new Date(rental.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : <p className="empty-msg">No active rentals.</p>}
              </div>
           </div>
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="premium-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="premium-modal">
              <div className="modal-top">
                <h2>{editMode ? 'Edit Bike' : 'Add New Bike'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-row">
                  <div className="f-group">
                    <label>Bike Name</label>
                    <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required placeholder="e.g. Pulsar 220" />
                  </div>
                  <div className="f-group">
                    <label>Brand</label>
                    <input value={formData.brand} onChange={(e)=>setFormData({...formData, brand:e.target.value})} required placeholder="e.g. Bajaj" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="f-group">
                    <label>Daily Price (NPR)</label>
                    <input type="number" value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} required />
                  </div>
                  <div className="f-group">
                    <label>Engine (CC)</label>
                    <input value={formData.cc} onChange={(e)=>setFormData({...formData, cc:e.target.value})} placeholder="e.g. 220cc" />
                  </div>
                </div>
                <div className="f-group">
                  <button type="button" className="upload-trigger" onClick={handleImageUpload}>
                    <UploadCloud size={20} /> {formData.images[0] ? "Image Uploaded" : "Upload Bike Photo"}
                  </button>
                </div>
                <button type="submit" className="submit-btn"><Save size={18} /> Save Bike</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, val, icon, color }) => (
  <div className="kpi-card">
    <div className="kpi-icon" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className="kpi-val">
      <small>{label}</small>
      <h3>{val}</h3>
    </div>
  </div>
);

export default OwnerDashboard;