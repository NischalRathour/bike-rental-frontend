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
        setError("We couldn't load your bookings. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return (
    <div className="bookings-loader-wrapper">
      <div className="premium-spinner"></div>
      <p>Updating your bookings...</p>
    </div>
  );

  return (
    <div className="my-bookings-page">
      <div className="container-managed">
        
        <header className="bookings-page-header">
          <div className="header-text-group">
            <h1>My <span className="text-indigo">Bookings</span></h1>
            <p>View and manage your recent rental history</p>
          </div>
          <Link to="/bikes" className="btn-book-new-float">
            <Bike size={18} /> Rent a Bike
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
              <h2>No Bookings Yet</h2>
              <p>Your booking list is currently empty. Ready to hit the road?</p>
              <button onClick={() => navigate("/bikes")} className="btn-browse-fleet">
                Explore Available Bikes <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <div className="bookings-history-list">
              {bookings.map((booking) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={booking._id} 
                  className="booking-ledger-card"
                >
                  {/* Card Visual Side */}
                  <div className="ledger-visual">
                    <img 
                      src={booking.bike?.images?.[0] || booking.bikeImage || "https://via.placeholder.com/300x200"} 
                      alt={booking.bike?.name} 
                    />
                    <div className={`status-tag ${booking.status?.toLowerCase()}`}>
                      {booking.status || 'Active'}
                    </div>
                  </div>

                  {/* Card Content Side */}
                  <div className="ledger-content">
                    <div className="content-main">
                      <div className="bike-meta">
                        <span className="location-tag"><MapPin size={12}/> Kathmandu</span>
                        <h3>{booking.bike?.name || booking.bikeName || "Premium Bike"}</h3>
                      </div>
                      
                      <div className="details-row">
                        <div className="detail-pill">
                          <Calendar size={14} />
                          <span>
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-pill">
                          <Clock size={14} />
                          <span>Rental Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="ledger-footer">
                      <div className="financial-group">
                        <div className="price-stack">
                          <label>Total Paid</label>
                          <strong>Rs. {booking.totalPrice?.toLocaleString()}</strong>
                        </div>
                        <div className={`pay-status-pill ${booking.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'unpaid'}`}>
                          {booking.paymentStatus?.toLowerCase() === 'paid' ? (
                            <><CheckCircle2 size={14} /> Verified</>
                          ) : (
                            <><CreditCard size={14} /> Payment Required</>
                          )}
                        </div>
                      </div>

                      <div className="action-group">
                        {booking.paymentStatus?.toLowerCase() !== 'paid' ? (
                          <button 
                            className="btn-pay-action"
                            onClick={() => navigate(`/payment/${booking._id}`)}
                          >
                            Pay Now <ArrowRight size={16} />
                          </button>
                        ) : (
                          <Link to="/customer" className="btn-view-status">
                            Go to Dashboard
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