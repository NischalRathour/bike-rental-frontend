import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  MapPin, Calendar, Clock, ArrowRight, X,
  Mountain, Loader2, Star, ShieldCheck, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosConfig';
import "../styles/Tours.css"; 

const Tours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showDetails, setShowDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: "", groupSize: "1 Person (Solo)" });
  const [submitting, setSubmitting] = useState(false);

  // 🛰️ FETCH TOURS FROM BACKEND
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tours'); 
        const data = res.data.tours || res.data;
        setTours(data);
        if (data.length > 0) setSelectedTour(data[0]); 
      } catch (err) {
        console.error("Marketplace connection failed.");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchTours();
  }, []);

  const getMultiplier = (groupSize) => {
    switch (groupSize) {
      case "2-4 People (Private)": return 3;
      case "5+ People (Corporate)": return 8;
      default: return 1;
    }
  };

  const basePrice = selectedTour?.price || 0;
  const multiplier = getMultiplier(formData.groupSize);
  const calculatedTotal = basePrice * multiplier;
  const calculatedDeposit = calculatedTotal * 0.15;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTour) return;
    setSubmitting(true);
    
    try {
      const res = await api.post('/bookings/create-tour-booking', {
        tourId: selectedTour._id,
        totalPrice: calculatedTotal,
        fullName: formData.fullName,
        groupSize: formData.groupSize
      });

      if (res.data.success) {
        navigate(`/payment/${res.data.booking._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Checkout system is temporarily offline.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="premium-loader-container">
      <Loader2 className="animate-spin" size={64} color="#6366f1" />
      <p className="loader-text">Orchestrating Your Expedition...</p>
    </div>
  );

  return (
    <div className="tours-aesthetic-root">
      <div className="premium-container">
        
        {/* --- 🏁 MEGA HEADER --- */}
        <header className="marketplace-header">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge-kicker"><Sparkles size={16}/> Elite Expeditionary Force</span>
            <h1>The <span className="text-gradient">Adventure</span> Ledger</h1>
            <p className="hero-sub-text">Chart your course through the Forbidden Kingdom with Nepal's premier motorcycle collective.</p>
          </motion.div>
        </header>

        {/* --- 🏍️ HERO SHOWCASE --- */}
        <AnimatePresence mode="wait">
          {selectedTour && (
            <section className="hero-showcase-grid">
              <motion.div 
                key={selectedTour._id}
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.02 }}
                className="showcase-visual"
              >
                <div className="visual-wrapper">
                  <img src={selectedTour.image} alt={selectedTour.name} />
                  <div className="price-tag-overlay">
                    <label>Base Tier Investment</label>
                    <strong>₨{selectedTour.price?.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="showcase-content">
                  <div className="content-top">
                    <div className="meta-pill"><MapPin size={18}/> {selectedTour.location}</div>
                    <h2>{selectedTour.name}</h2>
                    <p className="description-big">{selectedTour.description}</p>
                  </div>

                  <div className="specs-horizontal">
                    <div className="s-item"><Clock size={24}/> <div><label>Duration</label><span>{selectedTour.duration}</span></div></div>
                    <div className="s-item"><Mountain size={24}/> <div><label>Intensity</label><span>{selectedTour.difficulty}</span></div></div>
                    <div className="s-item"><Calendar size={24}/> <div><label>Next Launch</label><span>{selectedTour.nextDate}</span></div></div>
                  </div>
                </div>
              </motion.div>

              {/* 💳 RESERVATION SIDEBAR */}
              <aside className="reservation-sidebar">
                <div className="reservation-card">
                  <h3>Secure Your Passage</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="input-field">
                      <label>Primary Guest Name</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.fullName} 
                        onChange={(e)=>setFormData({...formData, fullName: e.target.value})} 
                        placeholder="Johnathan Doe" 
                      />
                    </div>
                    <div className="input-field">
                      <label>Formation Size</label>
                      <select 
                        value={formData.groupSize} 
                        onChange={(e)=>setFormData({...formData, groupSize: e.target.value})}
                      >
                        <option>1 Person (Solo)</option>
                        <option>2-4 People (Private)</option>
                        <option>5+ People (Corporate)</option>
                      </select>
                    </div>

                    <div className="pricing-summary">
                      <div className="p-row">
                        <span>Total Commitment</span> 
                        <span className="total-val">₨{calculatedTotal.toLocaleString()}</span>
                      </div>
                      <div className="p-row highlight-row">
                        <span>Initiation Deposit (15%)</span> 
                        <span className="deposit-val">₨{calculatedDeposit.toLocaleString()}</span>
                      </div>
                    </div>

                    <button type="submit" disabled={submitting} className="btn-premium-action">
                      {submitting ? (
                        <><Loader2 className="animate-spin" size={20} /> Encrypting Transaction...</>
                      ) : (
                        <>Authorize Reservation <ArrowRight size={22}/></>
                      )}
                    </button>
                  </form>
                  <p className="secure-note"><ShieldCheck size={14}/> Secured by Global Fleet Intelligence</p>
                </div>
              </aside>
            </section>
          )}
        </AnimatePresence>

        {/* --- 📂 MARKETPLACE BROWSER --- */}
        <section className="marketplace-grid-section">
          <div className="section-title-bar">
            <h2>Explore <span className="text-gradient">Fleet Packages</span></h2>
          </div>
          
          <div className="tour-cards-flex">
            {tours.map((tour) => (
              <motion.div 
                whileHover={{ y: -15 }}
                key={tour._id} 
                className={`premium-tour-card ${selectedTour?._id === tour._id ? 'active-selection' : ''}`}
                onClick={() => { 
                  setSelectedTour(tour); 
                  window.scrollTo({top: 0, behavior: 'smooth'}); 
                }}
              >
                <div className="card-image-box">
                  <img src={tour.image} alt={tour.name} />
                  <div className="card-hover-overlay">Select Route</div>
                </div>
                <div className="card-details">
                  <h4>{tour.name}</h4>
                  <div className="card-meta-bottom">
                    <span className="card-price-text">₨{tour.price?.toLocaleString()}</span>
                    <button 
                      className="btn-view-quick" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowDetails(tour); 
                      }}
                    >
                      Inspect Specs
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* --- 🔍 MODAL --- */}
      <AnimatePresence>
        {showDetails && (
          <div className="glass-modal-overlay" onClick={() => setShowDetails(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }}
              className="details-modal-box" 
              onClick={(e) => e.stopPropagation()}
            >
              <button className="btn-close-modal" onClick={() => setShowDetails(null)}><X/></button>
              <img src={showDetails.image} className="modal-hero-img" alt="" />
              <div className="modal-inner-padding">
                <span className="m-category">{showDetails.difficulty} Grade Expedition</span>
                <h2>{showDetails.name}</h2>
                <p className="modal-desc">{showDetails.description}</p>
                <div className="m-stats-grid">
                  <div className="m-stat"><strong>Deployment:</strong> {showDetails.nextDate}</div>
                  <div className="m-stat"><strong>Base Hub:</strong> {showDetails.location}</div>
                </div>
                <button 
                  className="btn-modal-primary" 
                  onClick={() => { 
                    setSelectedTour(showDetails); 
                    setShowDetails(null); 
                    window.scrollTo({top: 0, behavior: 'smooth'}); 
                  }}
                >
                  Adopt This Mission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tours;