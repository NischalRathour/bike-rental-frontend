import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, MapPin, Star, ShieldCheck, Search, ChevronRight } from "lucide-react";
import "../styles/Bikes.css";

export default function Bikes() {
  const [filter, setFilter] = useState("All");

  const bikes = [
    { _id: "694d0605a48ce99e1d178757", name: "Hero Xtreme 200S", price: 950, type: "Commuter", status: "Available", images: ["/images/bike8.jpg"], rating: 4.8 },
    { _id: "694d0605a48ce99e1d178758", name: "Honda CB Shine", price: 800, type: "Commuter", status: "Available", images: ["/images/bike9.jpg"], rating: 4.5 },
    { _id: "6965387ac8f1e5c605231295", name: "Suzuki GSX-R1000", price: 2000, type: "Sport", status: "Available", images: ["/images/bike3.jpg"], rating: 5.0 },
    { _id: "696ba6bd1bad3c26a3d1fbb1", name: "Kawasaki Ninja 650", price: 1800, type: "Sport", status: "Available", images: ["/images/bike4.jpg"], rating: 4.9 },
    { _id: "696bbe5938845977a85bd20f", name: "Yamaha R15", price: 1200, type: "Sport", status: "Available", images: ["/images/bike1.jpg"], rating: 4.7 },
    { _id: "696bcafd3f3bf6e595727048", name: "Honda CB500X", price: 1500, type: "Adventure", status: "Available", images: ["/images/bike2.jpg"], rating: 4.9 },
    { _id: "696ba5931bad3c26a3d1fbac", name: "KTM Duke 390", price: 1300, type: "Sport", status: "Available", images: ["/images/bike3.jpg"], rating: 4.8 },
    { _id: "69652c02c8f1e5c605231289", name: "Royal Enfield Classic 350", price: 1100, type: "Cruiser", status: "Available", images: ["/images/bike4.jpg"], rating: 4.6 },
    { _id: "6965387ac8f1e5c605231296", name: "Suzuki Gixxer", price: 1000, type: "Commuter", status: "Available", images: ["/images/bike5.jpg"], rating: 4.4 },
  ];

  const filteredBikes = filter === "All" ? bikes : bikes.filter(b => b.type === filter);

  return (
    <div className="bikes-marketplace">
      {/* 🧭 FILTER NAVIGATION */}
      <section className="bikes-filter-bar">
        <div className="filter-content">
          <div className="category-group">
            {["All", "Sport", "Adventure", "Cruiser", "Commuter"].map((cat) => (
              <button 
                key={cat} 
                className={`filter-pill ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="search-mini">
            <Search size={18} />
            <input type="text" placeholder="Search model..." />
          </div>
        </div>
      </section>

      <div className="bikes-main-layout">
        <div className="container-managed">
          <header className="listing-header">
            <h2>Explore Our Premium Fleet</h2>
            <p>{filteredBikes.length} high-performance motorcycles found in Kathmandu</p>
          </header>

          <div className="bikes-grid-managed">
            <AnimatePresence mode="popLayout">
              {filteredBikes.map((bike) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={bike._id} 
                  className="premium-bike-card"
                >
                  <div className="card-image-box">
                    <img src={bike.images[0]} alt={bike.name} />
                    <div className="type-badge">{bike.type}</div>
                  </div>

                  <div className="card-details">
                    <div className="details-top">
                      <span className="location-tag"><MapPin size={12} /> Kathmandu</span>
                      <div className="rating-tag">
                        <Star size={12} fill="#ffc107" stroke="none" />
                        <span>{bike.rating}</span>
                      </div>
                    </div>
                    
                    <h3>{bike.name}</h3>
                    <p className="price-tag">Rs. {bike.price} <span>/ day</span></p>

                    <div className="card-trust">
                      <span><ShieldCheck size={14} /> Insured</span>
                      <span><ShieldCheck size={14} /> Verified</span>
                    </div>

                    <div className="card-actions">
                      <Link to={`/bikes/${bike._id}`} className="details-link">
                        Details
                      </Link>
                      <Link to={`/book/${bike._id}`} className="book-now-btn">
                        Book Now <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}