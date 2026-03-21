import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentApi from '../api/paymentApi'; 
import { 
  ShieldCheck, 
  Lock, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/Payment.css";

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  const addLog = (msg) => {
    setDebugLog(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev.slice(0, 3)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    addLog('🚀 Handshake initiated with Stripe Hub...');

    try {
      const { data } = await paymentApi.post('/payments/create-intent', { bookingId });
      addLog('📡 Gateway connected. RSA Secret acquired.');

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
            card: cardElement,
            billing_details: { name: "Premium Member" }
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        addLog(`❌ Refused: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        addLog('🎉 Bank Authorized. Securing Ledger...');
        setSuccess(true);
        setTimeout(() => onSuccess(paymentIntent.id), 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Payment Engine Timeout.";
      setError(errMsg);
      addLog(`⚠️ System Exception: ${errMsg}`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="payment-vault-card">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="payment-success-overlay"
          >
            <CheckCircle2 size={50} color="#10b981" />
            <h3>Authorization Secured</h3>
            <p>Your funds are being synchronized...</p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="vault-form-inner"
          >
            <div className="vault-header">
              <div className="secure-tag">
                <ShieldCheck size={12} />
                <span>ENCRYPTED VAULT</span>
              </div>
              {/* ✅ FIXED: Logo container with specific sizing */}
              <div className="provider-logo-row">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="brand-logo-mini" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="brand-logo-mini mastercard-fix" />
              </div>
            </div>

            <div className="payment-input-group">
              <label className="card-input-label">CARD IDENTIFICATION NUMBER</label>
              <div className={`stripe-input-wrapper ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}>
                <CardElement options={{ 
                  style: { 
                    base: { 
                      fontSize: '16px', 
                      color: '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                      '::placeholder': { color: '#94a3b8' }
                    } 
                  } 
                }} />
              </div>
            </div>

            {error && (
                <div className="payment-alert">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}

            <button className="btn-vault-auth" disabled={!stripe || loading}>
              {loading ? (
                <span className="flex-center"><Zap size={16} className="spin-icon" /> Processing...</span>
              ) : (
                <span className="flex-center">Authorize Rs. {amount?.toLocaleString()} <ChevronRight size={16} /></span>
              )}
            </button>

            {/* LIVE CONSOLE (Integrated for Aesthetic) */}
            <div className="debug-console-box">
              <div className="console-meta">
                <Terminal size={12}/> <span>TRANSACTION LOGS</span>
              </div>
              <div className="log-window">
                {debugLog.map((log, i) => (
                  <div key={i} className="log-row">{`> ${log}`}</div>
                ))}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Payment;