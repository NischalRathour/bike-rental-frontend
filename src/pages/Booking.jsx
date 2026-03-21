import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, ShieldCheck, Trash2, Check, 
  ArrowRight, Leaf, Star, Info, Zap, Gauge, MapPin, 
  ChevronRight, CreditCard, Activity, Fuel
} from 'lucide-react';
import "../styles/Booking.css";

const Booking = () => {
  const [bikes, setBikes] = useState([]);
  const [cart, setCart] = useState([]);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // 🏍️ PREMIUM MARKETPLACE DATASET (12 UNITS)
  const premiumFleet = [
    { _id: 'p1', name: 'Royal Enfield Himalayan 450', price: 4500, category: 'Adventure', power: '40 BHP', fuel: '22 km/l', images: ['https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=2070'] },
    { _id: 'p2', name: 'BMW G310 GS', price: 5500, category: 'Adventure', power: '34 BHP', fuel: '28 km/l', images: ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070'] },
    { _id: 'p3', name: 'KTM Duke 390 V3', price: 3800, category: 'Street', power: '45 BHP', fuel: '25 km/l', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070'] },
    { _id: 'p4', name: 'Honda CRF 300L Rally', price: 7500, category: 'Off-Road', power: '27 BHP', fuel: '30 km/l', images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070'] },
    { _id: 'p5', name: 'Kawasaki Ninja 400', price: 8500, category: 'Sport', power: '49 BHP', fuel: '24 km/l', images: ['https://images.unsplash.com/photo-1547549082-6bc09f2049ae?q=80&w=2070'] },
    { _id: 'p6', name: 'Yamaha MT-15 V2', price: 2800, category: 'Hyper-Naked', power: '18 BHP', fuel: '45 km/l', images: ['https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=2070'] },
    { _id: 'p7', name: 'Suzuki V-Strom 250 SX', price: 3500, category: 'Touring', power: '26 BHP', fuel: '32 km/l', images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2070'] },
    { _id: 'p8', name: 'Husqvarna Svartpilen 401', price: 4200, category: 'Scrambler', power: '43 BHP', fuel: '28 km/l', images: ['https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=2070'] },
    { _id: 'p9', name: 'Benelli TRK 502X', price: 9000, category: 'Luxury Touring', power: '47 BHP', fuel: '20 km/l', images: ['https://images.unsplash.com/photo-1614165939092-aa4894336f3c?q=80&w=2070'] },
    { _id: 'p10', name: 'Classic 350 Reborn', price: 3200, category: 'Vintage', power: '20 BHP', fuel: '35 km/l', images: ['https://images.unsplash.com/photo-1623058840906-696232537f81?q=80&w=2070'] },
    { _id: 'p11', name: 'Ducati Scrambler 800', price: 15000, category: 'Icon', power: '73 BHP', fuel: '18 km/l', images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070'] },
    { _id: 'p12', name: 'Aprilla SR 160', price: 1800, category: 'Scooter', power: '11 BHP', fuel: '38 km/l', images: ['https://images.unsplash.com/photo-1594146193798-902f1a6ad8bd?q=80&w=2070'] },
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
    if (cart.length === 0 || !dates.start || !dates.end) return alert("Select fleet and travel dates.");
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
    } catch (err) { alert("Booking Sync Failed."); } 
    finally { setBookingLoading(false); }
  };

  if (loading) return <div className="booking-loading-screen"><div className="loader-pulse"></div><p>Synchronizing Fleet Assets...</p></div>;

  return (
    <div className="booking-v2-root">
      {/* 🧭 NAVIGATION HEADER */}
      <header className="booking-v2-header">
        <div className="header-content-max">
          <div className="brand-intel">
            <h1 className="text-glow">Fleet <span className="text-indigo">Marketplace</span></h1>
            <p>Curated machines for professional Kathmandu expeditions.</p>
          </div>
          <div className="date-orchestrator">
            <div className="date-chip">
              <Calendar size={16}/>
              <input type="date" min={new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, start: e.target.value})} />
            </div>
            <ArrowRight size={18} className="text-slate" />
            <div className="date-chip">
              <Calendar size={16}/>
              <input type="date" min={dates.start} onChange={(e) => setDates({...dates, end: e.target.value})} />
            </div>
          </div>
        </div>
      </header>

      <main className="booking-v2-layout">
        <div className="layout-content-max">
          
          {/* 🏍️ FLEET GRID (LEFT) */}
          <section className="fleet-grid-section">
            <div className="filter-stats-bar">
              <span>Showing {bikes.length} Verified Units</span>
              <div className="active-labels">
                <span className="label-item"><ShieldCheck size={12}/> Insured</span>
                <span className="label-item"><Activity size={12}/> Serviced</span>
              </div>
            </div>

            <div className="premium-bike-grid">
              {bikes.map((bike) => (
                <motion.div 
                  layout
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  key={bike._id} 
                  className={`bike-v2-card ${cart.find(b => b._id === bike._id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(bike)}
                >
                  <div className="card-media-box">
                    <img src={bike.images?.[0]} alt={bike.name} />
                    <div className="category-pill">{bike.category}</div>
                    <AnimatePresence>
                      {cart.find(b => b._id === bike._id) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="selection-overlay-v2">
                          <div className="check-hex"><Check size={32} /></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="card-info-box">
                    <h3>{bike.name}</h3>
                    <div className="spec-row-mini">
                      <span><Zap size={14}/> {bike.power}</span>
                      <span><Fuel size={14}/> {bike.fuel}</span>
                    </div>
                    <div className="price-footer-v2">
                      <div className="price-tag-v2">
                        <span className="currency">Rs.</span>
                        <span className="val">{bike.price.toLocaleString()}</span>
                        <span className="unit">/Day</span>
                      </div>
                      <div className="select-indicator"><ChevronRight size={18}/></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 📊 ITINERARY SIDEBAR (RIGHT) */}
          <aside className="expedition-sidebar">
            <div className="sidebar-sticky-card">
              <div className="sidebar-head">
                <h3>Expedition Summary</h3>
                <div className="mode-badge">{cart.length > 1 ? 'GROUP' : 'SOLO'}</div>
              </div>

              <div className="ledger-scroll-area">
                {cart.length > 0 ? cart.map(b => (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={b._id} className="ledger-pill">
                    <div className="ledger-unit">
                      <div className="u-icon"><Bike size={14}/></div>
                      <span>{b.name}</span>
                    </div>
                    <Trash2 size={16} className="u-del" onClick={() => toggleSelection(b)} />
                  </motion.div>
                )) : (
                  <div className="ledger-empty">
                    <Info size={24} />
                    <p>Select units to calculate expedition costs.</p>
                  </div>
                )}
              </div>

              <div className="sustainability-intel">
                <div className="intel-row"><Leaf size={14}/> <span>{(cart.length * calculateDays() * 2.4).toFixed(1)}kg CO2 Offset</span></div>
                <div className="intel-row"><Star size={14}/> <span>{(cart.length * 50) + (calculateDays() * 10)} Ride Points</span></div>
              </div>

              <div className="total-calculation-box">
                <div className="calc-row"><span>Total Duration</span><strong>{calculateDays()} Days</strong></div>
                <div className="calc-row"><span>Logistics Point</span><strong>Thamel HQ</strong></div>
                <div className="grand-total-display">
                  <p>Grand Total</p>
                  <h2>Rs. {(calculateDays() * cart.reduce((s, b) => s + b.price, 0)).toLocaleString()}</h2>
                </div>
              </div>

              <button 
                className={`btn-finalize ${cart.length === 0 ? 'disabled' : ''}`}
                disabled={bookingLoading || cart.length === 0}
                onClick={handleProceed}
              >
                {bookingLoading ? 'Processing Request...' : 'Finalize Reservation'}
                <CreditCard size={18} />
              </button>
              
              <div className="security-assurance">
                <ShieldCheck size={12}/> Secure Payment • Instant Insurance
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Booking;