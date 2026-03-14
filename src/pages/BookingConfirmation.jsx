import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  CheckCircle, 
  Calendar, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  LayoutDashboard, 
  Bike 
} from "lucide-react";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bikeName, bikeImage, startDate, endDate, totalPrice, bookingId } = location.state || {};

  useEffect(() => {
    if (bikeName) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#ffffff"]
      });
    }
  }, [bikeName]);

  if (!bikeName) {
    return (
      <div className="conf-error-wrapper">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="conf-error-card">
          <h2>Session Expired</h2>
          <p>We couldn't retrieve your booking details. Please check your dashboard.</p>
          <button className="btn-return-home" onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="conf-container">
        
        {/* 🎉 SUCCESS HEADER */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="conf-header"
        >
          <div className="success-icon-wrapper">
            <CheckCircle size={60} className="icon-main" />
            <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1.5, opacity: 0 }} 
               transition={{ duration: 1, repeat: Infinity }}
               className="icon-pulse"
            ></motion.div>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your ride is reserved and ready for the streets of Kathmandu.</p>
        </motion.div>

        {/* 🏍️ PREMIUM RESERVATION CARD */}
        <div className="reservation-summary">
          <div className="res-visual">
            <img src={bikeImage || "/images/default-bike.jpg"} alt={bikeName} className="res-bike-img" />
            <div className="res-badge">RESERVED</div>
          </div>

          <div className="res-details">
            <div className="res-id-row">
              <span className="res-label">BOOKING ID</span>
              <span className="res-id">#{bookingId?.slice(-6).toUpperCase() || "BKR-882"}</span>
            </div>
            
            <h2 className="res-bike-name">{bikeName}</h2>
            
            <div className="res-meta-grid">
              <div className="res-meta-item">
                <Calendar size={18} className="m-icon" />
                <div>
                  <label>Pickup Date</label>
                  <strong>{new Date(startDate).toLocaleDateString('en-NP', { day: 'numeric', month: 'long' })}</strong>
                </div>
              </div>
              <div className="res-meta-item">
                <Clock size={18} className="m-icon" />
                <div>
                  <label>Return Date</label>
                  <strong>{new Date(endDate).toLocaleDateString('en-NP', { day: 'numeric', month: 'long' })}</strong>
                </div>
              </div>
            </div>

            <div className="res-price-footer">
              <div className="total-stack">
                <label>Total Amount Paid</label>
                <div className="total-val">Rs. {totalPrice}</div>
              </div>
              <div className="res-loc">
                <MapPin size={14} /> Kathmandu Hub
              </div>
            </div>
          </div>
        </div>

        {/* 🛠️ NAVIGATION ACTIONS */}
        <div className="conf-actions">
          <Link to="/customer-dashboard" className="btn-conf-secondary">
            <LayoutDashboard size={18} /> View My Dashboard
          </Link>
          <Link to="/bikes" className="btn-conf-primary">
            <Bike size={18} /> Rent Another Ride
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;