import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, ShieldCheck } from "lucide-react";
import "../styles/Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/bikes?search=${searchQuery}`);
  };

  return (
    <section className="hero-wrapper">
      {/* 🏔️ Background Overlay */}
      <div className="hero-overlay"></div>
      
      <div className="container-managed">
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-side"
          >
            <span className="hero-badge">#1 Bike Rental in Kathmandu</span>
            <h1>Adventure Awaits on the <span className="text-gradient">Open Road.</span></h1>
            <p>Premium motorcycle rentals and guided tours across the Himalayas. Unleash the beast within.</p>
            
            <div className="hero-trust-indicators">
              <div className="trust-item"><ShieldCheck size={18}/> <span>Full Insurance</span></div>
              <div className="trust-item"><MapPin size={18}/> <span>24/7 Roadside Assist</span></div>
            </div>
          </motion.div>

          {/* 🔍 SEARCH WIDGET */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="search-widget-container"
          >
            <form className="booking-widget" onSubmit={handleSearch}>
              <div className="widget-header">
                <h3>Find Your Ride</h3>
                <p>Select your dates and explore the city.</p>
              </div>

              <div className="widget-inputs">
                <div className="input-field">
                  <label><MapPin size={14}/> Location</label>
                  <select>
                    <option>Kathmandu, Nepal</option>
                    <option>Pokhara, Nepal</option>
                  </select>
                </div>

                <div className="input-field">
                  <label><Calendar size={14}/> Dates</label>
                  <input type="text" placeholder="Select Dates" onFocus={(e) => (e.target.type = "date")} />
                </div>

                <div className="input-field">
                  <label><Search size={14}/> Bike Model</label>
                  <input 
                    type="text" 
                    placeholder="Search e.g. Enfield" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-hero-search">
                Check Availability
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;