import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, Search, Fuel, Gauge, ArrowRight, Loader2, Sparkles, AlertCircle 
} from "lucide-react";
import "../styles/Bikes.css";

const Bikes = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 📸 REAL HIGH-RES IMAGES
  const bikes = [
    { 
      _id: "b1", name: "Royal Enfield Hunter 350", price: 1200, type: "Cruiser", rating: 4.8, cc: "350cc",
      images: ["/images/royal-enfield-1.jpg"]
    },
    { 
      _id: "b2", name: "KTM-DUKE", price: 5000, type: "Sport", rating: 5.0, cc: "1103cc",
      images: ["/images/ktm-duke-2.jpg"]
    },
    { 
      _id: "b3", name: "Honda CB 350", price: 3500, type: "Adventure", rating: 4.9, cc: "888cc",
      images: ["/images/honda-cb350-1.jpg"]
    },
    { 
      _id: "b4", name: "Bajaj Pulsar N160", price: 900, type: "Commuter", rating: 4.6, cc: "160cc",
      images: ["/images/bajaj-pulsar-1.jpg"]
    },
    { 
      _id: "b5", name: "Yamaha R15", price: 4500, type: "Cruiser", rating: 4.9, cc: "1868cc",
      images: ["/images/bike1.jpg"]
    },
    { 
    _id: "b9", name: "KTM RC 390 GP", price: 2100, type: "Sport", rating: 4.9, cc: "373cc",
    images: ["/images/ktm-duke-3.jpg"]
  }
  ];

  const filteredBikes = bikes.filter(b => 
    (filter === "All" || b.type === filter) && 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bikes-root">
      {/* 🏔️ LUXURY HERO SECTION */}
      <section className="bikes-hero">
        <div className="hero-overlay-glow"></div>
        <div className="bikes-container">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hero-content-box">
            <span className="hero-badge"><Sparkles size={14}/> Elite Selection</span>
            <h1>The <span className="text-highlight">Premium</span> Fleet</h1>
            <p>Experience Kathmandu's finest motorcycles. Curated for performance, styled for the roar.</p>
          </motion.div>
        </div>
      </section>

      {/* 🧭 PREMIUM STICKY NAV */}
      <section className="filter-navbar">
        <div className="bikes-container flex-header">
          <div className="filter-pills">
            {["All", "Sport", "Adventure", "Cruiser", "Commuter"].map((cat) => (
              <button key={cat} className={`pill ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>{cat}</button>
            ))}
          </div>
          <div className="search-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search for your ride..." onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </section>

      {/* 🏍️ SHOWROOM GRID */}
      <main className="bikes-container grid-padding">
        <div className="showroom-grid">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="card-skeleton"></div>)
            ) : filteredBikes.length > 0 ? (
              filteredBikes.map((bike) => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={bike._id} className="bike-card">
                  <div className="bike-image-box">
                    <img src={bike.images[0]} alt={bike.name} />
                    <div className="floating-type">{bike.type}</div>
                    <div className="floating-rating"><Star size={12} fill="currentColor" /> {bike.rating}</div>
                  </div>
                  <div className="bike-info-box">
                    <div className="info-top">
                      <h2>{bike.name}</h2>
                      <p className="bike-price">Rs. <span>{bike.price}</span><small>/day</small></p>
                    </div>
                    <div className="info-specs">
                      <span><Gauge size={14}/> {bike.cc}</span>
                      <span><Fuel size={14}/> Petrol</span>
                      <span><MapPin size={14}/> Kathmandu</span>
                    </div>
                    <div className="info-btns">
                      <Link to={`/bikes/${bike._id}`} className="btn-secondary-outline">View Details</Link>
                      <Link to={`/book/${bike._id}`} className="btn-primary-solid">Book Now <ArrowRight size={16}/></Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state-box">
                <AlertCircle size={60} />
                <h3>No Bikes Found</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Bikes;