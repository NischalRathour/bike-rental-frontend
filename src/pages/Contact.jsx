import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Send, Clock, ShieldCheck, CheckCircle2, Sparkles, Globe } from 'lucide-react';
import api from '../api/axiosConfig';
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ loading: false, type: "", msg: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, type: "", msg: "" });
    
    try {
      const payload = {
        fullName: formData.name,
        tourName: formData.subject,
        groupSize: formData.message,
        email: formData.email 
      };

      const res = await api.post('/contact/inquiry', payload);
      
      if (res.data.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setStatus({ loading: false, type: "", msg: "" });
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        type: "error", 
        msg: err.response?.data?.message || "Communication failed. Please check your connection." 
      });
    }
  };

  return (
    <div className="contact-page-root">
      <div className="contact-container">
        
        <div className="contact-grid">
          
          {/* 📍 LEFT SIDE: PREMIUM INFO */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="contact-info-side"
          >
            <span className="premium-badge">
              <Sparkles size={14} style={{ marginRight: '8px' }}/> Global Support
            </span>
            <h1 className="contact-title">Connect with our <span className="text-indigo">Thamel Hub</span></h1>
            <p className="contact-desc">
              Whether you're looking to book a solo expedition or a corporate fleet, our concierge team is standing by to orchestrate your journey.
            </p>
            
            <div className="info-cards-stack">
              <div className="contact-trust-card">
                <div className="icon-box"><MapPin size={24} /></div>
                <div className="card-text">
                  <h4>Headquarters</h4>
                  <p>JP Marg, Thamel, Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="contact-trust-card">
                <div className="icon-box"><Phone size={24} /></div>
                <div className="card-text">
                  <h4>Concierge Lines</h4>
                  <p>+977 9843360610 / 01-4260211</p>
                </div>
              </div>

              <div className="contact-trust-card">
                <div className="icon-box"><Clock size={24} /></div>
                <div className="card-text">
                  <h4>Operational Hours</h4>
                  <p>Sun - Fri: 09:00 — 19:00</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ✉️ RIGHT SIDE: THE FORM */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="contact-form-card"
          >
            <div className="form-header-box">
              <h3>Direct Inquiry</h3>
              <p>Expect a response within 2 business hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-actual-form">
              <div className="form-row-dual">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name" 
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@exclusive.com" 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Inquiry Subject</label>
                <input 
                  type="text" required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we assist your expedition?" 
                />
              </div>

              <div className="input-group">
                <label>Message / Requirements</label>
                <textarea 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your inquiry in detail..."
                ></textarea>
              </div>

              {status.msg && (
                <div className={`form-status-alert ${status.type}`}>
                   {status.msg}
                </div>
              )}

              <button type="submit" disabled={status.loading} className="btn-send-message">
                {status.loading ? "Processing..." : "Dispatch Inquiry"} <Send size={20}/>
              </button>
            </form>

            <div className="form-footer-security">
              <ShieldCheck size={16} /> <span>End-to-End Encrypted Data Protocol</span>
            </div>
          </motion.div>
        </div>

        {/* 🗺️ MAP SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="map-wrapper"
        >
          <iframe 
            title="Ride N Roar Thamel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.128743171124!2d85.3093226754673!3d27.713337476179477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb1ce557d%3A0x5999fca36a666993!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1715000000000!5m2!1sen!2snp"
            width="100%" 
            height="550" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>

      {/* 🏆 SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <div className="modal-overlay-blur" onClick={() => setShowSuccess(false)}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="success-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon-circle">
                <CheckCircle2 size={50} color="#6366f1" />
              </div>
              <h2>Transmission Successful</h2>
              <p>Your inquiry has been logged into our secure servers. A concierge will reach out to <strong>{formData.email}</strong> shortly.</p>
              <button onClick={() => setShowSuccess(false)} className="btn-modal-close">
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;