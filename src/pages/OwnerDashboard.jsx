import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Bike, Edit, Trash2, X, Save, 
  TrendingUp, Leaf, DollarSign, Settings 
} from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [bikes, setBikes] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalRentals: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', available: true, co2SavedPerKm: 0.15 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const fleetRes = await api.get('/owner/my-fleet');
      const earningsRes = await api.get('/owner/earnings');
      if (fleetRes.data.success) setBikes(fleetRes.data.bikes);
      if (earningsRes.data.success) setEarnings(earningsRes.data.data);
    } catch (err) { console.error("Sync error", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setCurrentId(bike._id);
      setFormData({ ...bike });
    } else {
      setEditMode(false);
      setFormData({ name: '', brand: '', price: '', available: true, co2SavedPerKm: 0.15 });
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
    } catch (err) { alert("Action failed."); }
  };

  const deleteBike = async (id) => {
    if (window.confirm("Permanently remove this bike?")) {
      try {
        await api.delete(`/owner/bike/${id}`);
        fetchData();
      } catch (err) { alert("Delete restricted."); }
    }
  };

  const ownerStats = [
    { label: "My Units", val: bikes.length, icon: <Bike />, color: "blue", trend: "Active" },
    { label: "Total Rentals", val: earnings.totalRentals, icon: <TrendingUp />, color: "green", trend: "Lifetime" },
    { label: "My Earnings", val: `Rs. ${earnings.totalEarnings.toLocaleString()}`, icon: <DollarSign />, color: "purple", trend: "Verified" }
  ];

  if (loading) return <div className="owner-loader">Syncing Personal Fleet...</div>;

  return (
    <div className="owner-dashboard-container">
      <header className="owner-header">
        <div className="title-area">
          <h1>Owner Command Center</h1>
          <p>Real-time analytics for your Kathmandu Fleet.</p>
        </div>
        <button className="add-unit-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Register New Bike
        </button>
      </header>

      <div className="owner-stats-row">
        {ownerStats.map((item, i) => (
          <StatCard key={i} item={item} index={i} />
        ))}
      </div>

      <section className="inventory-section">
        <div className="section-title">
          <h2>My Motorcycles</h2>
          <button className="settings-btn-icon"><Settings size={18} /></button>
        </div>

        <div className="inventory-grid">
          {bikes.map((bike) => (
            <motion.div layout key={bike._id} className="bike-management-card">
              <div className="card-top">
                <span className={`status-tag ${bike.available ? 'ready' : 'busy'}`}>
                  {bike.available ? 'Ready to Rent' : 'Out with Client'}
                </span>
              </div>
              <div className="card-body">
                <h3>{bike.name}</h3>
                <p className="brand">{bike.brand}</p>
                <div className="price">Rs. {bike.price}<span>/hr</span></div>
              </div>
              <div className="card-footer">
                <button onClick={() => handleOpenModal(bike)} className="edit-btn"><Edit size={16} /> Edit</button>
                <button onClick={() => deleteBike(bike._id)} className="delete-btn"><Trash2 size={16} /> Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="owner-modal">
              <div className="modal-head">
                <h2>{editMode ? 'Update Vehicle' : 'Register New Vehicle'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="input-box">
                    <label>Bike Model Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="input-box">
                    <label>Rate per Hour (Rs)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="save-btn"><Save size={18}/> Sync Database</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;