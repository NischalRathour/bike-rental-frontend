import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, Calendar, Trash2, Check, ArrowRight, 
  Users, Gauge, MapPin, CheckCircle, AlertCircle, Sparkles, Fuel, Loader2
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
        setBikes(dbBikes || []);
        
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
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1; 
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const bikesPrice = cart.reduce((total, bike) => total + (Number(bike.price) || 0), 0);
    return days * bikesPrice;
  };

  const handleFinalSubmit = async () => {
    const finalPrice = calculateTotal();

    if (cart.length === 0 || !dates.start || !dates.end) {
      alert("⚠️ Expedition Logic: Select machine and dates first.");
      return;
    }
    
    setBookingLoading(true);
    try {
      // ✅ ATOMIC PAYLOAD: Correctly formatted for String ID Schema
      const payload = {
        bikeIds: cart.map(b => String(b._id)), 
        startDate: dates.start,
        endDate: dates.end,
        totalPrice: finalPrice,
        bookingType: mode === 'solo' ? 'Solo' : 'Group'
      };
      
      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        navigate(`/payment/${res.data.booking._id}`, { state: { amount: finalPrice } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Handshake Failed: ID Mismatch";
      alert("⚠️ Error: " + msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="booking-loading-screen">
      <div className="premium-loader"><div className="inner-ring"></div><Sparkles className="loader-icon" /></div>
      <p>Finalizing Fleet Ledger...</p>
    </div>
  );

  return (
    <div className="booking-v2-root">
      <section className="booking-top-nav">
        <div className="nav-inner container-max">
          <div className="nav-title-group">
             <span className="mode-pill">{mode === 'solo' ? 'Solo' : 'Group'}</span>
             <h2>Expedition Booking</h2>
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
        <section className="selection-area">
          {mode === 'solo' ? (
            <div className="solo-focus-layout">
              {cart[0] && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="solo-premium-card">
                  <div className="solo-media">
                    <img src={cart[0].images?.[0] || "/images/default-bike.jpg"} alt="" />
                    <div className="media-overlay"><div className="verified-chip"><CheckCircle size={14} /> Ready</div></div>
                  </div>
                  <div className="solo-content">
                    <h3>{cart[0].name}</h3>
                    <div className="specs-grid">
                      <div className="spec-item"><Gauge size={18} /> <span>{cart[0].cc}cc</span></div>
                      <div className="spec-item"><MapPin size={18} /> <span>Kathmandu Hub</span></div>
                    </div>
                    <div className="price-anchor"><span>Rs. {cart[0].price}</span><small>/ Day</small></div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="group-grid-layout">
              <div className="fleet-masonry">
                {bikes.map((bike) => (
                  <div key={bike._id} className={`fleet-item-card ${cart.find(b => b._id === bike._id) ? 'active' : ''}`} onClick={() => toggleSelection(bike)}>
                    <img src={bike.images?.[0]} alt="" />
                    <div className="item-info"><h4>{bike.name}</h4><p>Rs. {bike.price}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="summary-sidebar-v3">
          <div className="sidebar-content">
            <h3>Expedition Ledger</h3>
            <div className="ledger-scroll">
              {cart.map(b => (
                <div key={b._id} className="ledger-item">
                  <span>{b.name}</span>
                  {mode === 'group' && <button onClick={() => toggleSelection(b)}><Trash2 size={14}/></button>}
                </div>
              ))}
            </div>
            <div className="calculation-zone">
              <div className="calc-row"><span>Journey Duration</span><span>{calculateDays()} Days</span></div>
              <div className="total-reveal"><label>Total Investment</label><h2>Rs. {calculateTotal().toLocaleString()}</h2></div>
              <button className="btn-confirm-final" onClick={handleFinalSubmit} disabled={bookingLoading}>
                {bookingLoading ? <Loader2 className="spinner-icon" /> : "Confirm Expedition"}
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Booking;