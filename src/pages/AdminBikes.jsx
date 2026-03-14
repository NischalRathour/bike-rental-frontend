import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  Plus, Trash2, Edit, X, Save, 
  Bike as BikeIcon, Leaf, Search, 
  Settings2, Activity, Filter, Image as ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminBikes.css";

const AdminBikes = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({ 
        name: '', brand: '', price: '', status: 'Available', co2SavedPerKm: 0.15, type: 'Sport', images: [''] 
    });

    const fetchBikes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/bikes');
            setBikes(res.data);
        } catch (err) { 
            console.error("Fleet Sync Error:", err); 
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
            setFormData({ name: '', brand: '', price: '', status: 'Available', co2SavedPerKm: 0.15, type: 'Sport', images: [''] });
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
            alert(err.response?.data?.message || "Fleet database sync failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("CRITICAL: Decommission this unit from the Kathmandu fleet permanently?")) {
            try {
                await api.delete(`/admin/bikes/${id}`);
                fetchBikes();
            } catch (err) {
                alert("Security Lock: Active rental bindings found for this unit.");
            }
        }
    };

    const filteredBikes = bikes.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return (
        <div className="admin-fleet-loader">
            <div className="pulse-circle"></div>
            <p>Scanning Fleet Telemetry...</p>
        </div>
    );

    return (
        <div className="admin-bikes-portal">
            <div className="portal-container">
                
                {/* 🛰️ FLEET CONTROL HEADER */}
                <header className="fleet-control-header">
                    <div className="title-stack">
                        <h1>Fleet Command</h1>
                        <div className="fleet-stats-row">
                            <span className="pill-stat"><Activity size={12}/> {bikes.length} Total Units</span>
                            <span className="pill-stat"><Settings2 size={12}/> {bikes.filter(b => b.status === 'Maintenance').length} Under Repair</span>
                        </div>
                    </div>

                    <div className="header-actions-pro">
                        <div className="search-glass-pro">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Locate unit by model..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-add-unit" onClick={() => handleOpenModal()}>
                            <Plus size={20} /> Add New Unit
                        </button>
                    </div>
                </header>

                {/* 📋 INVENTORY TABLE */}
                <div className="inventory-table-wrapper">
                    <table className="inventory-pro-table">
                        <thead>
                            <tr>
                                <th>UNIT DETAILS</th>
                                <th>SPECIFICATIONS</th>
                                <th>DAILY RATE</th>
                                <th>STATUS</th>
                                <th style={{textAlign: 'right'}}>MANAGEMENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredBikes.map((bike) => (
                                    <motion.tr 
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={bike._id}
                                    >
                                        <td>
                                            <div className="unit-profile-cell">
                                                <div className="unit-img-thumb">
                                                    <img src={bike.images?.[0] || "/images/default-bike.jpg"} alt="" />
                                                </div>
                                                <div className="unit-meta">
                                                    <strong>{bike.name}</strong>
                                                    <span>{bike.brand || 'Premium Unit'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="spec-row">
                                                <span className="spec-tag">{bike.type || 'Sport'}</span>
                                                <span className="eco-label"><Leaf size={10}/> {bike.co2SavedPerKm}kg/km</span>
                                            </div>
                                        </td>
                                        <td><strong>Rs. {bike.price}</strong></td>
                                        <td>
                                            <span className={`status-pill-pro ${bike.status?.toLowerCase()}`}>
                                                {bike.status}
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <div className="admin-action-flex">
                                                <button onClick={() => handleOpenModal(bike)} className="btn-edit-pro"><Edit size={16}/></button>
                                                <button onClick={() => handleDelete(bike._id)} className="btn-del-pro"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🛠️ MANAGEMENT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-backdrop-glass">
                        <motion.div 
                            initial={{ opacity: 0, y: 30, scale: 0.98 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.98 }} 
                            className="fleet-mgmt-card"
                        >
                            <div className="mgmt-card-header">
                                <h2>{editMode ? 'Edit Fleet Unit' : 'Register New Unit'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="btn-close-modal"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="mgmt-pro-form">
                                <div className="form-grid-pro">
                                    <div className="input-group-pro">
                                        <label>Model Name</label>
                                        <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="input-group-pro">
                                        <label>Daily Rate (NPR)</label>
                                        <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                    <div className="input-group-pro">
                                        <label>Category</label>
                                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                            <option value="Sport">Sport</option>
                                            <option value="Cruiser">Cruiser</option>
                                            <option value="Mountain">Mountain</option>
                                            <option value="Commuter">Commuter</option>
                                        </select>
                                    </div>
                                    <div className="input-group-pro">
                                        <label>Fleet Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                            <option value="Available">Available</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Rented">In-Use</option>
                                        </select>
                                    </div>
                                    <div className="input-group-pro full-width">
                                        <label><ImageIcon size={14}/> Image Path</label>
                                        <input 
                                            type="text" 
                                            placeholder="/images/bike.jpg"
                                            value={formData.images[0]} 
                                            onChange={(e) => setFormData({...formData, images: [e.target.value]})} 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-save-fleet-pro">
                                    <Save size={18} /> Update Fleet Records
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBikes;