import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
      /**
       * 🚀 DATA MAPPING:
       * Your Backend Model uses 'fullName', 'tourName', and 'groupSize'.
       * We map the form fields to these keys so the Backend accepts the request.
       */
      const payload = {
        fullName: formData.name,      // Maps 'name' to 'fullName'
        tourName: formData.subject,   // Maps 'subject' to 'tourName'
        groupSize: formData.message,  // Maps 'message' to 'groupSize'
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
        msg: err.response?.data?.message || "Failed to send. Please check your internet or server." 
      });
    }
  };

  return (
    <div className="contact-page-root">
      <div className="contact-container">
        
        <div className="contact-grid">
          
          {/* 📍 LEFT SIDE: INFO CARDS */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="contact-info-side"
          >
            <span className="premium-badge">Contact Us</span>
            <h1 className="contact-title">Visit our <span className="text-indigo">Thamel Hub</span></h1>
            <p className="contact-desc">
              Have questions about a bike or a tour? Our team at the Kathmandu headquarters is ready to assist you.
            </p>
            
            <div className="info-cards-stack">
              <div className="contact-trust-card">
                <div className="icon-box"><MapPin /></div>
                <div className="card-text">
                  <h4>Location</h4>
                  <p>Jp Marg, Thamel, Kathmandu (Opp. Anatolia)</p>
                </div>
              </div>

              <div className="contact-trust-card">
                <div className="icon-box"><Phone /></div>
                <div className="card-text">
                  <h4>Support Lines</h4>
                  <p>+977 9843360610 / 01-4260211</p>
                </div>
              </div>

              <div className="contact-trust-card">
                <div className="icon-box"><Clock /></div>
                <div className="card-text">
                  <h4>Service Hours</h4>
                  <p>Sun - Fri: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ✉️ RIGHT SIDE: FORM */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="contact-form-card"
          >
            <h3>Send a Message</h3>
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
                    placeholder="name@example.com" 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input 
                  type="text" required 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?" 
                />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your inquiry..."
                ></textarea>
              </div>

              {status.msg && (
                <div className={`form-status-alert ${status.type}`}>
                   {status.msg}
                </div>
              )}

              <button type="submit" disabled={status.loading} className="btn-send-message">
                {status.loading ? "Sending..." : "Send Message"} <Send size={18}/>
              </button>
            </form>
            <div className="form-footer-security">
              <ShieldCheck size={14} /> <span>Encrypted Communication</span>
            </div>
          </motion.div>
        </div>

        {/* 🗺️ MAP SECTION - FIXED REAL GOOGLE MAPS EMBED */}
        <div className="map-wrapper" style={{ marginTop: '80px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <iframe 
            title="Ride N Roar Thamel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.128711107572!2d85.3086!3d27.7133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190011000001%3A0x7d02e7a37277874c!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1712000000000!5m2!1sen!2snp"
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* 🏆 SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <div className="modal-overlay-blur">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="success-modal-card"
            >
              <div className="success-icon-circle">
                <CheckCircle2 size={40} color="#10b981" />
              </div>
              <h2>Inquiry Delivered</h2>
              <p>We've received your message. Our team at <strong>Ride N Roar</strong> will contact you shortly.</p>
              <button onClick={() => setShowSuccess(false)} className="btn-modal-close">
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;