import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  CheckCircle, 
  XCircle, 
  Bike, 
  User, 
  CreditCard, 
  Search, 
  Filter, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/AdminBookings.css";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/bookings');
            if (res.data.success) {
                setBookings(res.data.bookings);
            }
        } catch (err) {
            console.error("Ledger Sync Error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllBookings(); }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        const actionText = newStatus === 'Confirmed' ? "APPROVE" : "CANCEL";
        if (window.confirm(`${actionText} this booking for the Kathmandu fleet?`)) {
            try {
                // This updates the booking status in your DB
                const res = await api.put(`/admin/bookings/${id}/status`, { status: newStatus });
                if (res.data.success) {
                    fetchAllBookings();
                }
            } catch (err) {
                alert("Operation failed. Ensure backend routes are active.");
            }
        }
    };

    const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

    if (loading) return (
        <div className="admin-loader-container">
            <div className="admin-spinner-pro"></div>
            <p>Syncing Transaction Ledger...</p>
        </div>
    );

    return (
        <div className="admin-bookings-portal">
            <header className="portal-header">
                <div className="title-stack">
                    <h1>Booking Operations</h1>
                    <p>Total Managed Transactions: <strong>{bookings.length}</strong></p>
                </div>
                
                <div className="filter-tab-group">
                    {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
                        <button 
                            key={tab} 
                            className={`tab-btn ${filter === tab ? 'active' : ''}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bookings-table-wrapper">
                <table className="admin-pro-table">
                    <thead>
                        <tr>
                            <th>REFERENCE</th>
                            <th>CLIENT & VEHICLE</th>
                            <th>REVENUE</th>
                            <th>LIFECYCLE</th>
                            <th style={{ textAlign: 'right' }}>DECISION NODE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.map((b) => (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={b._id}
                                >
                                    <td className="ref-code">#{b._id.slice(-6).toUpperCase()}</td>
                                    <td>
                                        <div className="client-info-cell">
                                            <div className="icon-box"><Bike size={16} /></div>
                                            <div className="text-box">
                                                <strong>{b.bike?.name}</strong>
                                                <span>{b.user?.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`pay-status-pill ${b.paymentStatus?.toLowerCase()}`}>
                                            <CreditCard size={12} /> Rs. {b.totalPrice}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${b.status?.toLowerCase()}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="decision-actions">
                                            {b.status === 'Pending' ? (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(b._id, 'Confirmed')} className="btn-approve">
                                                        <CheckCircle size={16} /> Approve
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(b._id, 'Cancelled')} className="btn-cancel">
                                                        <XCircle size={16} /> Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="locked-label">Finalized</span>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;