import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import Payment from '../components/Payment';
import { ShieldCheck, Lock, CreditCard, ChevronLeft, Info, Bike, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import "../styles/PaymentPage.css";

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        if (response.data && response.data.booking) {
          setBooking(response.data.booking);
        } else {
          setBooking(response.data);
        }
      } catch (err) {
        setError('We couldn’t retrieve your booking details. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const finalAmount = booking?.totalPrice;
      await api.put(`/bookings/${bookingId}/pay`, {
        paymentId: paymentId,
        amount: finalAmount
      });

      navigate('/booking-success', {
        state: {
          bookingId: bookingId,
          bikeName: booking?.bike?.name || "Ride N Roar Bike",
          bikeImage: booking?.bike?.images?.[0],
          startDate: booking?.startDate,
          endDate: booking?.endDate,
          totalPrice: finalAmount,
          transactionId: paymentId
        }
      });

    } catch (err) {
      navigate('/customer-dashboard'); 
    }
  };

  if (loading) {
    return (
      <div className="pay-loader-container">
        <div className="pay-spinner"></div>
        <p>Initializing Secure Checkout...</p>
      </div>
    );
  }

  const amountToPay = booking?.totalPrice || 0;

  return (
    <div className="payment-page-wrapper">
      <div className="pay-container-managed">
        
        {/* 🛡️ SECURITY STEPPER */}
        <div className="checkout-stepper">
          <div className="step completed"><CheckCircle size={16}/> Details</div>
          <div className="step-line active"></div>
          <div className="step active"><CreditCard size={16}/> Payment</div>
          <div className="step-line"></div>
          <div className="step">Finish</div>
        </div>

        <button className="btn-back-soft" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Modify Booking
        </button>

        <div className="pay-grid-layout">
          
          {/* 📝 LEFT: PAYMENT TERMINAL */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="payment-terminal-side"
          >
            <div className="terminal-card">
              <header className="terminal-header">
                <div className="secure-badge">
                  <Lock size={14} /> SECURE VAULT
                </div>
                <h3>Card Information</h3>
              </header>

              <div className="stripe-component-wrapper">
                <Payment
                  amount={amountToPay}
                  bookingId={bookingId}
                  onSuccess={handlePaymentSuccess}
                />
              </div>

              <div className="payment-guarantee">
                <ShieldCheck size={20} color="#10b981" />
                <p>Your payment is processed by Stripe. Ride N Roar never stores your card details.</p>
              </div>
            </div>
          </motion.div>

          {/* 🧾 RIGHT: RENTAL SUMMARY */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="payment-summary-side"
          >
            <div className="summary-receipt-card">
              <h4>Ride Summary</h4>
              
              <div className="receipt-item">
                <div className="r-icon"><Bike size={18}/></div>
                <div className="r-text">
                  <span>Vehicle Model</span>
                  <strong>{booking?.bike?.name}</strong>
                </div>
              </div>

              <div className="receipt-item">
                <div className="r-icon"><Calendar size={18}/></div>
                <div className="r-text">
                  <span>Rental Period</span>
                  <strong>{new Date(booking?.startDate).toLocaleDateString()} - {new Date(booking?.endDate).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="price-final-stack">
                <div className="p-row">
                   <span>Subtotal</span>
                   <span>Rs. {amountToPay.toLocaleString()}</span>
                </div>
                <div className="p-row">
                   <span>Tax & Fees</span>
                   <span className="free">Included</span>
                </div>
                <div className="p-divider"></div>
                <div className="p-row grand-total">
                   <span>Grand Total</span>
                   <span>Rs. {amountToPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="help-alert-box">
                <Info size={16} />
                <p>Need help? Contact our Kathmandu 24/7 Support.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Internal Mini-Component for Stepper Check
const CheckCircle = ({size}) => <ShieldCheck size={size} />;

export default PaymentPage;