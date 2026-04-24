import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, Search, Fuel, Gauge, ArrowRight, 
  Loader2, Sparkles, AlertCircle, CheckCircle, Users, Bike, X, Calendar 
} from "lucide-react";
import api from "../api/axiosConfig"; 
import "../styles/Bikes.css";

const Bikes = () => {
  const navigate = useNavigate();
  
  // ✅ Initializing as empty arrays ensures .map() and .some() don't crash
  const [bikes, setBikes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]); 

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBike, setSelectedBike] = useState(null);
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const fleetRes = await api.get('/bikes');
        // Handle different API response structures
        const fetchedBikes = fleetRes.data.bikes || fleetRes.data || [];
        setBikes(fetchedBikes);

        const bookingRes = await api.get('/bookings/my');
        // Ensure we handle the case where bookings might be undefined
        if (bookingRes.data && bookingRes.data.success) {
          setMyBookings(bookingRes.data.bookings || []);
        }
      } catch (err) {
        console.error("Fleet sync intelligence failed.");
        setBikes([]); // Fallback to empty fleet
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchDashboardData();
  }, []);

  /**
   * ✅ FIXED: added optional chaining (?.) and fallbacks (|| [])
   * This prevents the "undefined reading some" error.
   */
  const isConfirmed = (bikeId) => {
    return (myBookings || []).some(b => 
      (b.bikes || []).some(bike => (bike._id || bike) === bikeId) && b.status === 'Confirmed'
    );
  };

  const filteredBikes = (bikes || []).filter(b => 
    (filter === "All" || (b.type && b.type.toLowerCase() === filter.toLowerCase())) && 
    ((b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
     (b.brand && b.brand.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleSoloSelection = (bike) => {
    setSelectedBike(bike);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizeBooking = () => {
    if (!bookingDates.start || !bookingDates.end) {
      alert("Please select your rental dates first!");
      return;
    }
    navigate(`/book/${selectedBike._id}?mode=solo`, { 
      state: { initialBike: selectedBike, selectedDates: bookingDates } 
    });
  };

  return (
    <div className="bikes-root">
      {/* 🏔️ MEGA HERO SECTION */}
      <section className="bikes-hero">
        <div className="hero-overlay-glow"></div>
        <div className="bikes-container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="hero-content-box">
            <span className="hero-badge">
              <Sparkles size={18}/> {selectedBike ? "Reservation Orchestration" : "Elite Fleet Intelligence"}
            </span>
            <h1>
              {selectedBike ? "Secure Your " : "The "}
              <span className="text-highlight">{selectedBike ? "Selection" : "Premium"}</span> 
              {selectedBike ? "" : " Collection"}
            </h1>
            <p className="hero-description">
              {selectedBike 
                ? `You have chosen the ${selectedBike.name}. Please define your expedition timeline below.` 
                : "Experience Kathmandu's most exclusive mechanical stable. Engineering excellence meets the open road."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ✅ QUICK-BOOK SYSTEM OVERLAY */}
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
                    <Calendar size={22}/><input type="date" value={bookingDates.start} onChange={(e) => setBookingDates({...bookingDates, start: e.target.value})} />
                  </div>
                  <ArrowRight size={24} className="arrow-sep"/>
                  <div className="date-input">
                    <Calendar size={22}/><input type="date" value={bookingDates.end} onChange={(e) => setBookingDates({...bookingDates, end: e.target.value})} />
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

      {/* 🧭 PREMIUM NAVIGATION BAR */}
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
              <input type="text" placeholder="Locate a specific model..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </section>
      )}

      {/* 🏍️ DYNAMIC SHOWROOM GRID */}
      <main className="bikes-container grid-padding">
        <div className="showroom-grid">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="card-skeleton"></div>)
            ) : filteredBikes.length > 0 ? (
              filteredBikes.map((bike) => (
                <motion.div 
                   layout 
                   key={bike._id} 
                   className={`bike-card ${selectedBike?._id === bike._id ? "active-focus" : ""}`}
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
                  </div>

                  <div className="bike-info-box">
                    <div className="info-top">
                      <h2>{bike.name}</h2>
                      <p className="bike-price">Rs. <span>{bike.price}</span><small>/ per day</small></p>
                    </div>
                    <div className="info-specs">
                      <span><Gauge size={22}/> {bike.cc || "150"} CC</span>
                      <span><MapPin size={22}/> Kathmandu Hub</span>
                    </div>
                    
                    <div className="info-btns-vertical">
                      <Link to={`/bikes/${bike._id}`} className="btn-secondary-full">Technical Specifications</Link>
                      
                      <div className="dual-action-row">
                        <button onClick={() => handleSoloSelection(bike)} className="btn-solo-action">
                          Reserve Solo
                        </button>
                        <button onClick={() => navigate(`/book/${bike._id}?mode=group`)} className="btn-group-action" title="Group Booking">
                          <Users size={24}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="luxury-empty-state"
              >
                <div className="empty-icon-circle">
                  <Bike size={80} strokeWidth={1} />
                </div>
                <h3>The Vault is Empty</h3>
                <p>We couldn't find any machines matching <strong>{filter}</strong>. <br/> Please broaden your search or contact our concierge.</p>
                <button onClick={() => setFilter("All")} className="btn-reset-filter">
                  Return to Main Collection
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Bikes;