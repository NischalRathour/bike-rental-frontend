import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import { 
  CheckCircle, Calendar, MapPin, 
  Clock, LayoutDashboard, Bike, ShieldCheck, Printer, 
  Sparkles, Hash, CreditCard, ChevronRight, ArrowLeft
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
      const end = Date.now() + 3 * 1000;
      const colors = ["#4F46E5", "#065F46", "#818CF8"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
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
        
        {/* 🏆 HEADER SECTION */}
        <header className="conf-header no-print">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="breadcrumb-premium"
          >
            <Sparkles size={14} /> <span>PREMIUM RESERVATION SECURED</span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Expedition <span className="text-gradient">Validated.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Your credentials have been authenticated. Your machine is being prepped to elite standards at our Thamel Hub.
          </motion.p>
        </header>

        {/* 💳 THE ELITE PASS CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: "circOut" }}
          className="premium-pass-card printable-area"
        >
          {/* Decorative Pass Edge */}
          <div className="ticket-cutout-top"></div>
          <div className="ticket-cutout-bottom"></div>

          <div className="pass-sidebar">
            <div className="sidebar-top">
              <div className="pass-type-badge">{details.bookingType} PASS</div>
              <div className="vertical-id">REF: {details.bookingId?.slice(-6).toUpperCase()}</div>
            </div>
            
            <div className="pass-bike-art">
              <Bike size={180} strokeWidth={0.5} />
            </div>
            
            <div className="sidebar-bottom">
              <ShieldCheck size={24} className="shield-icon" />
              <div className="auth-text">
                <strong>AUTHENTICATED</strong>
                <span>BY RIDE N ROAR INTEL</span>
              </div>
            </div>
          </div>

          <div className="receipt-content">
            <div className="content-inner">
              <div className="receipt-header">
                 <div className="brand-box">
                    <h2>RIDE N ROAR</h2>
                    <p className="location-tagline"><MapPin size={12} /> KATHMANDU HQ • THAMEL</p>
                 </div>
                 <div className="qr-container">
                    <QRCodeSVG value={qrData} size={90} level="H" includeMargin={false} className="qr-code" />
                    <span className="qr-subtext">GATE ACCESS QR</span>
                 </div>
              </div>

              <div className="meta-row">
                 <div className="meta-pill">
                    <Hash size={12} /> {details.bookingId}
                 </div>
                 <div className="meta-pill">
                    <CreditCard size={12} /> STRIPE_ENCRYPTED
                 </div>
              </div>

              <div className="main-specs-grid">
                  <div className="spec-group">
                    <label>Assigned Machine</label>
                    <div className="spec-value-large">{details.bikeName}</div>
                    <div className="machine-status"><div className="dot"></div> READY FOR DEPLOYMENT</div>
                  </div>

                  <div className="schedule-grid">
                    <div className="schedule-item">
                      <label>Deployment</label>
                      <div className="date-val">{new Date(details.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="time-val">09:00 AM • HUB PICKUP</div>
                    </div>
                    <div className="schedule-divider">
                      <ChevronRight size={20} />
                    </div>
                    <div className="schedule-item">
                      <label>Extraction</label>
                      <div className="date-val">{new Date(details.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="time-val">06:00 PM • HUB RETURN</div>
                    </div>
                  </div>
              </div>

              <div className="receipt-footer-premium">
                 <div className="investment-box">
                    <label>TOTAL INVESTMENT</label>
                    <div className="price-display">
                      <span className="currency">NPR</span>
                      <span className="amount">{details.totalPrice?.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="stamp-box">
                    <div className="official-stamp">APPROVED</div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🛠️ NAVIGATION ACTIONS */}
        <div className="conf-actions no-print">
          <Link to="/customer" className="btn-secondary-premium">
            <LayoutDashboard size={18} />
            <span>Member Dashboard</span>
          </Link>
          <button onClick={() => window.print()} className="btn-primary-premium">
            <Printer size={18} />
            <span>Print Official Invoice</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;