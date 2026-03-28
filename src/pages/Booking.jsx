import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, Trash2, Check, 
  ArrowRight, Info, Zap, 
  CreditCard, Fuel, X
} from 'lucide-react';
import "../styles/Booking.css";

const Booking = () => {
  const [bikes, setBikes] = useState([]);
  const [cart, setCart] = useState([]);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await api.get('/bikes');
        const dbBikes = res.data.bikes || res.data;
        setBikes(dbBikes);
      } catch (err) { 
        console.error("Fetch failed");
      } finally { setLoading(false); }
    };
    fetchFleet();
  }, []);

  const toggleSelection = (bike) => {
    const exists = cart.find(b => b._id === bike._id);
    setCart(exists ? cart.filter(b => b._id !== bike._id) : [...cart, bike]);
  };

  const calculateDays = () => {
    if (!dates.start || !dates.end) return 0;
    const diff = new Date(dates.end) - new Date(dates.start);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const handleProceed = async () => {
    if (cart.length === 0 || !dates.start || !dates.end) {
      setShowError(true);
      return;
    }
    setBookingLoading(true);
    try {
      const payload = {
        bikeIds: cart.map(b => b._id),
        startDate: dates.start,
        endDate: dates.end,
        totalPrice: calculateDays() * cart.reduce((s, b) => s + b.price, 0)
      };
      const res = await api.post('/bookings', payload);
      if (res.data.success) window.location.href = `/payment/${res.data.booking._id}`;
    } catch (err) { 
      alert("Booking failed.");
    } finally { setBookingLoading(false); }
  };

  if (loading) return <div className="booking-loading-screen"><div className="loader-pulse"></div></div>;

  return (
    <div className="booking-v2-root">
      {/* 📅 INTEGRATED ACTION BAR (The Date Picker Fix) */}
      <section className="booking-action-bar">
        <div className="action-bar-container">
          <div className="action-title">
            <h2>Select Dates</h2>
          </div>
          
          <div className="date-orchestrator">
            <div className="date-chip">
              <Calendar size={18}/>
              <input 
                type="date" 
                value={dates.start}
                min={new Date().toISOString().split('T')[0]} 
                onChange={(e) => setDates({...dates, start: e.target.value})} 
              />
            </div>
            <ArrowRight size={18} className="arrow-sep" />
            <div className="date-chip">
              <Calendar size={18}/>
              <input 
                type="date" 
                value={dates.end}
                min={dates.start || new Date().toISOString().split('T')[0]} 
                onChange={(e) => setDates({...dates, end: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </section>

      <main className="booking-v2-layout">
        {/* 🏍️ BIKE LIST */}
        <section className="fleet-grid-section">
          <div className="section-intro">
            <h1>Choose Your Machine</h1>
            <p>Select your bike for the Kathmandu ride.</p>
          </div>

          <div className="premium-bike-grid">
            {bikes.map((bike) => (
              <motion.div 
                layout
                whileHover={{ y: -5 }}
                key={bike._id} 
                className={`bike-v2-card ${cart.find(b => b._id === bike._id) ? 'selected' : ''}`}
                onClick={() => toggleSelection(bike)}
              >
                <div className="card-media-box">
                  <img src={bike.images?.[0]} alt={bike.name} />
                </div>

                <div className="card-info-box">
                  <div className="card-header-row">
                    <h3>{bike.name}</h3>
                    {cart.find(b => b._id === bike._id) && <div className="check-badge"><Check size={14} /></div>}
                  </div>
                  
                  <div className="spec-row-mini">
                    <span>{bike.cc} cc</span>
                    <span>{bike.type}</span>
                  </div>

                  <div className="price-footer-v2">
                    <p className="price">Rs. {bike.price} <span>/day</span></p>
                    <button className="select-btn">
                      {cart.find(b => b._id === bike._id) ? 'Added' : 'Select'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 📋 SIDEBAR */}
        <aside className="expedition-sidebar">
          <div className="sidebar-inner">
            <h3>Summary</h3>
            <div className="ledger-scroll-area">
              {cart.length > 0 ? cart.map(b => (
                <div key={b._id} className="ledger-pill">
                  <span>{b.name}</span>
                  <Trash2 size={16} className="u-del" onClick={(e) => { e.stopPropagation(); toggleSelection(b); }} />
                </div>
              )) : <p className="empty-text">No bikes selected.</p>}
            </div>

            <div className="calculation-stack">
              <div className="calc-item"><span>Duration</span><span>{calculateDays()} Days</span></div>
              <div className="grand-total-box">
                <label>Total Investment</label>
                <h2>Rs. {(calculateDays() * cart.reduce((s, b) => s + b.price, 0)).toLocaleString()}</h2>
              </div>
            </div>

            <button className="btn-finalize" disabled={bookingLoading} onClick={handleProceed}>
              {bookingLoading ? "Loading..." : "Confirm Booking"}
            </button>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {showError && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="error-modal-card">
              <X size={40} color="#ef4444" />
              <h2>Selection Missing</h2>
              <p>Pick a bike and select rental dates.</p>
              <button onClick={() => setShowError(false)} className="btn-modal-close">Got it</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;