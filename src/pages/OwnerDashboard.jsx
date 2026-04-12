import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { 
  Plus, Edit, Trash2, X, Save, Wallet, Activity, 
  UploadCloud, ShieldCheck, Zap, Loader2, LayoutGrid, CheckCircle2 
} from 'lucide-react';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [data, setData] = useState({ stats: {}, revenueTrend: [], myBikes: [], activeRentals: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: '', name: '', brand: '', price: '', type: 'Commuter', cc: '150cc', images: [''], available: true, description: ''
  });

  const fetchOwnerStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/dashboard');
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error("Dashboard Load Failed");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOwnerStats(); }, [fetchOwnerStats]);

  const handleImageUpload = () => {
    if (!window.cloudinary) return alert("Cloudinary service not ready.");
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
      setFormData({ _id: newId, name: '', brand: '', price: '', type: 'Commuter', cc: '150cc', images: [''], available: true, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/owner/bike/${formData._id}`, formData);
      } else {
        await api.post('/owner/add-bike', formData);
      }
      setIsModalOpen(false);
      setShowRegSuccess(true);
      fetchOwnerStats();
    } catch (err) {
      // Detailed error capture
      alert(err.response?.data?.message || "Failed to save bike. Check console.");
    }
  };

  const deleteBike = async (id) => {
    if (window.confirm("Confirm deletion?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchOwnerStats();
      } catch (err) { alert("Delete failed."); }
    }
  };

  if (loading) return <div className="bento-loader"><Loader2 className="spinner-icon" size={48} /><p>Syncing...</p></div>;

  return (
    <div className="owner-bento-root">
      <div className="bento-container">
        <header className="bento-header">
          <div className="welcome-text">
            <span className="live-pill"><span className="pulse-dot"></span> System Live</span>
            <h1>Fleet <span className="gradient-text">Command</span></h1>
          </div>
          <div className="header-actions">
            <button className="btn-bento-primary" onClick={() => openModal()}><Plus size={20} /> Register Bike</button>
          </div>
        </header>

        <div className="bento-grid">
          <StatCard label="Total Revenue" val={`Rs. ${data.stats?.earnings?.toLocaleString() || 0}`} icon={<Wallet/>} color="#6366f1" />
          <StatCard label="Active" val={data.stats?.activeRentals || 0} icon={<Zap/>} color="#10b981" />
          <StatCard label="Fleet Size" val={data.stats?.totalBikes || 0} icon={<LayoutGrid/>} color="#f59e0b" />
        </div>

        <main className="dashboard-main">
          <div className="inventory-section">
            <div className="section-head">
              <h3>Registered Assets</h3>
              <button onClick={fetchOwnerStats} className="sync-btn"><Activity size={14}/> Refresh</button>
            </div>
            <div className="asset-list-scroll">
              {data.myBikes?.length > 0 ? data.myBikes.map(bike => (
                <div key={bike._id} className="fleet-row-item">
                  <img src={bike.images?.[0] || '/images/default-bike.jpg'} alt="" />
                  <div className="item-details">
                    <h4>{bike.name} <small>({bike.brand})</small></h4>
                    <p>{bike._id} • {bike.cc} • {bike.type}</p>
                  </div>
                  <span className={bike.available ? 's-badge-on' : 's-badge-off'}>{bike.available ? 'Ready' : 'Rented'}</span>
                  <div className="item-btns">
                    <button onClick={() => openModal(bike)} className="btn-edit"><Edit size={16}/></button>
                    <button onClick={() => deleteBike(bike._id)} className="btn-trash"><Trash2 size={16}/></button>
                  </div>
                </div>
              )) : <p className="empty-msg">No bikes found in your inventory.</p>}
            </div>
          </div>
        </main>
      </div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="bento-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bento-modal" onClick={(e)=>e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editMode ? 'Refine' : 'Register'} Bike</h2>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="bento-form">
                <div className="form-split">
                  <div className="input-group"><label>Model Name</label><input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required /></div>
                  <div className="input-group"><label>Brand</label><input value={formData.brand} onChange={(e)=>setFormData({...formData, brand:e.target.value})} required /></div>
                </div>
                <div className="form-split">
                  <div className="input-group"><label>Price (NPR)</label><input type="number" value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} required /></div>
                  <div className="input-group"><label>Engine (CC)</label><input value={formData.cc} onChange={(e)=>setFormData({...formData, cc:e.target.value})} required /></div>
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} placeholder="Condition, mileage, etc." />
                </div>
                <div className="upload-btn-zone" onClick={handleImageUpload}>
                  <UploadCloud size={24} />
                  <span>{formData.images[0] ? "Image Synchronized" : "Upload HD Photo"}</span>
                </div>
                <button type="submit" className="bento-save-btn"><Save size={18} /> Save to Fleet</button>
              </form>
            </motion.div>
          </div>
        )}

        {showRegSuccess && (
          <div className="bento-overlay">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bento-success-card">
              <div className="success-icon-box"><CheckCircle2 size={50} color="#10b981" /></div>
              <h2>Fleet Synchronized</h2>
              <p>Asset <strong>{formData.name}</strong> is now live in the marketplace.</p>
              <button className="bento-close-btn" onClick={() => setShowRegSuccess(false)}>Return to Base</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, val, icon, color }) => (
  <div className="bento-stat-card">
    <div className="bento-stat-icon" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>
    <div className="bento-stat-data"><small>{label}</small><h3>{val}</h3></div>
  </div>
);

export default OwnerDashboard;