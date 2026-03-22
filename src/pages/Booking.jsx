import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, ShieldCheck, Trash2, Check, 
  ArrowRight, Leaf, Star, Info, Zap, 
  ChevronRight, CreditCard, Activity, Fuel, X
} from 'lucide-react';
import "../styles/Booking.css";

const Booking = () => {
  const [bikes, setBikes] = useState([]);
  const [cart, setCart] = useState([]);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const premiumFleet = [
    { _id: 'p1', name: 'Royal Enfield Himalayan 450', price: 4500, category: 'Adventure', power: '40 BHP', fuel: '22 km/l', images: ['https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=2070'] },
    { _id: 'p2', name: 'BMW G310 GS', price: 5500, category: 'Adventure', power: '34 BHP', fuel: '28 km/l', images: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070'] },
    { _id: 'p3', name: 'KTM Duke 390 V3', price: 3800, category: 'Street', power: '45 BHP', fuel: '25 km/l', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070'] },
    { _id: 'p4', name: 'Honda CRF 300L Rally', price: 7500, category: 'Off-Road', power: '27 BHP', fuel: '30 km/l', images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070'] },
    { _id: 'p5', name: 'Kawasaki Ninja 400', price: 8500, category: 'Sport', power: '49 BHP', fuel: '24 km/l', images: ['https://images.unsplash.com/photo-1547549082-6bc09f2049ae?q=80&w=2070'] },
    { _id: 'p6', name: 'Yamaha MT-15 V2', price: 2800, category: 'Hyper-Naked', power: '18 BHP', fuel: '45 km/l', images: ['https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=2070'] }
  ];

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const res = await api.get('/bikes');
        const dbBikes = res.data.bikes || res.data;
        setBikes(dbBikes.length > 0 ? dbBikes : premiumFleet);
      } catch (err) { 
        setBikes(premiumFleet); 
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
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
      console.error("Booking Sync Failed.");
    } finally { setBookingLoading(false); }
  };

  if (loading) return (
    <div className="booking-loading-screen">
      <div className="loader-pulse"></div>
      <p>Synchronizing Asset Ledger...</p>
    </div>
  );

  return (
    <div className="booking-v2-root">
      {/* 🧭 NAVIGATION HEADER - SLIM & INTEGRATED */}
      <header className="booking-v2-header">
        <div className="header-left">
          <h1 className="text-glow">Fleet <span className="text-indigo">Marketplace</span></h1>
          <div className="live-node-tag"><div className="pulse-dot"></div> KATHMANDU HQ</div>
        </div>
        
        <div className="date-orchestrator">
          <div className="date-chip">
            <Calendar size={14}/>
            <input type="date" min={new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, start: e.target.value})} />
          </div>
          <ArrowRight size={14} className="text-slate" />
          <div className="date-chip">
            <Calendar size={14}/>
            <input type="date" min={dates.start} onChange={(e) => setDates({...dates, end: e.target.value})} />
          </div>
        </div>
      </header>

      <main className="booking-v2-layout">
        {/* 🏍️ FLEET GALLERY */}
        <section className="fleet-grid-section">
          <div className="section-intro">
            <h2>Select Your Machines</h2>
            <p>High-performance units verified for cross-terrain endurance.</p>
          </div>

          <div className="premium-bike-grid">
            {bikes.map((bike) => (
              <motion.div 
                layout
                whileHover={{ x: 10 }}
                key={bike._id} 
                className={`bike-v2-card ${cart.find(b => b._id === bike._id) ? 'selected' : ''}`}
                onClick={() => toggleSelection(bike)}
              >
                <div className="card-media-box">
                  <img src={bike.images?.[0]} alt={bike.name} />
                  <div className="category-pill">{bike.category}</div>
                </div>

                <div className="card-info-box">
                  <div className="card-header-row">
                    <h3>{bike.name}</h3>
                    <AnimatePresence>
                      {cart.find(b => b._id === bike._id) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-badge">
                          <Check size={14} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="spec-row-mini">
                    <span><Zap size={12}/> {bike.power}</span>
                    <span><Fuel size={12}/> {bike.fuel}</span>
                  </div>

                  <div className="price-footer-v2">
                    <div className="price-tag-v2">
                      <span className="currency">Rs.</span>
                      <span className="val">{bike.price.toLocaleString()}</span>
                      <span className="unit">/Day</span>
                    </div>
                    <button className="select-btn">
                      {cart.find(b => b._id === bike._id) ? 'Selected' : 'Add to Fleet'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 📊 EXPEDITION LEDGER (STICKY SIDEBAR) */}
        <aside className="expedition-sidebar">
          <div className="sidebar-inner">
            <div className="sidebar-head">
              <h3>Expedition Ledger</h3>
              <p>Thamel Base Operations</p>
            </div>

            <div className="ledger-scroll-area">
              {cart.length > 0 ? cart.map(b => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={b._id} className="ledger-pill">
                  <div className="ledger-unit">
                    <div className="unit-icon"><Bike size={14}/></div>
                    <span>{b.name}</span>
                  </div>
                  <Trash2 size={14} className="u-del" onClick={(e) => { e.stopPropagation(); toggleSelection(b); }} />
                </motion.div>
              )) : (
                <div className="ledger-empty">
                  <div className="empty-icon"><Info size={24} /></div>
                  <p>Awaiting machine selection to synchronize ledger.</p>
                </div>
              )}
            </div>

            <div className="calculation-stack">
              <div className="calc-item">
                <span>Travel Duration</span>
                <span>{calculateDays()} Days</span>
              </div>
              <div className="calc-item">
                <span>Eco Offset</span>
                <span className="text-emerald">{(cart.length * calculateDays() * 1.2).toFixed(1)} kg</span>
              </div>
              <div className="grand-total-box">
                <label>Total Investment</label>
                <h2>Rs. {(calculateDays() * cart.reduce((s, b) => s + b.price, 0)).toLocaleString()}</h2>
              </div>
            </div>

            <button 
              className={`btn-finalize ${cart.length === 0 ? 'disabled' : ''}`}
              disabled={bookingLoading}
              onClick={handleProceed}
            >
              {bookingLoading ? "Processing..." : "Confirm Reservation"}
              <CreditCard size={18} />
            </button>
          </div>
        </aside>
      </main>

      {/* 🛠️ ERROR MODAL */}
      <AnimatePresence>
        {showError && (
          <div className="modal-overlay-blur">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="error-modal-card">
              <div className="modal-icon-wrap"><X size={32} /></div>
              <h2>Data Mismatch</h2>
              <p>Please select at least one unit and verify expedition dates.</p>
              <button onClick={() => setShowError(false)} className="btn-modal-close">Acknowledge</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;