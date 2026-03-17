import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';
import "../styles/HireRates.css";

const Contact = () => {
  return (
    <div className="hire-page-root">
      <div className="main-content-container" style={{paddingTop: '120px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px'}}>
          
          {/* 📍 LEFT SIDE: INFO */}
          <div>
            <span className="sub-tag">Get in Touch</span>
            <h1 style={{fontSize: '3rem', fontWeight: '900', marginBottom: '30px'}}>Visit Our <span style={{color: '#6366f1'}}>Thamel Hub</span></h1>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
              <div className="trust-card" style={{padding: '20px'}}>
                <MapPin color="#6366f1" />
                <div>
                  <h4 style={{margin: 0}}>Location</h4>
                  <p style={{margin: 0}}>Jp Marg, Thamel, Kathmandu (Opposite Anatolia Restaurant)</p>
                </div>
              </div>
              <div className="trust-card" style={{padding: '20px'}}>
                <Phone color="#6366f1" />
                <div>
                  <h4 style={{margin: 0}}>Call Us</h4>
                  <p style={{margin: 0}}>+977 9843360610 / +977 014260211</p>
                </div>
              </div>
              <div className="trust-card" style={{padding: '20px'}}>
                <Clock color="#6366f1" />
                <div>
                  <h4 style={{margin: 0}}>Working Hours</h4>
                  <p style={{margin: 0}}>Sun - Fri: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* ✉️ RIGHT SIDE: FORM */}
          <motion.div 
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}}
            style={{background: 'white', padding: '50px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)'}}
          >
            <h3 style={{marginBottom: '30px', fontSize: '1.8rem'}}>Send an Inquiry</h3>
            <form style={{display: 'grid', gap: '20px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <input type="text" placeholder="Full Name" style={inputStyle} />
                <input type="email" placeholder="Email Address" style={inputStyle} />
              </div>
              <input type="text" placeholder="Subject (e.g., Upper Mustang Tour)" style={inputStyle} />
              <textarea placeholder="Your Message" style={{...inputStyle, height: '150px', resize: 'none'}}></textarea>
              <button className="btn-inquiry-main" style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <Send size={18}/> Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* 🗺️ MAP PLACEHOLDER */}
        <div style={{marginTop: '80px', height: '400px', background: '#e2e8f0', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'}}>
          <p>Interactive Google Maps Embed: Kathmandu, Thamel</p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  outline: 'none',
  fontSize: '1rem'
};

export default Contact;