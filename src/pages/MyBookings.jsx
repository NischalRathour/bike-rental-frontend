import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { 
  Bike, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowRight, 
  Clock,
  MapPin 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my");
        if (res.data && res.data.success) {
          setBookings(res.data.bookings);
        } else if (Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } catch (error) {
        setError("Unable to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="bookings-loader-wrapper">
      <div className="premium-spinner"></div>
      <p>Synchronizing your Kathmandu rides...</p>
    </div>
  );

  return (
    <div className="my-bookings-page">
      <div className="container-managed">
        
        <header className="bookings-page-header">
          <div className="header-text-group">
            <h1>Activity Ledger</h1>
            <p>Track and manage your premium bike rentals</p>
          </div>
          <Link to="/bikes" className="btn-book-new-float">
            <Bike size={18} /> Rent Another
          </Link>
        </header>

        {error && <div className="error-banner-modern"><AlertCircle size={18}/> {error}</div>}

        <AnimatePresence>
          {bookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bookings-empty-state"
            >
              <div className="empty-icon-circle">
                <Bike size={48} />
              </div>
              <h2>No Bookings Found</h2>
              <p>Your activity ledger is currently empty. Ready for your first Kathmandu adventure?</p>
              <button onClick={() => navigate("/bikes")} className="btn-browse-fleet">
                Browse Available Fleet <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <div className="bookings-history-list">
              {bookings.map((booking) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={booking._id} 
                  className="booking-ledger-card"
                >
                  <div className="ledger-visual">
                    <img 
                      src={booking.bike?.images?.[0] || "/images/default-bike.jpg"} 
                      alt={booking.bike?.name} 
                    />
                    <div className={`status-tag ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="ledger-content">
                    <div className="content-main">
                      <div className="bike-meta">
                        <span className="location-tag"><MapPin size={12}/> Kathmandu Hub</span>
                        <h3>{booking.bike?.name || "Ride N Roar Unit"}</h3>
                      </div>
                      
                      <div className="details-row">
                        <div className="detail-pill">
                          <Calendar size={14} />
                          <span>{new Date(booking.startDate).toLocaleDateString('en-NP')} - {new Date(booking.endDate).toLocaleDateString('en-NP')}</span>
                        </div>
                        <div className="detail-pill">
                          <Clock size={14} />
                          <span>{booking.days || 1} Days Rental</span>
                        </div>
                      </div>
                    </div>

                    <div className="ledger-footer">
                      <div className="financial-group">
                        <div className="price-stack">
                          <label>Total Amount</label>
                          <strong>Rs. {booking.totalPrice}</strong>
                        </div>
                        <div className={`pay-status-pill ${booking.paymentStatus.toLowerCase()}`}>
                          {booking.paymentStatus === 'Paid' ? <CheckCircle2 size={14} /> : <CreditCard size={14} />}
                          {booking.paymentStatus === 'Paid' ? 'Verified' : 'Unpaid'}
                        </div>
                      </div>

                      <div className="action-group">
                        {booking.paymentStatus !== 'Paid' ? (
                          <button 
                            className="btn-pay-action"
                            onClick={() => navigate(`/payment/${booking._id}`)}
                          >
                            Finalize Payment <ArrowRight size={16} />
                          </button>
                        ) : (
                          <Link to="/customer-dashboard" className="btn-view-status">
                            View Dashboard
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBookings;