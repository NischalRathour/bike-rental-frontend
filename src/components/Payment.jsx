import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentApi from '../api/paymentApi'; 
import { ShieldCheck, Lock, Terminal, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/Payment.css";

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [statusLog, setStatusLog] = useState([]);

  // Simple function to show progress updates to the user
  const addLog = (msg) => {
    setStatusLog(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev.slice(0, 2)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    addLog('Connecting to secure payment gateway...');

    try {
      // 1. Request a Payment Intent from your Backend
      const { data } = await paymentApi.post('/payments/create-intent', { bookingId });
      addLog('Secure connection established.');

      // 2. Send Card Details directly to Stripe (PCI Compliant)
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
            card: cardElement,
            billing_details: { name: "Verified Customer" }
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        addLog(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        addLog('Payment verified by bank.');
        setSuccess(true);
        // Delay slightly so the user sees the success message
        setTimeout(() => onSuccess(paymentIntent.id), 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Connection lost. Please try again.";
      setError(errMsg);
      addLog(`Error: ${errMsg}`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="payment-card-container">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="payment-success-state">
            <CheckCircle2 size={50} color="#10b981" />
            <h3>Payment Successful</h3>
            <p>Verifying your booking details...</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="payment-form">
            <div className="payment-header">
              <div className="secure-badge">
                <ShieldCheck size={14} />
                <span>SECURE CHECKOUT</span>
              </div>
              <div className="card-networks">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="network-logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="network-logo mastercard" />
              </div>
            </div>

            <div className="card-input-section">
              <label className="input-label">CARD INFORMATION</label>
              <div className={`stripe-element-wrapper ${loading ? 'is-loading' : ''} ${error ? 'has-error' : ''}`}>
                <CardElement 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '16px', 
                        color: '#1e293b',
                        '::placeholder': { color: '#94a3b8' } 
                      } 
                    } 
                  }} 
                />
              </div>
            </div>

            {error && (
              <div className="payment-error-msg">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button className="pay-submit-btn" disabled={!stripe || loading}>
              {loading ? (
                <Zap size={18} className="loading-spinner" />
              ) : (
                `Pay Rs. ${amount?.toLocaleString()}`
              )}
            </button>

            {/* User-friendly progress log */}
            <div className="payment-activity-log">
              <div className="log-header"><Terminal size={12}/> <span>ACTIVITY</span></div>
              <div className="log-content">
                {statusLog.map((log, i) => (
                  <div key={i} className="log-line">{`> ${log}`}</div>
                ))}
                {statusLog.length === 0 && <div className="log-line text-placeholder">{"> Ready for payment"}</div>}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Payment;