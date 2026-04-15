import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { 
  CheckCircle, Calendar, MapPin, 
  Clock, LayoutDashboard, Bike, Download, ShieldCheck, Printer, Smartphone, Users
} from "lucide-react";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [details] = useState(() => {
    if (location.state) return location.state;
    const saved = localStorage.getItem("last_expedition");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (details) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [details]);

  if (!details) return (
    <div className="conf-loader">
        <div className="neon-spinner"></div>
        <p>Synchronizing Expedition Ledger...</p>
    </div>
  );

  const qrData = `ID:${details.bookingId}|TYPE:${details.bookingType}`;

  return (
    <div className="confirmation-page-root">
      <div className="conf-container-max">
        <header className="conf-hero no-print">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="success-icon-wrapper">
            <CheckCircle size={80} color="#10b981" />
          </motion.div>
          <h1>Ride <span className="text-indigo">Secured.</span></h1>
          <p>Your {details.bookingType === 'Group' ? 'fleet is' : 'machine is'} prepped for Thamel Hub pickup.</p>
        </header>

        <div className="premium-receipt-card printable-area">
          <div className="print-header">
             <div className="p-brand-section">
                <h2>RIDE N ROAR Nepal</h2>
                <p>Official Pickup Pass</p>
             </div>
             <div className="p-meta-section">
                <div className="p-status-pill">PAID</div>
                <p>Invoice #: {details.bookingId?.slice(-8).toUpperCase()}</p>
             </div>
          </div>

          <div className="receipt-details">
            <div className="receipt-header-main">
              <div className="unit-info">
                <span className="label-tiny">BOOKING TYPE</span>
                <h3>{details.bookingType === 'Group' ? 'Group Expedition' : 'Solo Ride'}</h3>
                <span className="label-ref">Units: {details.bikeName}</span>
              </div>
              <div className="qr-container">
                <QRCodeSVG value={qrData} size={90} level="H" />
              </div>
            </div>

            <div className="receipt-grid">
              <div className="grid-item">
                <Calendar size={20}/>
                <div className="g-content">
                  <label>Pickup Date</label>
                  <strong>{new Date(details.startDate).toLocaleDateString()}</strong>
                </div>
              </div>
              <div className="grid-item">
                <Clock size={20}/>
                <div className="g-content">
                  <label>Return Date</label>
                  <strong>{new Date(details.endDate).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>

            <div className="receipt-footer-new">
              <div className="total-box">
                <span className="label-tiny">TOTAL PAID</span>
                <div className="price-grand">Rs. {details.totalPrice?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="conf-navigation-v2 no-print">
          <Link to="/customer" className="action-btn-secondary">
            <LayoutDashboard size={20}/>
            <span>Dashboard</span>
          </Link>
          <button className="action-btn-primary" onClick={() => window.print()}>
            <Printer size={20}/>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;