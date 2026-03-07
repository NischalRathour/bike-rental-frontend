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
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', brand: '', price: '', status: 'Available', co2SavedPerKm: 0.15 });

    const fetchBikes = async () => {
        try {
            const res = await api.get('/bikes'); // Public route to fetch all bikes
            setBikes(res.data);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchBikes(); }, []);

    const handleOpenModal = (bike = null) => {
        if (bike) {
            setEditMode(true);
            setCurrentId(bike._id);
            setFormData({ ...bike });
        } else {
            setEditMode(false);
            setFormData({ name: '', brand: '', price: '', status: 'Available', co2SavedPerKm: 0.15 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/admin/bikes/${currentId}`, formData);
            } else {
                await api.post('/admin/bikes', formData);
            }
            fetchBikes();
            setIsModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || "Sync Error with Kathmandu Database.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanent deletion from inventory?")) {
            try {
                await api.delete(`/admin/bikes/${id}`);
                fetchBikes();
            } catch (err) {
                alert("Restricted: Active bookings linked to unit.");
            }
        }
    };

    if (loading) return <div className="admin-loader">Mapping Fleet Matrix...</div>;

    return (
        <div className="fleet-view-wrapper">
            <header className="fleet-header-row">
                <h1 className="hero-gradient-text">Fleet Management</h1>
                <button className="btn-glass-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} /> Register New Unit
                </button>
            </header>

            <div className="fleet-inventory-grid">
                {bikes.map((bike) => (
                    <motion.div layout key={bike._id} className="fleet-unit-card">
                        <div className="unit-card-header">
                            <span className={`status-pill ${bike.status?.toLowerCase()}`}>{bike.status}</span>
                            <div className="eco-tag-mini"><Leaf size={12}/> {bike.co2SavedPerKm}kg/km</div>
                        </div>
                        <div className="unit-icon"><BikeIcon size={32} /></div>
                        <h3 className="unit-title">{bike.name}</h3>
                        <p className="unit-price">Rs. {bike.price} / Day</p>
                        <div className="action-row">
                            <button onClick={() => handleOpenModal(bike)} className="edit-btn"><Edit size={16}/> Edit</button>
                            <button onClick={() => handleDelete(bike._id)} className="del-btn"><Trash2 size={16}/></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay-blur">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fleet-management-modal">
                            <div className="modal-top">
                                <h2>{editMode ? 'Modify Entity' : 'New Unit Entry'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="close-x"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="fleet-modal-form">
                                <div className="input-group">
                                    <label>Model Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Daily Rate (NPR)</label>
                                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option value="Available">Available</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="In-Use">In-Use</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-confirm-save"><Save size={18} /> Commit to Database</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBikes;