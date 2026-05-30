import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosConfig"; // 🚀 Added API configuration access
import { 
  MapPin, Calendar, Star, Bike, Search, Heart, 
  ShieldCheck, Leaf, ArrowRight, ChevronRight, Loader2 
} from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [bikes, setBikes] = useState([]); // 📡 Dynamic backend state matrix
  const [loading, setLoading] = useState(true);

  // 📡 FETCH LIVE FLEET LEDGER FROM DATABASE ON COMPONENT MOUNT
  useEffect(() => {
    const fetchLiveFleet = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bikes");
        // Accommodate variations in response object payload parsing
        const fleetData = res.data.bikes || res.data;
        setBikes(fleetData || []);
      } catch (err) {
        console.error("Critical Landing Page Sync Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveFleet();
  }, []);

  // Filter backend items dynamically by mapping schemas instead of hardcoded strings
  const filteredBikes = activeCategory === "All" 
    ? bikes.slice(0, 4) // Limit landing showcase view to the top 4 active assets
    : bikes.filter(bike => bike.type?.toLowerCase() === activeCategory.toLowerCase()).slice(0, 4);

  return (
    <div className="marketplace-wrapper">
      
      {/* 🚀 PRO HERO SECTION */}
      <section className="hero-pro">
        <div className="hero-visual">
          <img src="/images/moving-bike.jpg" alt="Ride Nepal" className="hero-img-pro" />
          <div className="hero-overlay-pro"></div>
        </div>
        
        <div className="hero-content-pro">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="search-console-pro">
            <h1>Rent bikes from Nepal's <br /><span>largest rental platform</span></h1>
            
            <div className="main-search-bar">
              <div className="search-input-group">
                <MapPin size={18} className="s-icon" />
                <input type="text" placeholder="Where do you want to go?" />
              </div>
              <div className="s-divider"></div>
              <div className="search-input-group">
                <Calendar size={18} className="s-icon" />
                <input type="text" placeholder="Select dates" onFocus={(e) => e.target.type = 'date'} />
              </div>
              <button className="search-btn-pro" onClick={() => navigate('/bikes')}>Search</button>
            </div>

            <div className="hero-popular-tags">
              <span>Frequently searched:</span>
              {['Mountain', 'Electric', 'Road', 'City'].map(tag => (
                <button key={tag} onClick={() => setActiveCategory(tag)} className="tag-link">{tag}</button>
              ))}
              {activeCategory !== "All" && (
                <button onClick={() => setActiveCategory("All")} className="tag-link" style={{ color: '#6366f1' }}>Clear Filter</button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🏍️ MANAGED DYNAMIC LISTINGS SECTION */}
      <section className="listings-section">
        <div className="section-container">
          <div className="section-header-pro">
            <div>
              <h2>Frequently Booked</h2>
              <p>Discover the most loved rides in the valley.</p>
            </div>
            <Link to="/bikes" className="view-all-pro">View all fleet <ChevronRight size={16} /></Link>
          </div>

          {loading ? (
            /* 🌀 Premium Loading state during active API fetch handshake */
            <div className="flex-center-spinner" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <Loader2 className="animate-spin text-indigo" size={40} style={{ color: '#6366f1', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <motion.div layout className="listings-grid-pro">
              <AnimatePresence mode='popLayout'>
                {filteredBikes.length === 0 ? (
                  <div className="no-fleet-fallback" style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#64748b' }}>
                    <Bike size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p>No active assets found listed under the "{activeCategory}" category portal.</p>
                  </div>
                ) : (
                  filteredBikes.map((bike) => (
                    <motion.div 
                      layout
                      key={bike._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bike-card-pro"
                      onClick={() => navigate(`/booking/${bike._id}?mode=solo`, { state: { initialBike: bike } })}
                      style={{ cursor: 'pointer' }} // Enforces card interactivity feedback
                    >
                      <div className="bike-card-img-box">
                        {/* 🖼️ DYNAMIC IMAGE OVERLAY MATRIX: Resolves single properties or database array buffers */}
                        <img src={bike.images?.[0] || bike.image || "/images/default-bike.jpg"} alt={bike.name} />
                        <div className="bike-card-tag">{bike.type || "Premium"}</div>
                        <button className="bike-card-wish" onClick={(e) => { e.stopPropagation(); /* Prevents route handling execution conflict */ }}><Heart size={16} /></button>
                      </div>
                      
                      <div className="bike-card-body">
                        <div className="bike-card-meta">
                          <strong>{bike.brand || "Verified"}</strong>
                          <span>{bike.loc || "Kathmandu"}</span>
                        </div>
                        <h3>{bike.name}</h3>
                        <p className="bike-card-spec">Size: {bike.size || "Uni"} • {bike.cc ? `${bike.cc}cc` : '2026 Model'}</p>
                        
                        <div className="bike-card-footer">
                          <div className="bike-card-price">
                            <strong>Rs. {bike.price}</strong><span>/day</span>
                          </div>
                          <div className="bike-card-rating">
                            <Star size={12} fill="#000" /> {bike.rating || "5.00"} <span>({bike.count || bike.reviews?.length || "12"})</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* 🛡️ TRUST & SUSTAINABILITY BAR */}
      <section className="trust-bar-pro" style={{ marginBottom: '100px' }}>
        <div className="trust-item-pro">
          <ShieldCheck size={24} />
          <div>
            <h4>Professional Insurance</h4>
            <p>Better coverage for every journey.</p>
          </div>
        </div>
        <div className="trust-item-pro">
          <Leaf size={24} />
          <div>
            <h4>Eco-Logic Tracking</h4>
            <p>100% Carbon-neutral rental platform.</p>
          </div>
        </div>
      </section>
      
    </div>
  );
}