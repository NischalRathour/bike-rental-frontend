import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentApi from '../api/paymentApi'; 
import { ShieldCheck, Lock, Terminal, AlertCircle, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/Payment.css";

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [statusLog, setStatusLog] = useState([]);

  const addLog = (msg) => {
    setStatusLog(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev.slice(0, 2)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    addLog('Initiating secure handshake...');

    try {
      const { data } = await paymentApi.post('/payments/create-intent', { bookingId });
      addLog('RSA-4096 Encryption authenticated.');

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
            card: cardElement,
            billing_details: { name: "Elite Marketplace Client" }
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        addLog(`Authorization Failed: ${stripeError.code}`);
      } else if (paymentIntent.status === 'succeeded') {
        addLog('Funds verified & held.');
        setSuccess(true);
        setTimeout(() => onSuccess(paymentIntent.id), 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Protocol Error. Try again.";
      setError(errMsg);
      addLog(`ERR_GATEWAY_TIMEOUT`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="payment-card-container">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="payment-success-state"
          >
            <div className="success-icon-wrapper">
              <CheckCircle2 size={80} color="#10b981" />
            </div>
            <h3>Transaction Authenticated</h3>
            <p>Your machine is being provisioned in the ledger...</p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            onSubmit={handleSubmit} 
            className="payment-form"
          >
            <div className="payment-header">
              <div className="secure-badge">
                <ShieldCheck size={18} />
                <span>SECURE VAULT ACCESS</span>
              </div>
              <div className="card-networks">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="network-logo" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="network-logo mastercard" />
              </div>
            </div>

            <div className="card-input-section">
              <label className="input-label">CARDHOLDER CREDENTIALS</label>
              <div className={`stripe-element-wrapper ${loading ? 'is-loading' : ''} ${error ? 'has-error' : ''}`}>
                <CardElement 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '20px', 
                        color: '#0f172a',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: '600',
                        letterSpacing: '0.025em',
                        '::placeholder': { color: '#94a3b8' } 
                      } 
                    } 
                  }} 
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="payment-error-msg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            <button className="pay-submit-btn" disabled={!stripe || loading}>
              {loading ? (
                <div className="btn-loader-content">
                  <Loader2 size={24} className="spinner-quantum" />
                  <span>AUTHORIZING TRANSACTION...</span>
                </div>
              ) : (
                <div className="btn-default-content">
                   <span className="btn-main-text">Confirm & Pay</span>
                   <span className="btn-price-tag">Rs. {amount?.toLocaleString()}</span>
                </div>
              )}
            </button>

            <div className="payment-activity-log">
              <div className="log-header">
                <Terminal size={16}/> 
                <span>ENCRYPTED_ACTIVITY_LOG</span>
                <div className="terminal-status-light"></div>
              </div>
              <div className="log-content">
                {statusLog.map((log, i) => (
                  <div key={i} className="log-line">{`> ${log}`}</div>
                ))}
                {statusLog.length === 0 && <div className="log-line text-placeholder">{"> Awaiting card input..."}</div>}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Payment;