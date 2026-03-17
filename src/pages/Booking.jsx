import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bikesData } from "../data/fleet"; // ✅ IMPORT LOCAL DATA
import api from "../api/axiosConfig";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  CreditCard,
  Bike as BikeIcon,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBikeDetails = () => {
      setLoading(true);
      try {
        // ✅ FIX: Find the bike in your local fleet.js instead of calling API
        const selectedBike = bikesData.find((b) => b._id === id);
        
        if (selectedBike) {
          setBike(selectedBike);
          setError("");
        } else {
          setError("Vehicle configuration not found in local fleet.");
        }
      } catch (err) {
        setError("Error loading vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBikeDetails();
    }
  }, [id]);

  const handleBooking = async () => {
    setError("");
    
    if (!date) {
        setError("Please select a valid pickup date.");
        return;
    }
    
    if (!user) {
        alert("Authentication required. Redirecting to login...");
        navigate("/login");
        return;
    }

    if (user.role !== 'customer') {
      setError("Action restricted to Customer accounts only.");
      return;
    }

    setBookingLoading(true);
    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));
      const totalPrice = bike.price * days;

      /**
       * ⚠️ NOTE: 
       * Your backend might still throw a 400 error here because it expects 
       * a MongoDB ObjectId for the 'bike' field. 
       * For the demo, ensure your backend Booking model handles the string "b1".
       */
      const res = await api.post("/bookings", {
        bikeId: bike._id, 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        days: Number(days)
      });

      if (res.data) {
        const bookingId = res.data.booking?._id || res.data._id;
        // Pass data to confirmation/payment via state
        navigate(`/payment/${bookingId}`, { 
          state: { 
            bikeName: bike.name,
            totalPrice: totalPrice 
          } 
        });
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. System could not create reservation.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) return (
    <div className="booking-loader-container">
        <div className="spinner-premium"></div>
        <p>Initializing Secure Checkout...</p>
    </div>
  );

  if (error && !bike) return (
    <div className="booking-error-screen">
        <Info size={48} color="#ef4444" />
        <h2>Fleet Sync Error</h2>
        <p>{error}</p>
        <Link to="/bikes" className="btn-back-premium">Explore Other Vehicles</Link>
    </div>
  );

  return (
    <div className="booking-page-root">
      <div className="container-managed">
        
        <Link to={`/bikes/${id}`} className="back-link-premium">
          <ArrowLeft size={16} /> Back to Technical Specs
        </Link>

        <div className="booking-premium-layout">
          
          {/* 🏍️ LEFT: SUMMARY SIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="booking-info-section"
          >
            <div className="vehicle-summary-card">
              <div className="summary-img-wrapper">
                <img 
                  src={bike.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"} 
                  alt={bike.name} 
                />
                <span className="type-pill">{bike.type}</span>
              </div>
              <div className="summary-content">
                <h2>{bike.name}</h2>
                <div className="trust-badges">
                  <div className="badge"><CheckCircle2 size={14}/> Professional Inspection</div>
                  <div className="badge"><CheckCircle2 size={14}/> Sanitized Gear</div>
                </div>
              </div>
            </div>

            <div className="benefits-card">
              <h3>Rental Inclusions</h3>
              <ul>
                <li><ShieldCheck size={16}/> Basic Collision Protection</li>
                <li><ShieldCheck size={16}/> 24/7 Roadside Assistance</li>
                <li><ShieldCheck size={16}/> Transparent Pricing (No Hidden Fees)</li>
              </ul>
            </div>
          </motion.div>

          {/* 💳 RIGHT: CONFIGURATOR SIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="booking-config-section"
          >
            <div className="checkout-glass-card">
              <div className="checkout-header-managed">
                <h3>Reservation Details</h3>
                <span className="live-status">Secure Checkout</span>
              </div>
              
              <div className="booking-inputs-grid">
                <div className="booking-input-box">
                  <label><Calendar size={14}/> Pickup Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>

                <div className="booking-input-box">
                  <label><Clock size={14}/> Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={days} 
                    onChange={(e) => setDays(Math.max(1, e.target.value))} 
                  />
                </div>
              </div>

              <div className="billing-summary">
                <div className="bill-row">
                  <span>Daily Rate</span>
                  <span>Rs. {bike.price}</span>
                </div>
                <div className="bill-row">
                  <span>Service Fee</span>
                  <span className="free">WAIVED</span>
                </div>
                <div className="bill-total">
                  <span>Grand Total</span>
                  <span className="total-val">Rs. {bike.price * days}</span>
                </div>
              </div>

              {error && <div className="error-alert-box">{error}</div>}

              <button 
                className="btn-pay-trigger" 
                onClick={handleBooking} 
                disabled={bookingLoading || !date}
              >
                {bookingLoading ? "Generating Invoice..." : "Verify & Proceed to Payment"}
                <CreditCard size={18} />
              </button>
              
              <div className="security-footer">
                <ShieldCheck size={14} /> 
                <span>End-to-End Encrypted Transaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;