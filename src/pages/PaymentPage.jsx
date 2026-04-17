import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../api/paymentApi'; 
import Payment from '../components/Payment';
import { 
  ShieldCheck, ChevronLeft, Bike, Calendar, 
  Cpu, Lock, Globe, CreditCard, Sparkles, MapPin
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
        transactionId: paymentId,
        bookingType: booking?.mode || 'Solo'
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
      <p className="loading-text">AUTHENTICATING SECURE SESSION...</p>
    </div>
  );

  return (
    <div className="marketplace-pay-root">
      <div className="pay-content-grid">
        
        {/* --- LEFT: CHECKOUT AREA --- */}
        <div className="hub-main-section">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)} 
            className="hub-back-action"
          >
            <ChevronLeft size={16}/> <span>Back to Fleet</span>
          </motion.button>

          <header className="hub-header">
            <span className="secure-tag"><Sparkles size={14}/> PREMIUM CHECKOUT</span>
            <h1 className="hub-title">Finalize <span className="text-indigo">Reservation</span></h1>
            <p className="hub-subtitle">Authorize your expedition by completing the secure transaction below.</p>
          </header>

          {/* 💳 VISUAL CREDIT CARD */}
          <div className="visa-container-compact">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="platinum-card-visual"
            >
              <div className="p-card-top">
                <div className="p-chip-set">
                  <Cpu size={32} className="gold-icon" />
                  <Globe size={16} className="nfc-icon" />
                </div>
                <div className="p-brand">ELITE MEMBER</div>
              </div>
              <div className="p-card-number">•••• •••• •••• {bookingId?.slice(-4) || '8842'}</div>
              <div className="p-card-bottom">
                <div className="p-meta">
                  <label>PASSENGER / RIDER</label>
                  <strong>{booking?.user?.name || "Authorized Rider"}</strong>
                </div>
                <div className="p-card-brand-logo">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="vault-engine-wrapper">
              <div className="terminal-label"><Lock size={14}/> SECURE GATEWAY ENCRYPTION: ACTIVE</div>
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
                <h3>Reservation Summary</h3>
                <div className="badge-verified"><ShieldCheck size={14}/> VERIFIED</div>
              </div>

              <div className="invoice-body">
                <div className="asset-summary-box">
                   <div className="asset-icon"><Bike size={24}/></div>
                   <div className="asset-info">
                      <label>SELECTED MACHINE</label>
                      <p>{booking?.bikes?.[0]?.name || "Premium Fleet Model"}</p>
                   </div>
                </div>

                <div className="asset-summary-box">
                   <div className="asset-icon"><Calendar size={24}/></div>
                   <div className="asset-info">
                      <label>EXPEDITION TIMELINE</label>
                      <p>{new Date(booking?.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} — {new Date(booking?.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                   </div>
                </div>

                <div className="asset-summary-box">
                   <div className="asset-icon"><MapPin size={24}/></div>
                   <div className="asset-info">
                      <label>PICKUP LOCATION</label>
                      <p>Thamel Hub HQ</p>
                   </div>
                </div>

                <div className="cost-breakdown">
                   <div className="cost-row"><span>Platform Service Fee</span><span className="text-free">WAIVED</span></div>
                   <div className="cost-row"><span>Insurance Policy (Premium)</span><span className="text-free">INCLUDED</span></div>
                   <div className="cost-row"><span>Roadside Assistance</span><span className="text-free">ACTIVE</span></div>
                </div>

                <div className="total-due-area">
                   <label>TOTAL INVESTMENT DUE</label>
                   <h2>Rs. {booking?.totalPrice?.toLocaleString()}</h2>
                </div>
              </div>

              <div className="marketplace-trust-footer">
                 <div className="trust-icons">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" height="20" />
                 </div>
                 <p>Transactions are processed via Stripe using end-to-end 256-bit SSL encryption. No card data is stored on our servers.</p>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default PaymentPage;