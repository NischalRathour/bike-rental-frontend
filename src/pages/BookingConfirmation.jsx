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
  Bike,
  Download,
  ShieldCheck
} from "lucide-react";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from the Payment page
  const { bikeName, bikeImage, startDate, endDate, totalPrice, bookingId } = location.state || {};

  useEffect(() => {
    // Trigger celebration if booking is successful
    if (bikeName) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [bikeName]);

  // Handle case where user navigates directly to this URL without state
  if (!bikeName) {
    return (
      <div className="conf-error-wrapper">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="conf-error-card"
        >
          <div className="error-icon">⚠️</div>
          <h2>Booking Details Missing</h2>
          <p>We couldn't find your recent booking info. This happens if you refresh the confirmation page.</p>
          <div className="error-actions">
            <button className="btn-return-home" onClick={() => navigate("/")}>
              <ArrowLeft size={18} /> Back to Home
            </button>
            <button className="btn-to-dash" onClick={() => navigate("/customer")}>
              <LayoutDashboard size={18} /> Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="confirmation-page-root">
      <div className="conf-container-max">
        
        {/* 🎉 HERO SUCCESS SECTION */}
        <header className="conf-hero">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="success-badge-large"
          >
            <CheckCircle size={80} className="check-icon-main" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ride Reserved!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Payment successful. Your adventure in Kathmandu starts soon.
          </motion.p>
        </header>

        {/* 🏍️ THE INVOICE/SUMMARY CARD */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="premium-receipt-card"
        >
          <div className="receipt-visual">
            <img src={bikeImage || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"} alt={bikeName} />
            <div className="receipt-overlay">
              <span className="status-pill">CONFIRMED</span>
            </div>
          </div>

          <div className="receipt-data">
            <div className="receipt-header">
              <div>
                <span className="label-text">VEHICLE</span>
                <h3>{bikeName}</h3>
              </div>
              <div className="receipt-id">
                <span className="label-text">BOOKING REF</span>
                <strong>#{bookingId?.slice(-6).toUpperCase() || "BKR-000"}</strong>
              </div>
            </div>

            <div className="receipt-grid">
              <div className="grid-item">
                <Calendar size={18} className="grid-icon" />
                <div className="grid-text">
                  <label>Pickup Date</label>
                  <strong>{new Date(startDate).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
              </div>
              <div className="grid-item">
                <Clock size={18} className="grid-icon" />
                <div className="grid-text">
                  <label>Return Date</label>
                  <strong>{new Date(endDate).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
              </div>
              <div className="grid-item">
                <MapPin size={18} className="grid-icon" />
                <div className="grid-text">
                  <label>Location</label>
                  <strong>Thamel Hub, Kathmandu</strong>
                </div>
              </div>
              <div className="grid-item">
                <ShieldCheck size={18} className="grid-icon" />
                <div className="grid-text">
                  <label>Status</label>
                  <strong className="text-success">Paid & Secured</strong>
                </div>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="price-total">
                <label>Total Paid</label>
                <div className="amount">Rs. {totalPrice?.toLocaleString()}</div>
              </div>
              <button className="btn-download" onClick={() => window.print()}>
                <Download size={16} /> Save Receipt
              </button>
            </div>
          </div>
        </motion.div>

        {/* 🧭 POST-BOOKING ACTIONS */}
        <div className="conf-navigation">
          <Link to="/customer" className="action-card-link">
            <LayoutDashboard size={24} />
            <div>
              <strong>Go to Dashboard</strong>
              <span>Manage your active rentals</span>
            </div>
          </Link>
          <Link to="/bikes" className="action-card-link primary">
            <Bike size={24} />
            <div>
              <strong>Rent Another Bike</strong>
              <span>Explore our premium fleet</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;