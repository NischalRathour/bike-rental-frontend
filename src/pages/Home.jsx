import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Star, Bike, Search, Heart, ShieldCheck, Leaf, ArrowRight, ChevronRight } from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredBikes = [
    { id: 1, brand: "Scott", model: "Ransom eRide 920", type: "Mountain", size: "L", price: "800", rating: "4.85", count: "34", img: "/images/mountain.jpg", loc: "Kathmandu" },
    { id: 2, brand: "Canyon", model: "Grail CF SL 7", type: "Road", size: "M", price: "1200", rating: "5.00", count: "12", img: "/images/electric.jpg", loc: "Pokhara" },
    { id: 3, brand: "Muli Cycles", model: "Motor ST", type: "Electric", size: "Uni", price: "1500", rating: "4.95", count: "9", img: "/images/scooter.jpg", loc: "Lalitpur" },
    { id: 4, brand: "Dames Fiets", model: "Classic City", type: "City", size: "Uni", price: "600", rating: "5.00", count: "31", img: "/images/moving-bike.jpg", loc: "Bhaktapur" }
  ];

  const filteredBikes = activeCategory === "All" 
    ? featuredBikes 
    : featuredBikes.filter(bike => bike.type === activeCategory);

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
              <button className="search-btn-pro">Search</button>
            </div>

            <div className="hero-popular-tags">
              <span>Frequently searched:</span>
              {['Mountain', 'Electric', 'Road'].map(tag => (
                <button key={tag} onClick={() => setActiveCategory(tag)} className="tag-link">{tag}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🏍️ MANAGED LISTINGS SECTION */}
      <section className="listings-section">
        <div className="section-container">
          <div className="section-header-pro">
            <div>
              <h2>Frequently Booked</h2>
              <p>Discover the most loved rides in the valley.</p>
            </div>
            <Link to="/bikes" className="view-all-pro">View all fleet <ChevronRight size={16} /></Link>
          </div>

          <motion.div layout className="listings-grid-pro">
            <AnimatePresence mode='popLayout'>
              {filteredBikes.map((bike) => (
                <motion.div 
                  layout
                  key={bike.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bike-card-pro"
                >
                  <div className="bike-card-img-box">
                    <img src={bike.img} alt={bike.model} />
                    <div className="bike-card-tag">{bike.type}</div>
                    <button className="bike-card-wish"><Heart size={16} /></button>
                  </div>
                  
                  <div className="bike-card-body">
                    <div className="bike-card-meta">
                      <strong>{bike.brand}</strong>
                      <span>{bike.loc}</span>
                    </div>
                    <h3>{bike.model}</h3>
                    <p className="bike-card-spec">Size: {bike.size} • 2026 Model</p>
                    
                    <div className="bike-card-footer">
                      <div className="bike-card-price">
                        <strong>Rs. {bike.price}</strong><span>/day</span>
                      </div>
                      <div className="bike-card-rating">
                        <Star size={12} fill="#000" /> {bike.rating} <span>({bike.count})</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 🛡️ TRUST & SUSTAINABILITY BAR */}
      <section className="trust-bar-pro">
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

      {/* 🏁 MANAGED FOOTER */}
      <footer className="footer-pro">
        <div className="footer-grid-pro">
          <div className="f-brand-col">
            <h2 className="logo-f">Ride N Roar</h2>
            <p>Helping you explore the Himalayas with freedom.</p>
          </div>
          <div className="f-link-col">
            <h4>Platform</h4>
            <Link to="/bikes">Browse Fleet</Link>
            <Link to="/register">Sign Up</Link>
          </div>
          <div className="f-link-col">
            <h4>Support</h4>
            <Link to="#">Help Center</Link>
            <Link to="#">Privacy Policy</Link>
          </div>
        </div>
        <div className="f-bottom">
          <p>© 2026 Ride N Roar Nepal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}