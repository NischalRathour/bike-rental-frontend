import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { 
  CheckCircle, Calendar, MapPin, 
  Clock, LayoutDashboard, Bike, Download, ShieldCheck, Printer, Smartphone, ChevronRight
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
      // Premium Multi-burst Confetti
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

  const qrData = `BOOKING_ID:${details.bookingId}|UNIT:${details.bikeName}|STATUS:PAID`;

  return (
    <div className="confirmation-page-root">
      <div className="conf-container-max">
        
        {/* --- 🖥️ SCREEN HERO (HIDDEN ON PRINT) --- */}
        <header className="conf-hero no-print">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            className="success-icon-wrapper"
          >
            <CheckCircle size={80} color="#10b981" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            Ride <span className="text-indigo">Secured.</span>
          </motion.h1>
          <p>Your premium machine is prepped and awaiting your arrival at Thamel Hub.</p>
        </header>

        {/* --- 📄 THE PRINTABLE INVOICE CARD --- */}
        <div className="premium-receipt-card printable-area">
          
          {/* 🖨️ BUSINESS HEADER (PRINT ONLY) */}
          <div className="print-header">
             <div className="p-brand-section">
                <h2>RIDE N ROAR <span>KTM</span></h2>
                <p>Official Rental Invoice & Pickup Pass</p>
                <p className="p-small">Thamel-26, Kathmandu | +977-9843360610</p>
             </div>
             <div className="p-meta-section">
                <div className="p-status-pill">FULLY PAID</div>
                <p>Invoice #: {details.bookingId?.slice(-8).toUpperCase()}</p>
                <p>Issued: {new Date().toLocaleDateString()}</p>
             </div>
          </div>

          {/* SIDEBAR VISUAL (HIDDEN ON PRINT) */}
          <div className="receipt-visual no-print">
            <img src={details.bikeImage || "/default-bike.jpg"} alt={details.bikeName} />
            <div className="glass-overlay">
                <div className="badge-confirmed">CONFIRMED</div>
            </div>
          </div>

          <div className="receipt-details">
            <div className="receipt-header-main">
              <div className="unit-info">
                <span className="label-tiny">ASSIGNED UNIT</span>
                <h3>{details.bikeName}</h3>
                <span className="label-ref">Ref: #{details.bookingId?.slice(-12)}</span>
              </div>
              <div className="qr-container">
                <QRCodeSVG value={qrData} size={90} level="H" includeMargin={true} />
                <span className="qr-subtext">Pickup QR Pass</span>
              </div>
            </div>

            <div className="receipt-grid">
              <div className="grid-item">
                <div className="icon-box"><Calendar size={20}/></div>
                <div className="g-content">
                  <label>Pickup Date</label>
                  <strong>{new Date(details.startDate).toLocaleDateString('en-NP', {day: 'numeric', month: 'long', year: 'numeric'})}</strong>
                </div>
              </div>
              <div className="grid-item">
                <div className="icon-box"><Clock size={20}/></div>
                <div className="g-content">
                  <label>Return Date</label>
                  <strong>{new Date(details.endDate).toLocaleDateString('en-NP', {day: 'numeric', month: 'long', year: 'numeric'})}</strong>
                </div>
              </div>
              <div className="grid-item">
                <div className="icon-box"><MapPin size={20}/></div>
                <div className="g-content">
                  <label>Pickup Hub</label>
                  <strong>Thamel Base Station, Kathmandu</strong>
                </div>
              </div>
              <div className="grid-item">
                <div className="icon-box"><ShieldCheck size={20}/></div>
                <div className="g-content">
                  <label>Protection Status</label>
                  <strong className="text-success">Verified & Fully Insured</strong>
                </div>
              </div>
            </div>

            <div className="receipt-footer-new">
              <div className="total-box">
                <span className="label-tiny">TOTAL TRANSACTION</span>
                <div className="price-grand">Rs. {details.totalPrice?.toLocaleString()}</div>
              </div>
              <div className="instruction-card no-print">
                 <Smartphone size={20} className="text-indigo" />
                 <p>Show this digital pass to the hub manager for express checkout.</p>
              </div>
            </div>

            {/* LEGAL TERMS (PRINT ONLY) */}
            <div className="print-footer-legal">
               <p><strong>Security Deposit:</strong> A valid original ID and refundable security amount are required at pickup. </p>
               <p><strong>Cancellation:</strong> 24h notice required for 80% refund. No-show results in forfeit.</p>
               <div className="auth-sign-box">Authorized Hub Signature</div>
            </div>
          </div>
        </div>

        {/* --- 🧭 NAVIGATION ACTION ROW (HIDDEN ON PRINT) --- */}
        <div className="conf-navigation-v2 no-print">
          <Link to="/customer" className="action-btn-secondary">
            <LayoutDashboard size={20}/>
            <span>Back to Dashboard</span>
          </Link>
          <button className="action-btn-primary" onClick={() => window.print()}>
            <Printer size={20}/>
            <span>Download PDF Invoice</span>
            <Download size={16} className="dl-icon" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;