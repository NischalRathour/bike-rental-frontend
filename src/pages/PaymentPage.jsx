import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../api/paymentApi'; 
import Payment from '../components/Payment';
import { 
  ShieldCheck, ChevronLeft, Bike, Calendar, 
  Cpu, Lock, Globe, CreditCard
} from 'lucide-react';
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

  const handleSuccess = async (paymentId) => {
    try {
      await paymentApi.post(`/payments/confirm`, { bookingId, paymentId });
      const confirmationData = {
        bookingId,
        bikeName: booking?.bikes?.[0]?.name || "Premium Bike",
        bikeImage: booking?.bikes?.[0]?.images?.[0],
        startDate: booking?.startDate,
        endDate: booking?.endDate,
        totalPrice: booking?.totalPrice,
        transactionId: paymentId
      };
      localStorage.setItem("latest_booking_data", JSON.stringify(confirmationData));
      navigate('/booking-confirmation', { state: confirmationData, replace: true });
    } catch (err) {
      navigate('/customer'); 
    }
  };

  if (loading) return (
    <div className="pay-loader-hub">
      <div className="spinner-quantum"></div>
      <p>Loading payment details...</p>
    </div>
  );

  return (
    <div className="marketplace-pay-root">
      <div className="pay-content-grid">
        
        {/* --- LEFT: CHECKOUT AREA --- */}
        <div className="hub-main-section">
          <button onClick={() => navigate(-1)} className="hub-back-action">
            <ChevronLeft size={14}/> <span>Back to Booking</span>
          </button>

          <header className="hub-header">
            <h1 className="hub-title">Secure <span className="text-indigo">Payment</span></h1>
            <p className="hub-subtitle">Please complete your payment to confirm the rental.</p>
          </header>

          {/* 💳 VISUAL CREDIT CARD */}
          <div className="visa-container-compact">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="platinum-card-visual"
            >
              <div className="p-card-top">
                <div className="p-chip-set">
                  <Cpu size={28} className="gold-icon" />
                  <Globe size={14} className="nfc-icon" />
                </div>
                <div className="p-brand">PREMIUM MEMBER</div>
              </div>
              <div className="p-card-number">•••• •••• •••• 8842</div>
              <div className="p-card-bottom">
                <div className="p-meta">
                  <label>CARD HOLDER</label>
                  <strong>{booking?.user?.name || "Valued Rider"}</strong>
                </div>
                <div className="p-card-brand-logo">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="vault-engine-wrapper">
              <div className="terminal-label"><Lock size={12}/> ENCRYPTED CHECKOUT</div>
              <Payment 
                amount={booking?.totalPrice} 
                bookingId={bookingId} 
                onSuccess={handleSuccess} 
              />
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR SUMMARY --- */}
        <aside className="hub-sidebar-section">
           <div className="sidebar-sticky-inner">
              <div className="invoice-header-premium">
                <h3>Order Summary</h3>
                <div className="badge-verified"><ShieldCheck size={12}/> SECURE</div>
              </div>

              <div className="invoice-body">
                <div className="asset-summary-box">
                   <div className="asset-icon"><Bike size={20}/></div>
                   <div className="asset-info">
                      <label>Selected Bike</label>
                      <p>{booking?.bikes?.[0]?.name || "Standard Model"}</p>
                   </div>
                </div>

                <div className="asset-summary-box">
                   <div className="asset-icon"><Calendar size={20}/></div>
                   <div className="asset-info">
                      <label>Rental Dates</label>
                      <p>{new Date(booking?.startDate).toLocaleDateString()} — {new Date(booking?.endDate).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="cost-breakdown">
                   <div className="cost-row"><span>Service Fee</span><span className="text-free">FREE</span></div>
                   <div className="cost-row"><span>Insurance</span><span className="text-free">INCLUDED</span></div>
                </div>

                <div className="total-due-area">
                   <label>TOTAL AMOUNT</label>
                   <h2>Rs. {booking?.totalPrice?.toLocaleString()}</h2>
                </div>
              </div>

              <div className="marketplace-trust-footer">
                 <div className="trust-icons">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" height="15" />
                 </div>
                 <p>Your data is protected by industry-standard encryption.</p>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default PaymentPage;