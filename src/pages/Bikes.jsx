import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, MapPin, Star, Search, Fuel, Gauge, ArrowRight } from "lucide-react";
import "../styles/Bikes.css";

export default function Bikes() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const bikes = [
    { _id: "b1", name: "Hero Xtreme 200S", price: 950, type: "Commuter", status: "Available", images: ["https://images.unsplash.com/photo-1622185135505-2d795003994a"], rating: 4.8, cc: "200cc" },
    { _id: "b2", name: "Suzuki GSX-R1000", price: 2000, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1614165933388-9b552e870e7b"], rating: 5.0, cc: "1000cc" },
    { _id: "b3", name: "Honda CB500X", price: 1500, type: "Adventure", status: "Available", images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"], rating: 4.9, cc: "500cc" },
    { _id: "b4", name: "Royal Enfield Classic 350", price: 1100, type: "Cruiser", status: "Available", images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838"], rating: 4.6, cc: "350cc" },
    { _id: "b5", name: "KTM Duke 390", price: 1300, type: "Sport", status: "Available", images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc"], rating: 4.8, cc: "373cc" },
    { _id: "b9", name: "Royal Enfield Himalayan 452", price: 2500, type: "Adventure", status: "Available", images: ["https://images.unsplash.com/photo-1615172282427-9a57ef2d142e"], rating: 5.0, cc: "452cc" },
    // ... rest of your data
  ];

  const filteredBikes = bikes.filter(b => 
    (filter === "All" || b.type === filter) && 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bikes-marketplace-root">
      {/* 🏔️ FULL WIDTH HERO */}
      <section className="bikes-hero-wide">
        <div className="container-full-managed">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="sub-tag">The Premium Fleet</span>
            <h1>Unleash the <span className="text-gradient">Power of Two Wheels</span></h1>
            <p>Experience Kathmandu's most exclusive motorcycle rental marketplace.</p>
          </motion.div>
        </div>
      </section>

      {/* 🧭 SEARCH & FILTER BAR */}
      <section className="sticky-filter-wrapper">
        <div className="container-full-managed flex-between">
          <div className="category-pills">
            {["All", "Sport", "Adventure", "Cruiser", "Commuter"].map((cat) => (
              <button 
                key={cat} 
                className={`pill-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="premium-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by model..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 🏍️ WIDE LISTINGS GRID */}
      <main className="container-full-managed py-60">
        <div className="grid-header">
            <h3>Available Units <span className="count-badge">{filteredBikes.length}</span></h3>
        </div>

        <div className="showroom-grid">
          <AnimatePresence mode="popLayout">
            {filteredBikes.map((bike) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={bike._id} 
                className="showroom-card"
              >
                <div className="card-image-wrap">
                  <img src={bike.images[0]} alt={bike.name} loading="lazy" />
                  <div className="card-type-tag">{bike.type}</div>
                  <div className="card-rating-float">
                    <Star size={12} fill="#ffc107" color="#ffc107" /> {bike.rating}
                  </div>
                </div>

                <div className="card-details-wrap">
                  <div className="card-title-row">
                    <h2>{bike.name}</h2>
                    <div className="card-price">
                        <small>Rs.</small><strong>{bike.price.toLocaleString()}</strong><small>/day</small>
                    </div>
                  </div>

                  <div className="card-specs-row">
                    <div className="spec-item"><Gauge size={14}/> {bike.cc}</div>
                    <div className="spec-item"><Fuel size={14}/> Petrol</div>
                    <div className="spec-item"><MapPin size={14}/> Kathmandu</div>
                  </div>

                  <div className="card-action-row">
                    <Link to={`/bikes/${bike._id}`} className="btn-secondary">Details</Link>
                    <Link to={`/book/${bike._id}`} className="btn-primary">Rent Now <ArrowRight size={16}/></Link>
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