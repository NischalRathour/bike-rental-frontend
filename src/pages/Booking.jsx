import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  CreditCard,
  Bike as BikeIcon
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/Booking.css";

const Booking = () => {
  const { id } = useParams(); // This must match the :id in your App.js route
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBike = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Ensure this matches the public route in your backend
        const res = await api.get(`/bikes/${id}`);
        setBike(res.data);
        setError(""); 
      } catch (err) {
        console.error("Fetch Error:", err.response);
        setError("Vehicle not found in the Kathmandu fleet database.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleBooking = async () => {
    setError("");
    
    // 1. Validation
    if (!date) {
        setError("Please select a pickup date.");
        return;
    }
    
    if (!user) {
        alert("Please login as a customer to book a ride.");
        navigate("/login");
        return;
    }

    if (user.role !== 'customer') {
      alert("Administrative accounts cannot create rental bookings.");
      return;
    }

    setBookingLoading(true);
    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));
      const totalPrice = bike.price * days;

      // 2. Submit to backend
      const res = await api.post("/bookings", {
        bike: bike._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        days: Number(days)
      });

      // 3. Navigate to payment with the new booking ID
      if (res.data.success || res.data._id) {
        const bookingId = res.data.booking?._id || res.data._id;
        navigate(`/payment/${bookingId}`);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "System error during booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) return (
    <div className="booking-loader-container">
        <div className="spinner"></div>
        <p>Verifying Vehicle Availability...</p>
    </div>
  );

  if (error && !bike) return (
    <div className="booking-error-screen">
        <Info size={48} color="#ef4444" />
        <h2>Vehicle Unreachable</h2>
        <p>{error}</p>
        <Link to="/bikes" className="btn-back">Browse Other Bikes</Link>
    </div>
  );

  return (
    <div className="booking-page-wrapper">
      <div className="container-managed">
        
        <Link to="/bikes" className="back-link">
          <ArrowLeft size={18} /> Back to Fleet Explorer
        </Link>

        <div className="booking-split-layout">
          
          {/* 🏍️ LEFT: VEHICLE SUMMARY */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="booking-summary-side"
          >
            <div className="summary-card">
              <div className="summary-img-box">
                <img src={bike.images?.[0] || "/images/default-bike.jpg"} alt={bike.name} />
                <div className="category-label">{bike.type || "Premium"}</div>
              </div>
              <div className="summary-text">
                <h2>{bike.name}</h2>
                <div className="loc-info">
                   <ShieldCheck size={16} color="#10b981" /> 
                   <span>Verified & Insured Ride</span>
                </div>
              </div>
            </div>

            <div className="booking-info-alert">
              <Info size={20} />
              <p>Cancellation Policy: Full refund if cancelled 24h before pickup.</p>
            </div>
          </motion.div>

          {/* 💳 RIGHT: BOOKING CONFIGURATOR */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="booking-form-side"
          >
            <div className="checkout-card">
              <div className="checkout-header">
                <h3>Reservation Details</h3>
                <span className="live-tag">LIVE PRICE</span>
              </div>
              
              <div className="form-grid">
                <div className="m-input-group">
                  <label><Calendar size={14}/> Pickup Date</label>
                  <input 
                    type="date" 
                    required
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>

                <div className="m-input-group">
                  <label><Clock size={14}/> Duration (Days)</label>
                  <input 
                    type="number" 
                    required
                    min="1" 
                    value={days} 
                    onChange={(e) => setDays(Math.max(1, e.target.value))} 
                  />
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Standard Daily Rate</span>
                  <span>Rs. {bike.price}</span>
                </div>
                <div className="price-row">
                  <span>Insurance & Service</span>
                  <span className="free">INCLUDED</span>
                </div>
                <div className="price-row total">
                  <span>Total Payable</span>
                  <span className="price-amt">Rs. {bike.price * days}</span>
                </div>
              </div>

              {error && <p className="booking-error-msg">{error}</p>}

              <button 
                className="btn-confirm-booking" 
                onClick={handleBooking} 
                disabled={bookingLoading || !date}
              >
                {bookingLoading ? "Processing Transaction..." : "Confirm & Proceed to Payment"}
                <CreditCard size={18} />
              </button>
              
              <p className="secure-text">
                <ShieldCheck size={14} /> PCI-DSS Compliant Encryption
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;