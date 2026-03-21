import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../api/paymentApi'; 
import Payment from '../components/Payment';
import { 
  ShieldCheck, ChevronLeft, Bike, Calendar, 
  Cpu, Lock, Globe, CheckCircle2, CreditCard
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
        bikeName: booking?.bikes?.[0]?.name || "Premium Fleet Unit",
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

  if (loading) return <div className="pay-loader-hub"><div className="spinner-quantum"></div></div>;

  return (
    <div className="marketplace-pay-root">
      <div className="pay-content-grid">
        
        {/* --- LEFT: MAIN CHECKOUT AREA --- */}
        <div className="hub-main-section">
          <button onClick={() => navigate(-1)} className="hub-back-action">
            <ChevronLeft size={14}/> <span>Fleet Hub</span>
          </button>

          <header className="hub-header">
            <h1 className="hub-title">Secure <span className="text-indigo">Checkout</span></h1>
            <p className="hub-subtitle">Finalize your authorization for Kathmandu expedition services.</p>
          </header>

          {/* 💳 COMPACT PREMIUM VISA CARD (SIZED FOR AESTHETICS) */}
          <div className="visa-container-compact">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="platinum-card-visual"
            >
              <div className="p-card-top">
                <div className="p-chip-set">
                  <Cpu size={28} className="gold-icon" />
                  <Globe size={14} className="nfc-icon" />
                </div>
                <div className="p-brand">PLATINUM PASS</div>
              </div>
              <div className="p-card-number">•••• •••• •••• 8842</div>
              <div className="p-card-bottom">
                <div className="p-meta">
                  <label>VIRTUAL CREDIT</label>
                  <strong>Rs. 850,000.00</strong>
                </div>
                <div className="p-card-brand-logo">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="vault-engine-wrapper">
             <div className="terminal-label"><Lock size={12}/> ENCRYPTED CARD AUTHORIZATION</div>
             <Payment 
                amount={booking?.totalPrice} 
                bookingId={bookingId} 
                onSuccess={handleSuccess} 
             />
          </div>
        </div>

        {/* --- RIGHT: HIGH-END INVOICE --- */}
        <aside className="hub-sidebar-section">
           <div className="sidebar-sticky-inner">
              <div className="invoice-header-premium">
                <h3>Expedition Ledger</h3>
                <div className="badge-verified"><ShieldCheck size={12}/> SECURE</div>
              </div>

              <div className="invoice-body">
                <div className="asset-summary-box">
                   <div className="asset-icon"><Bike size={20}/></div>
                   <div className="asset-info">
                      <label>Machine Selection</label>
                      <p>{booking?.bikes?.[0]?.name || "Luxury Expedition Unit"}</p>
                   </div>
                </div>

                <div className="asset-summary-box">
                   <div className="asset-icon"><Calendar size={20}/></div>
                   <div className="asset-info">
                      <label>Rental Window</label>
                      <p>{new Date(booking?.startDate).toLocaleDateString()} — {new Date(booking?.endDate).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="cost-breakdown">
                   <div className="cost-row"><span>Logistics & Handling</span><span className="text-free">INCLUSIVE</span></div>
                   <div className="cost-row"><span>Damage Waiver</span><span className="text-free">INCLUSIVE</span></div>
                </div>

                <div className="total-due-area">
                   <label>TOTAL PAYABLE AMOUNT</label>
                   <h2>Rs. {booking?.totalPrice?.toLocaleString()}</h2>
                </div>
              </div>

              <div className="marketplace-trust-footer">
                 <div className="trust-icons">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" height="15" />
                 </div>
                 <p>Automated confirmation will be issued upon authorization.</p>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default PaymentPage;