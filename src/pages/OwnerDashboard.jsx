import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Plus, Edit, Trash2, X, Save, Wallet, Activity, 
  UploadCloud, ShieldCheck, Zap, Navigation, Loader2, AlertCircle
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
      setError("Failed to sync fleet data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOwnerStats(); }, [fetchOwnerStats]);

  const handleImageUpload = () => {
    if (!window.cloudinary) return alert("Cloudinary not loaded");
    window.cloudinary.openUploadWidget({
      cloudName: "dlkwoqzq8", uploadPreset: "fleet_preset", sources: ["local", "url"], multiple: false
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
      // 🔥 FIX: Generate a random ID so the backend doesn't receive an empty string
      const newId = "B-" + Math.floor(1000 + Math.random() * 9000);
      setFormData({ 
        _id: newId, name: '', brand: '', price: '', type: 'Commuter', cc: '150cc', images: [''], available: true 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/owner/bike/${formData._id}`, formData);
      } else {
        // 🔥 POST: Sending full data including the generated _id and brand
        await api.post('/owner/add-bike', formData);
      }
      setIsModalOpen(false);
      fetchOwnerStats();
    } catch (err) {
      console.error("Post Error:", err.response?.data);
      alert(err.response?.data?.message || "Check if all fields (Brand, Name, Price) are filled.");
    }
  };

  const deleteBike = async (id) => {
    if (window.confirm("Remove this unit?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchOwnerStats();
      } catch (err) { alert("Delete failed"); }
    }
  };

  if (loading) return <div className="owner-loader-container"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="owner-dashboard-root">
      <header className="owner-hero-header">
        <div className="title-stack">
          <h1>Fleet <span className="text-indigo">Commander</span></h1>
          <p>Managed Operations • Kathmandu Central</p>
        </div>
        <button className="btn-add-primary" onClick={() => openModal()}><Plus /> Add Bike</button>
      </header>

      {/* STATS */}
      <div className="stats-intelligence-row">
        <StatCard label="Earnings" val={`Rs. ${data.stats?.earnings || 0}`} icon={<ShieldCheck/>} color="#10b981" />
        <StatCard label="Rents" val={data.stats?.activeRentals || 0} icon={<Zap/>} color="#6366f1" />
        <StatCard label="Fleet" val={data.stats?.totalBikes || 0} icon={<Navigation/>} color="#f59e0b" />
      </div>

      <div className="owner-main-grid">
        <div className="inventory-section">
          <h3>Fleet Inventory</h3>
          <div className="inventory-grid-pro">
            {data.myBikes?.map(bike => (
              <div key={bike._id} className="unit-card-premium">
                <img src={bike.images?.[0]} alt="" />
                <div className="unit-details">
                  <h4>{bike.name} ({bike.brand})</h4>
                  <p>Rs. {bike.price} / day</p>
                  <div className="unit-actions">
                    <button onClick={() => openModal(bike)}><Edit size={16}/></button>
                    <button onClick={() => deleteBike(bike._id)} className="del"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="premium-modal-card">
              <div className="modal-header">
                <h2>{editMode ? 'Edit Bike' : 'Add New Bike'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form-grid">
                <div className="input-group">
                  <label>Bike Model Name</label>
                  <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required placeholder="e.g. Pulsar 220" />
                </div>
                <div className="input-group">
                  <label>Brand</label>
                  <input value={formData.brand} onChange={(e)=>setFormData({...formData, brand:e.target.value})} required placeholder="e.g. Bajaj" />
                </div>
                <div className="input-group">
                  <label>Daily Price (NPR)</label>
                  <input type="number" value={formData.price} onChange={(e)=>setFormData({...formData, price:e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Engine (CC)</label>
                  <input value={formData.cc} onChange={(e)=>setFormData({...formData, cc:e.target.value})} />
                </div>
                <div className="input-group full">
                  <button type="button" className="btn-upload-cloud" onClick={handleImageUpload}>
                    <UploadCloud /> {formData.images[0] ? "Image Ready" : "Upload Image"}
                  </button>
                </div>
                <button type="submit" className="btn-commit"><Save /> {editMode ? 'Update' : 'Add to Fleet'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, val, icon, color }) => (
  <div className="glass-stat-card" style={{ borderBottom: `4px solid ${color}` }}>
    <div className="icon-wrap" style={{ color }}>{icon}</div>
    <div className="stat-info"><label>{label}</label><h2>{val}</h2></div>
  </div>
);

export default OwnerDashboard;