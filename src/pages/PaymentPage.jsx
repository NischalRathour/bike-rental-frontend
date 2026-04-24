import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../api/paymentApi'; 
import Payment from '../components/Payment';
import { ChevronLeft, Sparkles, Lock, ShieldCheck, Bike, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await paymentApi.get(`/bookings/${bookingId}`);
        setBooking(data.booking || data);
      } catch (err) { 
        console.error("Fetch Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentId) => {
    try {
      // 🚨 DYNAMIC SYNC: Tell Backend to update status to "Paid" in MongoDB
      const { data } = await paymentApi.post(`/payments/confirm`, { bookingId, paymentId });
      
      if (data.success) {
        const b = data.booking;
        const payload = {
          bookingId: b._id,
          bikeName: b.bikes?.length > 0 ? b.bikes.map(bike => bike.name).join(", ") : b.tour?.name,
          startDate: b.startDate,
          endDate: b.endDate,
          totalPrice: b.totalPrice,
          transactionId: paymentId,
          bookingType: b.bookingType
        };

        // Save to local storage for persistence on refresh
        localStorage.setItem("last_expedition", JSON.stringify(payload));
        
        // Final Redirect to the Elite Pass page
        navigate('/booking-confirmation', { state: payload, replace: true });
      }
    } catch (err) {
      console.error("Confirmation Error:", err);
      alert("Payment successful but database update failed. Please check your dashboard.");
      navigate('/customer');
    }
  };

  if (loading) return <div className="pay-loader-hub"><div className="neon-spinner"></div></div>;

  return (
    <div className="marketplace-pay-root">
      <div className="pay-content-grid">
        <div className="hub-main-section">
          <button onClick={() => navigate(-1)} className="hub-back-action">
            <ChevronLeft size={16}/> <span>Back to Fleet</span>
          </button>
          <header className="hub-header">
            <span className="secure-tag"><Sparkles size={14}/> PREMIUM ENCRYPTION</span>
            <h1 className="hub-title">Authorize <span className="text-indigo">Reservation</span></h1>
          </header>
          <div className="vault-engine-wrapper">
            <div className="terminal-label"><Lock size={14}/> GATEWAY STATUS: ACTIVE</div>
            <Payment 
                amount={booking?.totalPrice} 
                bookingId={bookingId} 
                onSuccess={handlePaymentSuccess} 
            />
          </div>
        </div>
        <aside className="hub-sidebar-section">
           <div className="sidebar-sticky-inner">
              <div className="invoice-header-premium">
                <h3>{booking?.bookingType} Summary</h3>
                <div className="badge-verified">SECURE</div>
              </div>
              <div className="total-due-area">
                <label>DYNAMIC TOTAL DUE</label>
                <h2>Rs. {booking?.totalPrice?.toLocaleString()}</h2>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;