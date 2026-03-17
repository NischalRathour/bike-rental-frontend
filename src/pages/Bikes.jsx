import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, MapPin, Star, ShieldCheck, Search, ChevronRight, Fuel, Gauge } from "lucide-react";
import "../styles/Bikes.css";

export default function Bikes() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🏍️ FULL EXPANDED FLEET DATA
  const bikes = [
    { _id: "b1", name: "Hero Xtreme 200S", price: 950, type: "Commuter", status: "Available", images: ["https://images.unsplash.com/photo-1622185135505-2d795003994a"], rating: 4.8, cc: "200cc" },
    { _id: "b2", name: "Suzuki GSX-R1000", price: 2000, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1614165933388-9b552e870e7b"], rating: 5.0, cc: "1000cc" },
    { _id: "b3", name: "Honda CB500X", price: 1500, type: "Adventure", status: "Available", images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"], rating: 4.9, cc: "500cc" },
    { _id: "b4", name: "Royal Enfield Classic 350", price: 1100, type: "Cruiser", status: "Available", images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838"], rating: 4.6, cc: "350cc" },
    { _id: "b5", name: "KTM Duke 390", price: 1300, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"], rating: 4.8, cc: "373cc" },
    { _id: "b6", name: "Yamaha R15 V4", price: 1200, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1620055375841-8740f90e1850"], rating: 4.7, cc: "155cc" },
    { _id: "b7", name: "Crossfire RM 250", price: 1800, type: "Adventure", status: "Available", images: ["https://images.unsplash.com/photo-1558981285-6f0c94958bb6"], rating: 4.5, cc: "250cc" },
    { _id: "b8", name: "Honda Dio 110", price: 800, type: "Commuter", status: "Available", images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f"], rating: 4.4, cc: "110cc" },
    { _id: "b9", name: "Royal Enfield Himalayan 452", price: 2500, type: "Adventure", status: "Available", images: ["https://images.unsplash.com/photo-1615172282427-9a57ef2d142e"], rating: 5.0, cc: "452cc" },
    { _id: "b10", name: "Kawasaki Ninja 650", price: 2800, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1444491741275-3747c53c99b4"], rating: 4.9, cc: "650cc" },
    { _id: "b11", name: "Honda H'ness CB350", price: 1600, type: "Cruiser", status: "Available", images: ["https://images.unsplash.com/photo-1614165933388-9b552e870e7b"], rating: 4.8, cc: "350cc" },
    { _id: "b12", name: "Bajaj Pulsar NS 200", price: 1000, type: "Commuter", status: "Available", images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"], rating: 4.5, cc: "200cc" },
  ];

  const filteredBikes = bikes.filter(b => 
    (filter === "All" || b.type === filter) && 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bikes-marketplace-root">
      {/* 🏔️ PREMIUM MINI HERO */}
      <section className="bikes-hero-mini">
        <div className="container-managed">
          <h1>Explore the <span className="text-gradient">Ultimate Fleet</span></h1>
          <p>Choose from over 50+ professionally maintained motorcycles in Kathmandu.</p>
        </div>
      </section>

      {/* 🧭 ADVANCED FILTER BAR */}
      <section className="bikes-sticky-filter">
        <div className="filter-content-managed">
          <div className="category-tabs">
            {["All", "Sport", "Adventure", "Cruiser", "Commuter"].map((cat) => (
              <button 
                key={cat} 
                className={`tab-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="search-box-premium">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search e.g., Himalayan..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="container-managed">
        <div className="listings-info">
          <span>Displaying <strong>{filteredBikes.length}</strong> Units</span>
        </div>

        <div className="bikes-premium-grid">
          <AnimatePresence mode="popLayout">
            {filteredBikes.map((bike) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={bike._id} 
                className="bike-card-advanced"
              >
                <div className="card-media">
                  <img src={bike.images[0]} alt={bike.name} />
                  <div className="badge-overlay">{bike.type}</div>
                </div>

                <div className="card-body-content">
                  <div className="card-meta-top">
                    <span className="location"><MapPin size={12} /> Kathmandu</span>
                    <span className="rating"><Star size={12} fill="currentColor" color="#ffc107" /> {bike.rating}</span>
                  </div>

                  <h3>{bike.name}</h3>
                  
                  <div className="bike-specs-row">
                    <span><Gauge size={14}/> {bike.cc}</span>
                    <span><Fuel size={14}/> Petrol</span>
                  </div>

                  <div className="price-container">
                    <span className="currency">Rs.</span>
                    <span className="amount">{bike.price}</span>
                    <span className="period">/ day</span>
                  </div>

                  <div className="card-footer-actions">
                    <Link to={`/bikes/${bike._id}`} className="btn-details-secondary">
                      View Details
                    </Link>
                    <Link to={`/book/${bike._id}`} className="btn-book-primary">
                      Rent Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}