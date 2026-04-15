import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, Trash2, Check, ArrowRight, 
  Users, Gauge, MapPin, CheckCircle, X, AlertCircle 
} from 'lucide-react';
import "../styles/Booking.css";

const Booking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // ✅ Mode detection: 'solo' or 'group'
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
        
        // Auto-select the bike from URL if the cart is empty
        if (id && cart.length === 0) {
          const target = dbBikes.find(b => String(b._id) === String(id));
          if (target) setCart([target]);
        }
      } catch (err) {
        console.error("Fleet sync failed");
      } finally {
        setLoading(false);
      }
    };
    syncFleet();
  }, [id]);

  // ✅ LOGIC: Group Selection Toggle
  const toggleSelection = (bike) => {
    if (mode === 'solo') {
      setCart([bike]); // In solo, clicking another bike just replaces the current one
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

  if (loading) return <div className="booking-loading-screen"><div className="loader-pulse"></div></div>;

  return (
    <div className="booking-v2-root">
      {/* 📅 SHARED DATE BAR */}
      <section className="booking-action-bar">
        <div className="action-bar-container">
          <div className="action-title">
            <h2>{mode === 'solo' ? 'Solo Ride Dates' : 'Group Expedition Dates'}</h2>
          </div>
          <div className="date-orchestrator">
            <div className="date-chip">
              <Calendar size={18}/>
              <input type="date" value={dates.start} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, start: e.target.value})} />
            </div>
            <ArrowRight size={18} />
            <div className="date-chip">
              <Calendar size={18}/>
              <input type="date" value={dates.end} min={dates.start || new Date().toISOString().split('T')[0]} onChange={(e) => setDates({...dates, end: e.target.value})} />
            </div>
          </div>
        </div>
      </section>

      <main className="booking-v2-layout">
        <section className="fleet-grid-section">
          
          {/* ✅ DYNAMIC VIEW LOGIC */}
          {mode === 'solo' ? (
            <div className="solo-exclusive-view">
              <div className="section-intro">
                <h1>Confirm Solo Selection</h1>
                <p>Review your selected machine for the Kathmandu valley ride.</p>
              </div>
              {cart[0] ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="solo-final-card-premium">
                  <img src={cart[0].images?.[0]} alt="Bike" />
                  <div className="solo-details">
                    <div className="badge-confirmed"><CheckCircle size={14}/> Verified Unit</div>
                    <h2>{cart[0].name}</h2>
                    <div className="solo-specs-list">
                      <span>{cart[0].cc}cc</span> • <span>{cart[0].type}</span>
                    </div>
                    <div className="solo-price-highlight">Rs. {cart[0].price} / Day</div>
                    <Link to={`/book/${id}?mode=group`} className="mode-switch-link">
                      <Users size={16} /> Need more bikes for a team ride?
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="error-msg">Bike not found. Please return to <Link to="/bikes">Fleet</Link>.</div>
              )}
            </div>
          ) : (
            /* 👥 FULL GROUP SELECTION GRID */
            <div className="group-selection-view">
              <div className="section-intro">
                <h1>Build Your Team Fleet</h1>
                <p>Click on the bikes below to add them to your group booking.</p>
              </div>
              <div className="premium-bike-grid">
                {bikes.map((bike) => (
                  <motion.div 
                    layout
                    key={bike._id} 
                    className={`bike-v2-card ${cart.find(b => b._id === bike._id) ? 'selected' : ''}`} 
                    onClick={() => toggleSelection(bike)}
                  >
                    <div className="card-media-box">
                      <img src={bike.images?.[0]} alt={bike.name} />
                      {cart.find(b => b._id === bike._id) && (
                        <div className="selection-overlay"><Check size={32} color="white" /></div>
                      )}
                    </div>
                    <div className="card-info-box">
                      <h3>{bike.name}</h3>
                      <p>Rs. {bike.price} <span>/day</span></p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 📋 SIDEBAR SUMMARY (Works for both) */}
        <aside className="expedition-sidebar">
          <div className="sidebar-inner">
            <h3>{mode === 'solo' ? 'Solo Summary' : 'Group Summary'}</h3>
            <div className="ledger-scroll-area">
              {cart.length > 0 ? cart.map(b => (
                <div key={b._id} className="ledger-pill">
                  <span>{b.name}</span>
                  <Trash2 size={16} className="u-del" onClick={(e) => { e.stopPropagation(); toggleSelection(b); }} />
                </div>
              )) : <p className="empty-text">Select bikes to start.</p>}
            </div>

            <div className="calculation-stack">
              <div className="calc-item">
                <span>Mode</span>
                <span className="mode-badge">{mode === 'solo' ? 'Solo Ride' : 'Group Expedition'}</span>
              </div>
              <div className="calc-item"><span>Duration</span><span>{calculateDays()} Days</span></div>
              <div className="grand-total-box">
                <label>Total Payment</label>
                <h2>Rs. {(calculateDays() * cart.reduce((s, b) => s + b.price, 0)).toLocaleString()}</h2>
              </div>
            </div>

            <button className="btn-finalize" onClick={handleFinalSubmit} disabled={bookingLoading}>
              {bookingLoading ? "Finalizing..." : "Confirm & Pay Now"}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Booking;