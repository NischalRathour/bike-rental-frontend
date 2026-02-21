import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Edit, X, Save, Bike as BikeIcon, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminBikes.css";

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBikeId, setCurrentBikeId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', available: true, co2SavedPerKm: 0.15 
  });

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bikes');
      setBikes(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBikes(); }, []);

  const handleOpenModal = (bike = null) => {
    if (bike) {
      setEditMode(true);
      setCurrentBikeId(bike._id);
      setFormData({
        name: bike.name,
        brand: bike.brand || '',
        price: bike.price,
        available: bike.available,
        co2SavedPerKm: bike.co2SavedPerKm || 0.15
      });
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
        // Correct URL: /api/admin/bikes/:id
        await api.put(`/admin/bikes/${currentBikeId}`, formData);
      } else {
        // Correct URL: /api/admin/bikes
        await api.post('/admin/bikes', formData);
      }
      fetchBikes();
      setIsModalOpen(false);
    } catch (err) {
      alert("Operational Error on Server.");
      console.error(err.response);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove vehicle from inventory?")) {
      try {
        await api.delete(`/admin/bikes/${id}`);
        setBikes(bikes.filter(b => b._id !== id));
      } catch (err) { alert("Action restricted."); }
    }
  };

  if (loading) return <div className="spinner">Syncing...</div>;

  return (
    <div className="fleet-view-wrapper">
      <div className="fleet-header-row">
        <div>
          <h1 className="fleet-main-title">Fleet Command</h1>
          <p className="fleet-subtitle">Operational status of {bikes.length} units.</p>
        </div>
        <button className="btn-add-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Register New Unit
        </button>
      </div>

      <div className="fleet-inventory-grid">
        {bikes.map((bike) => (
          <motion.div layout key={bike._id} className="fleet-unit-card">
            <div className="unit-card-header">
              <span className={`status-badge-mini ${bike.available ? 'online' : 'offline'}`}>
                {bike.available ? 'Ready' : 'In-Use'}
              </span>
              <div className="eco-tag-mini"><Leaf size={12}/> {bike.co2SavedPerKm}kg/km</div>
            </div>
            <div className="unit-card-body">
              <div className="unit-icon-circle"><BikeIcon size={28} /></div>
              <h3 className="unit-name">{bike.name}</h3>
              <p className="unit-brand">{bike.brand}</p>
              <div className="unit-price">Rs. {bike.price}<span>/hr</span></div>
            </div>
            <div className="unit-card-actions">
              <button className="btn-action-edit" onClick={() => handleOpenModal(bike)}><Edit size={16} /> Manage</button>
              <button className="btn-action-delete" onClick={() => handleDelete(bike._id)}><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fleet-management-modal">
              <div className="modal-top">
                <h2>{editMode ? 'Modify Unit' : 'Add Unit'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="fleet-modal-form">
                <div className="form-grid-layout">
                  <div className="field-group">
                    <label>Bike Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>Brand</label>
                    <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>Price (Rs/hr)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>CO2 saved/km</label>
                    <input type="number" step="0.01" value={formData.co2SavedPerKm} onChange={(e) => setFormData({...formData, co2SavedPerKm: e.target.value})} />
                  </div>
                </div>
                <div className="modal-actions-footer">
                  <button type="submit" className="btn-confirm-save"><Save size={18} /> Sync Database</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBikes;