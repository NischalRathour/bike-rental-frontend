import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Shield, Clock, CheckCircle, MessageCircle } from "lucide-react";
import "../styles/HireRates.css";

const HireRates = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // 🏍️ FULL FLEET DATA (12+ BIKES)
  const fleet = [
    { id: 1, model: "Hero Xpulse 200 4V", cc: "200cc", rate: 3500, cat: "Dirt", status: "Popular", img: "https://images.unsplash.com/photo-1622185135505-2d795003994a" },
    { id: 2, model: "Royal Enfield Himalayan 452", cc: "452cc", rate: 8500, cat: "Adventure", status: "New", img: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e" },
    { id: 3, model: "Honda CRF 250L", cc: "250cc", rate: 6000, cat: "Dirt", status: "Available", img: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b" },
    { id: 4, model: "Royal Enfield Classic 350", cc: "350cc", rate: 3000, cat: "Cruiser", status: "Classic", img: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838" },
    { id: 5, model: "Honda Dio Scooter", cc: "110cc", rate: 1000, cat: "Scooter", status: "Economy", img: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f" },
    { id: 6, model: "KTM Adventure 390", cc: "373cc", rate: 5500, cat: "Adventure", status: "Available", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc" },
    { id: 7, model: "Crossfire RM 250", cc: "250cc", rate: 5000, cat: "Dirt", status: "Available", img: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6" },
    { id: 8, model: "Yamaha FZ-S V3", cc: "149cc", rate: 2000, cat: "City", status: "Economy", img: "https://images.unsplash.com/photo-1620055375841-8740f90e1850" },
    { id: 9, model: "Bajaj Pulsar NS 200", cc: "199cc", rate: 2500, cat: "City", status: "Available", img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87" },
    { id: 10, model: "Honda H'ness CB350", cc: "348cc", rate: 4500, cat: "Cruiser", status: "Premium", img: "https://images.unsplash.com/photo-1614165933388-9b552e870e7b" },
    { id: 11, model: "Suzuki Gixxer 250", cc: "249cc", rate: 2800, cat: "City", status: "Available", img: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4" },
    { id: 12, model: "TVS NTORQ 125", cc: "124cc", rate: 1200, cat: "Scooter", status: "Available", img: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f" }
  ];

  const categories = ["All", "Adventure", "Dirt", "Cruiser", "City", "Scooter"];

  const filteredFleet = activeCategory === "All" 
    ? fleet 
    : fleet.filter(bike => bike.cat === activeCategory);

  return (
    <div className="hire-page-root">
      {/* 🏔️ HERO SECTION */}
      <section className="hire-hero-section">
        <div className="hero-content-managed">
          <span className="sub-tag">City Motorbike Official Rates</span>
          <h1>Premium <span className="text-gradient">Rental Fleet</span></h1>
          <p>Over 50+ bikes available in Thamel. Prices include regular maintenance and safety gear.</p>
        </div>
      </section>

      <div className="main-content-container">
        {/* 🛡️ TRUST SECTION */}
        <div className="feature-trust-grid">
          <div className="trust-card"><Shield className="t-icon" /><div><h4>Fully Insured</h4><p>Total peace of mind.</p></div></div>
          <div className="trust-card"><Clock className="t-icon" /><div><h4>24/7 Roadside</h4><p>We come to you.</p></div></div>
          <div className="trust-card"><CheckCircle className="t-icon" /><div><h4>Safety First</h4><p>Helmets provided.</p></div></div>
        </div>

        {/* 📊 CATEGORY TABS */}
        <div className="filter-navigation">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🏍️ THE TABLE */}
        <div className="rates-table-card">
          <div className="table-header-managed">
            <span>MODEL & CATEGORY</span>
            <span>CAPACITY</span>
            <span>DAILY RATE</span>
            <span>MONTHLY</span>
            <span>STATUS</span>
          </div>

          <div className="table-body-managed">
            <AnimatePresence mode="popLayout">
              {filteredFleet.map((bike) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={bike.id} 
                  className="rate-row"
                >
                  <div className="col-model">
                    <div className="bike-thumb-managed">
                      <img src={bike.img} alt={bike.model} />
                    </div>
                    <div>
                      <strong>{bike.model}</strong>
                      <span className="cat-label">{bike.cat}</span>
                    </div>
                  </div>
                  <div className="col-cc"><span className="cc-pill">{bike.cc}</span></div>
                  <div className="col-price">Rs. {bike.rate.toLocaleString()}</div>
                  <div className="col-month"><span className="nego-text">Negotiable</span></div>
                  <div className="col-action">
                    <span className={`status-dot ${bike.status.toLowerCase().replace(' ', '-')}`}>
                      {bike.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 📞 CTA SECTION */}
        <section className="inquiry-footer-card">
          <div className="inquiry-text">
            <h3>Ready to explore Nepal?</h3>
            <p>Call us directly for group discounts: <strong>+977-9843360610</strong></p>
          </div>
          <div className="inquiry-actions">
            <button className="btn-inquiry-main">Check Available Slots</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HireRates;