import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Star, Bike, Search, Heart, ShieldCheck, Leaf } from "lucide-react";
import "../styles/Home.css";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Home() {
  const featuredBikes = [
    { id: 1, brand: "Scott", model: "Ransom eRide 920", type: "E-Mountain Bike", size: "L", price: "800", rating: "4.85", count: "34", img: "/images/mountain.jpg" },
    { id: 2, brand: "Canyon", model: "Grail CF SL 7", type: "Road Bike", size: "M", price: "1200", rating: "5.00", count: "12", img: "/images/electric.jpg" },
    { id: 3, brand: "Muli Cycles", model: "Motor ST", type: "E-Cargo Bike", size: "Unisize", price: "1500", rating: "4.95", count: "9", img: "/images/scooter.jpg" },
    { id: 4, brand: "Dames Fiets", model: "Classic City", type: "City Bike", size: "Unisize", price: "600", rating: "5.00", count: "31", img: "/images/moving-bike.jpg" }
  ];

  return (
    <div className="home-wrapper">
      
      {/* 🚀 HERO SECTION */}
      <section className="hero-v5">
        <div className="hero-img-frame">
          <img src="/images/moving-bike.jpg" alt="Ride Nepal" className="hero-fixed-img" />
          <div className="hero-dark-overlay"></div>
        </div>
        
        <div className="hero-text-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="search-box-glass">
            <span className="top-badge">Nepal’s Trusted Bike Rental Marketplace</span>
            <h1>Rent premium bikes for your <br /><span>next adventure in Nepal</span></h1>
            
            <div className="search-widget">
              <div className="search-part">
                <MapPin size={18} />
                <input type="text" placeholder="Where to?" />
              </div>
              <div className="v-divider"></div>
              <div className="search-part">
                <Calendar size={18} />
                <input type="text" placeholder="Dates" onFocus={(e) => e.target.type = 'date'} />
              </div>
              <button className="search-action-btn"><Search size={20} /></button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🏍️ INVENTORY SECTION */}
      <section className="inventory-v5">
        <div className="container-max">
          <div className="flex-header">
            <h2 style={{fontSize: '2rem', fontWeight: 800}}>Frequently Booked Bikes</h2>
            <Link to="/bikes" style={{color: '#2563eb', fontWeight: 600}}>View all fleet →</Link>
          </div>

          <div className="grid-responsive-v5">
            {featuredBikes.map((bike) => (
              <motion.div key={bike.id} {...fadeInUp} className="product-card-v5">
                <div className="img-crop-container">
                  <img src={bike.img} alt={bike.model} className="product-thumb" />
                  <div className="card-tag">{bike.type}</div>
                  <button className="heart-btn"><Heart size={16} /></button>
                </div>
                
                <div className="card-info">
                  <div className="brand-meta">
                    <strong>{bike.brand}</strong>
                    <span>Kathmandu</span>
                  </div>
                  <h3>{bike.model}</h3>
                  <p style={{fontSize: '0.85rem', color: '#64748b', margin: '5px 0'}}>Size: {bike.size}</p>
                  
                  <div className="price-rating-row">
                    <div className="p-tag">Rs. {bike.price}<span>/day</span></div>
                    <div className="r-tag" style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600}}>
                      <Star size={14} fill="#ffc107" stroke="none" /> 
                      {bike.rating} <span style={{color: '#94a3b8', fontWeight: 400}}>({bike.count})</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ TRUST MODULE */}
      <div className="trust-strip">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><ShieldCheck size={20} color="#10b981"/> Insurance Included</div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Leaf size={20} color="#10b981"/> Carbon Neutral Rides</div>
      </div>

      <footer className="footer-simple-v5">
        <p>© 2026 Ride N Roar Nepal. Helping you explore the Himalayas.</p>
      </footer>
    </div>
  );
}