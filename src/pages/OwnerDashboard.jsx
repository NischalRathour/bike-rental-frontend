import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Plus, Bike, Edit, Trash2, X, Save, 
  Wallet, Activity, Settings, Image as ImageIcon,
  UploadCloud, CheckCircle, ArrowUpRight, Navigation,
  ShieldCheck, Zap, Trash
} from 'lucide-react';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: '', name: '', brand: '', price: '', type: 'Commuter', images: [''], available: true
  });

  const fetchOwnerStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      // Optional: Set some dummy data or an error state so the UI doesn't just hang
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOwnerStats(); }, []);

  // ☁️ CLOUDINARY UPLOAD LOGIC
  const handleImageUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary library not loaded. Please refresh.");
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: "dlkwoqzq8", 
        uploadPreset: "fleet_preset", 
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        resourceType: "image",
        folder: "bike_rentals" 
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, images: [result.info.secure_url] }));
        } else if (error) {
          console.error("Cloudinary Error:", error);
        }
      }
    );
  };

  const openModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setFormData({ ...bike });
    } else {
      setEditMode(false);
      const tempId = "b" + Math.floor(Math.random() * 10000);
      setFormData({ 
        _id: tempId, name: '', brand: '', price: '', type: 'Commuter', images: [''], available: true 
      });
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
      alert(err.response?.data?.message || "Submit failed. Check server logs.");
    }
  };

  const deleteBike = async (id) => {
    if (window.confirm("CRITICAL: Remove this unit from your fleet?")) {
      try {
        const res = await api.delete(`/owner/bike/${id}`);
        if (res.data.success) fetchOwnerStats();
      } catch (err) {
        alert("Deletion failed.");
      }
    }
  };

  const handlePayout = () => {
    alert(`Payout Request for Rs. ${data?.stats?.earnings || 0} dispatched to Admin.`);
  };

  // --- LOADING STATE ---
  if (loading) return (
    <div className="owner-loader-container">
      <div className="intelligence-spinner"></div>
      <p>Synchronizing Asset Ledger...</p>
    </div>
  );

  // --- ERROR STATE (If backend 500 fails) ---
  if (!data) return (
    <div className="owner-loader-container">
      <p style={{color: 'red'}}>⚠️ Dashboard Sync Failed (Server Error 500)</p>
      <button onClick={fetchOwnerStats} className="btn-add-primary">Retry Sync</button>
    </div>
  );

  return (
    <div className="owner-dashboard-root">
      <header className="owner-hero-header">
        <div className="title-stack">
          <div className="live-status-tag"><div className="pulse-dot"></div> NODE ACTIVE</div>
          <h1 className="hero-text-glow">Fleet <span className="text-indigo">Commander</span></h1>
          <p>Managed Fleet Operations • Kathmandu Central</p>
        </div>
        <div className="header-actions">
           <button className="btn-payout" onClick={handlePayout}>
             <Wallet size={18}/> Request Payout
           </button>
           <button className="btn-add-primary" onClick={() => openModal()}>
             <Plus size={20} /> Add Asset
           </button>
        </div>
      </header>

      {/* --- STATS CARDS --- */}
      <div className="stats-intelligence-row">
        <StatCard label="Accumulated Net" val={`Rs. ${(data.stats?.earnings || 0).toLocaleString()}`} icon={<ShieldCheck/>} color="#10b981" />
        <StatCard label="Active Rents" val={data.stats?.activeRentals || 0} icon={<Zap/>} color="#6366f1" />
        <StatCard label="Total Units" val={data.stats?.totalBikes || 0} icon={<Navigation/>} color="#f59e0b" />
      </div>

      {/* --- REVENUE CHART --- */}
      <div className="revenue-analytics-card">
        <div className="chart-head">
          <div className="chart-title">
            <Activity size={18} className="text-indigo"/>
            <h3>Earnings Velocity</h3>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={(data?.revenueTrend || []).map(item => ({
              day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item._id - 1] || "N/A",
              amount: item.amount || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="amount" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="owner-main-grid">
        {/* --- INVENTORY --- */}
        <div className="inventory-section">
          <h3>Fleet Inventory</h3>
          <div className="inventory-grid-pro">
            {(data.myBikes || []).map(bike => (
              <div key={bike._id} className="unit-card-premium">
                <div className="unit-media">
                   <img src={bike.images?.[0] || "/default-bike.jpg"} alt={bike.name} />
                   <span className={`status-pill ${bike.available ? 'available' : 'rented'}`}>
                    {bike.available ? 'Available' : 'Rented'}
                  </span>
                </div>
                <div className="unit-details">
                  <h4>{bike.name}</h4>
                  <div className="unit-meta">
                    <span className="unit-price">Rs. {bike.price}</span>
                    <div className="unit-actions">
                      <button onClick={() => openModal(bike)} className="action-btn"><Edit size={16}/></button>
                      <button onClick={() => deleteBike(bike._id)} className="action-btn del"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- LIVE TELEMETRY --- */}
        <div className="notification-center">
          <h3>Live Telemetry</h3>
          <div className="rental-list">
            {(data.activeRentals || []).length > 0 ? data.activeRentals.map(rental => (
              <div key={rental._id} className="notification-pill">
                <div className="pill-text">
                    <strong>{rental.user?.name || "Guest"}</strong>
                    <span>Riding: {rental.bikes?.[0]?.name || "Unit"}</span>
                </div>
                <div className={`status-tag ${(rental.status || '').toLowerCase()}`}>{rental.status}</div>
              </div>
            )) : <div className="empty-state">No active rent cycles.</div>}
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
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
                  <label>Model Name</label>
                  <input name="name" type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Daily Rate (NPR)</label>
                  <input name="price" type="number" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
                </div>
                
                <div className="input-group full">
                  <label>Visual Identity</label>
                  <button type="button" className="btn-upload-cloud" onClick={handleImageUpload}>
                    <UploadCloud size={18}/> {formData.images[0] ? "Image Verified" : "Upload to Cloudinary"}
                  </button>
                  {formData.images[0] && (
                    <div className="preview-wrap" style={{position: 'relative', marginTop: '10px'}}>
                      <img src={formData.images[0]} className="image-preview-sm" alt=""/>
                      <button 
                        type="button" 
                        style={{position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px'}}
                        onClick={() => setFormData({...formData, images: ['']})}
                      >
                        <Trash size={12}/> Remove
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-commit">
                  <Save size={18}/> {editMode ? 'Update Asset' : 'Commit to Fleet'}
                </button>
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
    <div className="icon-wrap" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className="stat-info">
      <label>{label}</label>
      <h2>{val}</h2>
    </div>
  </div>
);

export default OwnerDashboard;