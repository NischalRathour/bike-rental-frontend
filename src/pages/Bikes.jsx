import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, Search, Fuel, Gauge, ArrowRight, 
  Loader2, Sparkles, AlertCircle, CheckCircle, Users, Bike, X, Calendar, ShieldCheck
} from "lucide-react";
import api from "../api/axiosConfig"; 
import "../styles/Bikes.css";

const Bikes = () => {
  const navigate = useNavigate();
  
  // ✅ Data States
  const [bikes, setBikes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]); 

  // ✅ UI Filter States
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBike, setSelectedBike] = useState(null);
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const fleetRes = await api.get('/bikes');
        const fetchedBikes = fleetRes.data.bikes || fleetRes.data || [];
        setBikes(fetchedBikes);

        const bookingRes = await api.get('/bookings/my');
        if (bookingRes.data && bookingRes.data.success) {
          setMyBookings(bookingRes.data.bookings || []);
        }
      } catch (err) {
        console.error("Fleet sync intelligence failed.");
        setBikes([]); 
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchDashboardData();
  }, []);

  const isConfirmed = (bikeId) => {
    return (myBookings || []).some(b => 
      (b.bikes || []).some(bike => (bike._id || bike) === bikeId) && b.status === 'Confirmed'
    );
  };

  const filteredBikes = (bikes || []).filter(b => {
    const hasOwner = b.owner !== null && b.owner !== undefined;
    const matchesFilter = filter === "All" || (b.type && b.type.toLowerCase() === filter.toLowerCase());
    const matchesSearch = (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (b.brand && b.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    return hasOwner && matchesFilter && matchesSearch;
  });

  const handleSoloSelection = (bike) => {
    // 🛡️ Double-check availability before selection
    if (bike.available === false || bike.status === 'Rented') return;
    
    setSelectedBike(bike);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizeBooking = () => {
    if (!bookingDates.start || !bookingDates.end) {
      alert("⚠️ Expedition Logic: Please select your journey dates first!");
      return;
    }
    navigate(`/book/${selectedBike._id}?mode=solo`, { 
      state: { initialBike: selectedBike, selectedDates: bookingDates } 
    });
  };

  if (loading) return (
    <div className="booking-loading-screen">
      <div className="premium-loader"><Sparkles className="loader-icon" /></div>
      <p>Synchronizing with Owner Hub Telemetry...</p>
    </div>
  );

  return (
    <div className="bikes-root">
      <section className="bikes-hero">
        <div className="hero-overlay-glow"></div>
        <div className="bikes-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="hero-content-box">
            <span className="hero-badge">
              <ShieldCheck size={18}/> Verified Owner Fleet
            </span>
            <h1>
              {selectedBike ? "Secure Your " : "The "}
              <span className="text-highlight">{selectedBike ? "Selection" : "Showroom"}</span> 
            </h1>
            <p className="hero-description">
              Explore our collection of premium machines, exclusively verified and managed by registered owners.
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedBike && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="quick-book-panel"
          >
            <div className="bikes-container">
              <div className="quick-book-card">
                <button className="close-quick" onClick={() => setSelectedBike(null)}><X size={28}/></button>
                <div className="quick-info">
                  <img src={selectedBike.images?.[0] || "/images/default-bike.jpg"} alt="Selected" />
                  <div className="quick-meta">
                    <h3>{selectedBike.name}</h3>
                    <p className="price-label">Daily Investment <span>Rs. {selectedBike.price}</span></p>
                  </div>
                </div>
                <div className="quick-dates">
                  <div className="date-input">
                    <Calendar size={22}/><input type="date" value={bookingDates.start} min={new Date().toISOString().split('T')[0]} onChange={(e) => setBookingDates({...bookingDates, start: e.target.value})} />
                  </div>
                  <ArrowRight size={24} className="arrow-sep"/>
                  <div className="date-input">
                    <Calendar size={22}/><input type="date" value={bookingDates.end} min={bookingDates.start || new Date().toISOString().split('T')[0]} onChange={(e) => setBookingDates({...bookingDates, end: e.target.value})} />
                  </div>
                </div>
                <button className="btn-confirm-now" onClick={handleFinalizeBooking}>
                  Finalize Reservation <CheckCircle size={22} />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {!selectedBike && (
        <section className="filter-navbar">
          <div className="bikes-container flex-header">
            <div className="filter-pills">
              {["All", "Sport", "Adventure", "Cruiser", "Commuter"].map((cat) => (
                <button key={cat} className={`pill ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>{cat}</button>
              ))}
            </div>
            <div className="search-wrapper">
              <Search size={24} />
              <input type="text" placeholder="Locate verified models..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </section>
      )}

      <main className="bikes-container grid-padding">
        <div className="showroom-grid">
          <AnimatePresence mode="popLayout">
            {filteredBikes.length > 0 ? (
              filteredBikes.map((bike) => (
                <motion.div 
                    layout 
                    key={bike._id} 
                    className={`bike-card ${selectedBike?._id === bike._id ? "active-focus" : ""} ${(bike.available === false || bike.status === 'Rented') ? "bike-rented" : ""}`}
                    style={{ opacity: selectedBike && selectedBike._id !== bike._id ? 0.3 : 1 }}
                >
                  <div className="bike-image-box">
                    <img src={bike.images?.[0] || "/images/default-bike.jpg"} alt={bike.name} />
                    <div className="floating-type">{bike.type}</div>
                    <div className="floating-rating"><Star size={16} fill="currentColor" /> {bike.rating || "4.9"}</div>
                    
                    {isConfirmed(bike._id) && (
                      <div className="booked-ribbon">
                        <CheckCircle size={16} /> Confirmed
                      </div>
                    )}

                    {/* 🔒 RENTED OVERLAY */}
                    {(bike.available === false || bike.status === 'Rented') && (
                      <div className="rented-overlay">
                        <span>OUT ON EXPEDITION</span>
                      </div>
                    )}
                  </div>

                  <div className="bike-info-box">
                    <div className="info-top">
                      <h2>{bike.name}</h2>
                      <p className="bike-price">Rs. <span>{bike.price}</span><small>/ day</small></p>
                    </div>
                    <div className="info-specs">
                      <span><Gauge size={22}/> {bike.cc || "150"} CC</span>
                      <span className="verified-owner-tag" title="Verified Owner Machine">
                        <Users size={18}/> Verified
                      </span>
                    </div>
                    
                    <div className="info-btns-vertical">
                      <Link to={`/bikes/${bike._id}`} className="btn-secondary-full">Technical Specs</Link>
                      
                      <div className="dual-action-row">
                        {/* ✅ UPDATED DYNAMIC BUTTON */}
                        <button 
                          onClick={() => handleSoloSelection(bike)} 
                          className="btn-solo-action"
                          disabled={bike.available === false || bike.status === 'Rented'}
                        >
                          {(bike.available === false || bike.status === 'Rented') ? "Currently Rented" : "Reserve Solo"}
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/book/${bike._id}?mode=group`)} 
                          className="btn-group-action" 
                          title="Group Booking"
                          disabled={bike.available === false || bike.status === 'Rented'}
                        >
                          <Users size={24}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="luxury-empty-state">
                <AlertCircle size={80} strokeWidth={1} />
                <h3>Verified Inventory Depleted</h3>
                <p>Currently, no machines managed by registered owners match <b>{filter}</b>.</p>
                <button onClick={() => {setFilter("All"); setSearchTerm("");}} className="btn-reset-filter">Reset Fleet Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Bikes;