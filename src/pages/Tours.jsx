import React, { useState } from 'react';
import { 
  MapPin, Calendar, Clock, Star, 
  ShieldCheck, ArrowRight, 
  Mountain, Users, Coffee, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import "../styles/Tours.css"; 

const Tours = () => {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    groupSize: "1 Person (Solo)" 
  });
  const [submitting, setSubmitting] = useState(false);

  const tourDetails = {
    name: "Upper Mustang Expedition",
    price: 45000,
    duration: "12 Days",
    difficulty: "Challenging",
    nextDate: "April 15, 2026",
    rating: 5,
    reviews: 14,
    description: "Experience the forbidden kingdom of Mustang on two wheels. This tour takes you through deep river gorges, ancient monasteries, and the high-altitude desert landscapes of the Himalayas. Perfect for riders seeking the ultimate adventure.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000" // High-res Adventure Bike
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/tours/inquiry', {
        fullName: formData.fullName,
        groupSize: formData.groupSize,
        tourName: tourDetails.name 
      });
      alert(response.data.message || "Inquiry sent successfully!");
      setFormData({ fullName: "", groupSize: "1 Person (Solo)" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tours-page-root">
      <div className="tours-container">
        
        {/* 🏔️ TOUR HERO SECTION */}
        <section className="tours-hero-grid">
          
          {/* LEFT SIDE: VISUALS */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="tour-visual-side">
            <div className="main-image-wrapper">
              <img src={tourDetails.image} alt={tourDetails.name} className="main-tour-img" />
              <div className="featured-badge">
                <Sparkles size={14} /> FEATURED EXPEDITION
              </div>
            </div>

            <div className="tour-title-block">
              <div className="title-left">
                <h1>{tourDetails.name}</h1>
                <div className="tour-meta-row">
                  <span><Star size={16} fill="#fbbf24" color="#fbbf24"/> {tourDetails.rating}.0 ({tourDetails.reviews} reviews)</span>
                  <span><MapPin size={16}/> Mustang, Nepal</span>
                </div>
              </div>
              <div className="title-right">
                <span className="price-main">₨{tourDetails.price.toLocaleString()}</span>
                <span className="price-sub">per person / all inclusive</span>
              </div>
            </div>

            <p className="tour-description">{tourDetails.description}</p>

            <div className="specs-grid">
              {[
                { icon: Clock, label: "Duration", value: tourDetails.duration },
                { icon: Mountain, label: "Difficulty", value: tourDetails.difficulty },
                { icon: Calendar, label: "Next Batch", value: tourDetails.nextDate }
              ].map((spec, i) => (
                <div key={i} className="spec-card">
                  <spec.icon size={24} className="spec-icon" />
                  <span className="spec-label">{spec.label}</span>
                  <strong className="spec-value">{spec.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE: INQUIRY FORM */}
          <aside className="inquiry-sidebar">
            <div className="inquiry-card">
              <h3>Reserve Your Spot</h3>
              <form className="inquiry-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>FULL NAME</label>
                  <input 
                    type="text" required value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter your name" 
                  />
                </div>
                <div className="form-group">
                  <label>GROUP SIZE</label>
                  <select 
                    value={formData.groupSize}
                    onChange={(e) => setFormData({...formData, groupSize: e.target.value})}
                  >
                    <option>1 Person (Solo)</option>
                    <option>2-4 People (Small Group)</option>
                    <option>5+ People (Private Group)</option>
                  </select>
                </div>
                <div className="deposit-info">
                  <div className="deposit-row">
                    <span>Booking Deposit (15%)</span>
                    <strong>₨6,750</strong>
                  </div>
                  <p>Secure your slot today. Balance due at HQ.</p>
                </div>

                <button type="submit" disabled={submitting} className="btn-confirm-inquiry">
                  {submitting ? "Processing..." : "Confirm Inquiry"} <ArrowRight size={20}/>
                </button>
              </form>
            </div>
          </aside>
        </section>

        {/* 🧭 OTHER PACKAGES */}
        <section className="other-tours-section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Curated Routes</span>
              <h2>Popular Adventure Routes</h2>
            </div>
            <button className="btn-outline-dark">Explore All Tours</button>
          </div>
          
          <div className="horizontal-tour-grid">
            <div className="wide-tour-card">
              <div className="card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1000)' }}></div>
              <div className="card-info">
                <h4>Manang Loop</h4>
                <p>The Marsyangdi valley and high mountain lakes. 8 days of pure riding.</p>
                <div className="card-footer">
                  <span className="card-price">₨32,000</span>
                  <button className="btn-small-dark">View Package</button>
                </div>
              </div>
            </div>

            <div className="wide-tour-card">
              <div className="card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558981420-87aa9dad1c89?q=80&w=1000)' }}></div>
              <div className="card-info">
                <h4>Pokhara Valley</h4>
                <p>Short 3-day getaway with panoramic views of the Annapurna range.</p>
                <div className="card-footer">
                  <span className="card-price">₨12,500</span>
                  <button className="btn-small-dark">View Package</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ TRUST ELEMENTS */}
        <section className="trust-grid">
          {[
            { icon: ShieldCheck, title: "Fully Insured", desc: "Comprehensive rider and bike insurance included." },
            { icon: Users, title: "Expert Guides", desc: "Nepal's most experienced road captains." },
            { icon: Coffee, title: "Premium Lodging", desc: "Handpicked boutique stays for maximum comfort." }
          ].map((trust, i) => (
            <div key={i} className="trust-item">
              <div className="trust-icon-box"><trust.icon size={28}/></div>
              <div className="trust-text">
                <h4>{trust.title}</h4>
                <p>{trust.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Tours;