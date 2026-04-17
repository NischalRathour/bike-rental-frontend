import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, Trash2, Check, ArrowRight, 
  Users, Gauge, MapPin, CheckCircle, X, AlertCircle, Sparkles, Fuel
} from 'lucide-react';
import "../styles/Booking.css";

const Booking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'solo'; 

  const [bikes, setBikes] = useState([]);
  const [cart, setCart] = useState(location.state?.initialBike ? [location.state.initialBike] : []);
  const [dates, setDates] = useState(location.state?.selectedDates || { start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const syncFleet = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bikes');
        const dbBikes = res.data.bikes || res.data;
        setBikes(dbBikes);
        
        if (id && cart.length === 0) {
          const target = dbBikes.find(b => String(b._id) === String(id));
          if (target) setCart([target]);
        }
      } catch (err) {
        console.error("Fleet sync failed");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    syncFleet();
  }, [id]);

  const toggleSelection = (bike) => {
    if (mode === 'solo') {
      setCart([bike]);
    } else {
      const exists = cart.find(b => b._id === bike._id);
      setCart(exists ? cart.filter(i => i._id !== bike._id) : [...cart, bike]);
    }
  };

  const calculateDays = () => {
    if (!dates.start || !dates.end) return 1;
    const days = Math.ceil((new Date(dates.end) - new Date(dates.start)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const handleFinalSubmit = async () => {
    if (cart.length === 0 || !dates.start || !dates.end) {
      alert("Please select dates and at least one bike!");
      return;
    }
    
    setBookingLoading(true);
    try {
      const totalPrice = calculateDays() * cart.reduce((s, b) => s + b.price, 0);
      const payload = {
        bikeIds: cart.map(b => b._id),
        startDate: dates.start,
        endDate: dates.end,
        totalPrice: totalPrice
      };
      
      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        navigate(`/payment/${res.data.booking._id}`);
      }
    } catch (err) {
      alert("Booking Error: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="booking-loading-screen">
      <div className="premium-loader">
        <div className="inner-ring"></div>
        <Sparkles className="loader-icon" />
      </div>
      <p>Curating your experience...</p>
    </div>
  );

  return (
    <div className="booking-v2-root">
      {/* 📅 NAVIGATION & DATE ORCHESTRATOR */}
      <section className="booking-top-nav">
        <div className="nav-inner container-max">
          <div className="nav-title-group">
             <span className="mode-pill">{mode === 'solo' ? 'Solo' : 'Group'} Journey</span>
             <h2>{mode === 'solo' ? 'Finalize Selection' : 'Fleet Orchestration'}</h2>
          </div>

          <div className="date-orchestrator-v3">
            <div className="date-box">
              <Calendar size={16} />
              <input type="date" value={dates.start} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, start: e.target.value})} />
            </div>
            <div className="date-sep"><ArrowRight size={16} /></div>
            <div className="date-box">
              <Calendar size={16} />
              <input type="date" value={dates.end} min={dates.start || new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, end: e.target.value})} />
            </div>
          </div>
        </div>
      </section>

      <main className="booking-v2-main container-max">
        {/* 🏍️ LEFT SIDE: SELECTION */}
        <section className="selection-area">
          {mode === 'solo' ? (
            <div className="solo-focus-layout">
              {cart[0] ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="solo-premium-card">
                  <div className="solo-media">
                    <img src={cart[0].images?.[0] || "/images/default-bike.jpg"} alt="Selected" />
                    <div className="media-overlay">
                       <div className="verified-chip"><CheckCircle size={14} /> Ready for Dispatch</div>
                    </div>
                  </div>
                  <div className="solo-content">
                    <div className="content-header">
                      <h3>{cart[0].name}</h3>
                      <p className="type-label">{cart[0].type} • Premium Grade</p>
                    </div>
                    <div className="specs-grid">
                      <div className="spec-item"><Gauge size={18} /> <span>{cart[0].cc}cc Displacement</span></div>
                      <div className="spec-item"><Fuel size={18} /> <span>Standard Fuel</span></div>
                      <div className="spec-item"><MapPin size={18} /> <span>Kathmandu Hub</span></div>
                    </div>
                    <div className="price-anchor">
                       <span className="p-val">Rs. {cart[0].price}</span>
                       <span className="p-unit">/ Day</span>
                    </div>
                    <Link to={`/book/${id}?mode=group`} className="btn-switch-mode">
                       <Users size={16} /> Orchestrate a Group Trip instead?
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="empty-state-card">
                   <AlertCircle size={48} />
                   <p>Machine not found. Return to showroom.</p>
                   <Link to="/bikes">View Fleet</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="group-grid-layout">
              <div className="group-header">
                <h3>Select Your Squad's Machines</h3>
                <p>Click machines to add or remove from your fleet.</p>
              </div>
              <div className="fleet-masonry">
                {bikes.map((bike) => (
                  <motion.div 
                    whileHover={{ y: -8 }}
                    key={bike._id} 
                    className={`fleet-item-card ${cart.find(b => b._id === bike._id) ? 'active' : ''}`} 
                    onClick={() => toggleSelection(bike)}
                  >
                    <div className="item-media">
                      <img src={bike.images?.[0]} alt={bike.name} />
                      {cart.find(b => b._id === bike._id) && (
                        <div className="item-selected-overlay"><Check size={32} /></div>
                      )}
                    </div>
                    <div className="item-info">
                      <h4>{bike.name}</h4>
                      <p>Rs. {bike.price} / Day</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 📋 RIGHT SIDE: SIDEBAR */}
        <aside className="summary-sidebar-v3">
          <div className="sidebar-content">
            <div className="summary-title">
               <h3>Expedition Summary</h3>
               <Sparkles size={18} className="spark-icon" />
            </div>

            <div className="ledger-scroll">
              <AnimatePresence>
                {cart.length > 0 ? cart.map(b => (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    exit={{ x: -20, opacity: 0 }} 
                    key={b._id} 
                    className="ledger-item"
                  >
                    <div className="item-name">
                      <div className="dot"></div>
                      <span>{b.name}</span>
                    </div>
                    {mode === 'group' && <button onClick={() => toggleSelection(b)} className="del-btn"><Trash2 size={14}/></button>}
                  </motion.div>
                )) : <p className="ledger-empty">Your fleet is empty...</p>}
              </AnimatePresence>
            </div>

            <div className="calculation-zone">
              <div className="calc-row"><span>Journey Duration</span><span>{calculateDays()} Days</span></div>
              <div className="calc-row"><span>Selection Type</span><span>{mode === 'solo' ? 'Solo' : 'Group'}</span></div>
              
              <div className="total-reveal">
                <label>Total Investment</label>
                <h2>Rs. {(calculateDays() * cart.reduce((s, b) => s + b.price, 0)).toLocaleString()}</h2>
              </div>

              <button className="btn-confirm-final" onClick={handleFinalSubmit} disabled={bookingLoading}>
                {bookingLoading ? (
                  <div className="btn-loader"></div>
                ) : (
                  <><span>Confirm Expedition</span> <ArrowRight size={18} /></>
                )}
              </button>
              <p className="secure-note">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Booking;