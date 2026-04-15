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
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]); 
  
  // ✅ DYNAMIC STATES FOR SAME-PAGE BOOKING
  const [selectedBike, setSelectedBike] = useState(null);
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const fetchMyStatus = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data.success) setMyBookings(res.data.bookings);
      } catch (err) { console.error("Status sync failed"); }
    };
    fetchMyStatus();
    return () => clearTimeout(timer);
  }, []);

  const isConfirmed = (bikeId) => {
    return myBookings.some(b => 
      b.bikes.some(bike => bike._id === bikeId) && b.status === 'Confirmed'
    );
  };

  const bikes = [
    { _id: "b1", name: "Royal Enfield Hunter 350", price: 1200, type: "Cruiser", rating: 4.8, cc: "350cc", images: ["/images/royal-enfield-1.jpg"] },
    { _id: "b2", name: "KTM-DUKE", price: 5000, type: "Sport", rating: 5.0, cc: "1103cc", images: ["/images/ktm-duke-2.jpg"] },
    { _id: "b3", name: "Honda CB 350", price: 3500, type: "Adventure", rating: 4.9, cc: "888cc", images: ["/images/honda-cb350-1.jpg"] },
    { _id: "b4", name: "Bajaj Pulsar N160", price: 900, type: "Commuter", rating: 4.6, cc: "160cc", images: ["/images/bajaj-pulsar-1.jpg"] },
    { _id: "b5", name: "Yamaha R15", price: 4500, type: "Cruiser", rating: 4.9, cc: "1868cc", images: ["/images/bike1.jpg"] },
    { _id: "b9", name: "KTM RC 390 GP", price: 2100, type: "Sport", rating: 4.9, cc: "373cc", images: ["/images/ktm-duke-3.jpg"] }
  ];

  const filteredBikes = bikes.filter(b => 
    (filter === "All" || b.type === filter) && 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ HANDLER FOR THE "SOLO RIDE" DYNAMIC FLOW
  const handleSoloSelection = (bike) => {
    setSelectedBike(bike);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ HANDLER TO SEND DATA TO BOOKING PAGE
  const handleFinalizeBooking = () => {
    if (!bookingDates.start || !bookingDates.end) {
      alert("Please select your rental dates first!");
      return;
    }
    
    navigate(`/book/${selectedBike._id}?mode=solo`, { 
      state: { 
        initialBike: selectedBike,
        selectedDates: bookingDates 
      } 
    });
  };

  return (
    <div className="bikes-root">
      {/* 🏔️ DYNAMIC HERO SECTION */}
      <section className="bikes-hero">
        <div className="hero-overlay-glow"></div>
        <div className="bikes-container">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-content-box">
            <span className="hero-badge">
              <Sparkles size={14}/> {selectedBike ? "Confirm Reservation" : "Fleet Intelligence | Owner Dashboard"}
            </span>
            <h1>
              {selectedBike ? "Your " : "The "}
              <span className="text-highlight">{selectedBike ? "Selected" : "Premium"}</span> 
              {selectedBike ? " Ride" : " Fleet"}
            </h1>
            <p>{selectedBike ? `You are booking the ${selectedBike.name}.` : "Experience Kathmandu's finest motorcycles."}</p>
          </motion.div>
        </div>
      </section>

      {/* ✅ DYNAMIC BOOKING OVERLAY */}
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
                <button className="close-quick" onClick={() => setSelectedBike(null)}><X size={20}/></button>
                <div className="quick-info">
                  <img src={selectedBike.images[0]} alt="Selected" />
                  <div>
                    <h3>{selectedBike.name}</h3>
                    <p>Total: Rs. {selectedBike.price} / Day</p>
                  </div>
                </div>
                <div className="quick-dates">
                  <div className="date-input">
                    <Calendar size={16}/>
                    <input type="date" value={bookingDates.start} onChange={(e) => setBookingDates({...bookingDates, start: e.target.value})} />
                  </div>
                  <ArrowRight size={16}/>
                  <div className="date-input">
                    <Calendar size={16}/>
                    <input type="date" value={bookingDates.end} onChange={(e) => setBookingDates({...bookingDates, end: e.target.value})} />
                  </div>
                </div>
                {/* ✅ UPDATED BUTTON WITH LOGIC */}
                <button 
                  className="btn-confirm-now"
                  onClick={handleFinalizeBooking}
                >
                  Confirm & Finalize <CheckCircle size={18} />
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
              <Search size={18} />
              <input type="text" placeholder="Search for your ride..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </section>
      )}

      {/* 🏍️ SHOWROOM GRID */}
      <main className="bikes-container grid-padding">
        <div className="showroom-grid">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(6).fill(0).map((_, i) => <div key={i} className="card-skeleton"></div>)
            ) : filteredBikes.length > 0 ? (
              filteredBikes.map((bike) => (
                <motion.div 
                   layout 
                   key={bike._id} 
                   className={`bike-card ${selectedBike?._id === bike._id ? "active-focus" : ""}`}
                   style={{ opacity: selectedBike && selectedBike._id !== bike._id ? 0.3 : 1 }}
                >
                  <div className="bike-image-box">
                    <img src={bike.images[0]} alt={bike.name} />
                    <div className="floating-type">{bike.type}</div>
                    <div className="floating-rating"><Star size={12} fill="currentColor" /> {bike.rating}</div>
                    {isConfirmed(bike._id) && (
                      <div className="booked-ribbon"><CheckCircle size={12} /> Confirmed</div>
                    )}
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
                    
                    <div className="info-btns-vertical">
                      <Link to={`/bikes/${bike._id}`} className="btn-secondary-full">View Details</Link>
                      
                      <div className="dual-action-row">
                        <button 
                          onClick={() => handleSoloSelection(bike)} 
                          className="btn-solo-action"
                        >
                          <Bike size={16}/> Solo Ride
                        </button>
                        <button 
                          onClick={() => navigate(`/book/${bike._id}?mode=group`)} 
                          className="btn-group-action"
                        >
                          <Users size={16}/> Group
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state-box"><AlertCircle size={60} /><h3>No Bikes Found</h3></div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Bikes;