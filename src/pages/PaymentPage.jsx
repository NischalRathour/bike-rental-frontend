import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import Payment from '../components/Payment'; // This is your Stripe Elements Wrapper
import { ShieldCheck, Lock, CreditCard, ChevronLeft, Info, Bike, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // GET the booking we just created
        const response = await api.get(`/bookings/${bookingId}`);
        
        // Handle different response structures from backend
        const data = response.data.booking || response.data;
        setBooking(data);
      } catch (err) {
        console.error("Payment Fetch Error:", err);
        setError('We couldn’t retrieve your booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // This function is triggered after Stripe confirms the card charge
  const handlePaymentSuccess = async (paymentId) => {
    try {
      // 1. Tell the backend to mark the booking as "Paid" and "Confirmed"
      await api.post(`/payments/confirm`, {
        bookingId: bookingId,
        paymentId: paymentId
      });

      // 2. Navigate to success page with full details for the receipt
      navigate('/booking-success', {
        state: {
          bookingId: bookingId,
          bikeName: booking?.bike?.name || "Premium Motorbike",
          bikeImage: booking?.bike?.images?.[0],
          startDate: booking?.startDate,
          endDate: booking?.endDate,
          totalPrice: booking?.totalPrice,
          transactionId: paymentId
        }
      });

    } catch (err) {
      console.error("Confirmation Error:", err);
      // Fallback to dashboard if navigation fails
      navigate('/customer'); 
    }
  };

  if (loading) {
    return (
      <div className="pay-loader-container">
        <div className="pay-spinner"></div>
        <p>Initializing Secure Vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pay-error-container">
        <Info size={40} color="#ef4444" />
        <p>{error}</p>
        <button onClick={() => navigate('/bikes')}>Return to Fleet</button>
      </div>
    );
  }

  const amountToPay = booking?.totalPrice || 0;

  return (
    <div className="payment-page-wrapper">
      <div className="pay-container-managed">
        
        {/* 🛡️ CHECKOUT STEPPER */}
        <div className="checkout-stepper-row">
          <div className="step-item done"><CheckCircle size={14}/> Booking</div>
          <div className="step-divider active"></div>
          <div className="step-item active"><CreditCard size={14}/> Secure Payment</div>
          <div className="step-divider"></div>
          <div className="step-item">Confirmation</div>
        </div>

        <button className="btn-back-nav" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back to Reservation
        </button>

        <div className="pay-main-grid">
          
          {/* 💳 LEFT: STRIPE TERMINAL */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="payment-form-column"
          >
            <div className="terminal-glass-card">
              <header className="card-security-header">
                <div className="vault-tag"><Lock size={12} /> BANK-LEVEL SECURITY</div>
                <h3>Credit or Debit Card</h3>
              </header>

              <div className="stripe-input-container">
                {/* Your custom Payment component that holds <CardElement /> */}
                <Payment
                  amount={amountToPay}
                  bookingId={bookingId}
                  onSuccess={handlePaymentSuccess}
                />
              </div>

              <div className="security-footer-info">
                <ShieldCheck size={18} />
                <p>Transactions are encrypted via 256-bit SSL. Powered by Stripe.</p>
              </div>
            </div>
          </motion.div>

          {/* 🧾 RIGHT: RECEIPT PREVIEW */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="payment-details-column"
          >
            <div className="order-summary-card">
              <h4>Order Summary</h4>
              
              <div className="order-item">
                <div className="item-icon"><Bike size={20}/></div>
                <div className="item-details">
                  <label>Vehicle Selected</label>
                  <strong>{booking?.bike?.name || "Professional Fleet Bike"}</strong>
                </div>
              </div>

              <div className="order-item">
                <div className="item-icon"><Calendar size={20}/></div>
                <div className="item-details">
                  <label>Rental Duration</label>
                  <strong>
                    {new Date(booking?.startDate).toLocaleDateString('en-NP', {day:'numeric', month:'short'})} 
                    - 
                    {new Date(booking?.endDate).toLocaleDateString('en-NP', {day:'numeric', month:'short', year:'numeric'})}
                  </strong>
                </div>
              </div>

              <div className="billing-breakdown-box">
                <div className="bill-line">
                  <span>Daily Rental Subtotal</span>
                  <span>Rs. {amountToPay.toLocaleString()}</span>
                </div>
                <div className="bill-line">
                  <span>GST & Service Charges</span>
                  <span className="text-green">Included</span>
                </div>
                <div className="bill-separator"></div>
                <div className="bill-line total">
                  <span>Total Amount</span>
                  <span>Rs. {amountToPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="customer-support-alert">
                <Info size={16} />
                <p>Payment issues? Contact +977-9843360610</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;