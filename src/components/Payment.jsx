import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentApi from '../api/paymentApi'; 
import { 
  ShieldCheck, Terminal, CheckCircle2, Loader2, 
  AlertCircle, Wallet, Fingerprint, Activity, Cpu 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/Payment.css";

function Payment({ bookingId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [statusLog, setStatusLog] = useState([]);
  const [processingStep, setProcessingStep] = useState(0);

  const addLog = (msg) => {
    setStatusLog(prev => [`${new Date().toLocaleTimeString().split(' ')[0]} || ${msg}`, ...prev.slice(0, 3)]);
  };

  useEffect(() => {
    const initIntent = async () => {
      if (!bookingId) {
        addLog("CRITICAL_ERROR: NULL_BOOKING_ID");
        return;
      }

      try {
        addLog("ESTABLISHING ENCRYPTED TUNNEL...");
        // ✅ Ensure bookingId is passed as an object
        const { data } = await paymentApi.post('/payments/create-intent', { bookingId });
        
        setTimeout(() => {
          setPaymentDetails(data);
          addLog("MDB_ATLAS_SYNC: RECORDS_VALIDATED");
          addLog(`BALANCE_VERIFIED: Rs. ${data.currentBalance.toLocaleString()}`);
          
          // 🚨 UI ALERT: If balance is negative, show error immediately
          if (data.currentBalance < 0) {
            setError("INSUFFICIENT_FUNDS: WALLET_OVERDRAWN");
            addLog("ALERT: WALLET_OVERDRAWN");
          }
        }, 800);
      } catch (err) { 
        const errMsg = err.response?.data?.message || "GATEWAY_TIMEOUT";
        setError(errMsg); 
        addLog(`FATAL_ERROR: ${errMsg}`);
      }
    };
    initIntent();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !paymentDetails) return;

    // Check balance one last time before initiating
    if (paymentDetails.currentBalance < paymentDetails.totalAmount) {
      setError("INSUFFICIENT_FUNDS: RELOAD_VISA_WALLET");
      return;
    }

    setLoading(true);
    setError(null);
    setProcessingStep(1);
    addLog("PHASE_1: VISA_NETWORK_HANDSHAKE...");

    try {
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentDetails.clientSecret, 
        {
          payment_method: { 
            card: cardElement,
            billing_details: { name: "Ride N Roar Premium User" }
          }
        }
      );

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === 'succeeded') {
        setProcessingStep(2);
        addLog("PHASE_2: FUNDS_FROZEN_IN_ESCROW...");
        
        const { data: confirmData } = await paymentApi.post('/payments/confirm', { 
            bookingId, 
            paymentId: paymentIntent.id 
        });

        setProcessingStep(3);
        addLog(`PHASE_3: WALLET_SETTLEMENT_COMPLETE`);
        addLog(`NEW_BALANCE: Rs. ${confirmData.newBalance.toLocaleString()}`);
        
        setSuccess(true);
        setTimeout(() => onSuccess(paymentIntent.id), 2000);
      }
    } catch (err) {
      const msg = err.message || "TRANSACTION_REJECTED";
      setError(msg);
      addLog(`ERR_AUTH_REJECTED: ${msg}`);
      setLoading(false);
      setProcessingStep(0);
    }
  };

  return (
    <div className="payment-card-container">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="payment-success-state">
            <div className="success-pulse-ring">
              <CheckCircle2 size={100} strokeWidth={1.5} color="#10b981" />
            </div>
            <h2 className="success-title">TRANSACTION_VALIDATED</h2>
            <p className="success-subtitle">Machine deployment authorized in Thamel Hub.</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="payment-form">
            <div className="premium-wallet-card">
              <div className="glass-shimmer"></div>
              <div className="wallet-header">
                <div className="wallet-label"><Cpu size={14} className="icon-spin" /> <span>CORE_BALANCE_MONITOR</span></div>
                <div className="visa-logo-watermark">VISA</div>
              </div>
              
              <div className="wallet-main">
                <div className="current-balance">
                  <small>AVAILABLE_FUNDS</small>
                  <h1 style={{ color: paymentDetails?.currentBalance < 0 ? '#ef4444' : 'inherit' }}>
                    Rs. {paymentDetails?.currentBalance?.toLocaleString() || "0.00"}
                  </h1>
                </div>
                <div className="wallet-chip"></div>
              </div>

              <div className="wallet-footer">
                <div className="calc-row">
                  <span>DEDUCTION</span>
                  <span className="text-red">- Rs. {paymentDetails?.totalAmount?.toLocaleString() || "0"}</span>
                </div>
                <div className="calc-row result">
                  <span>POST_TX_ESTIMATE</span>
                  <span className="text-green">
                    Rs. {paymentDetails ? (paymentDetails.currentBalance - paymentDetails.totalAmount).toLocaleString() : "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="secure-input-group">
              <div className="label-row">
                <label><Fingerprint size={14} /> SECURE_CREDENTIAL_ENTRY</label>
                <div className="encryption-tag"><ShieldCheck size={12}/> ENCRYPTED</div>
              </div>
              <div className={`stripe-wrapper ${loading ? 'scanning' : ''} ${error ? 'invalid' : ''}`}>
                <CardElement options={{ style: { base: { fontSize: '17px', color: '#f8fafc', fontFamily: '"JetBrains Mono", monospace', '::placeholder': { color: '#475569' } } } }} />
              </div>
            </div>

            {error && (
              <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="gateway-error">
                <AlertCircle size={18} />
                <span>{error.toUpperCase()}</span>
              </motion.div>
            )}

            <button className={`premium-pay-btn ${loading ? 'active' : ''}`} disabled={!stripe || loading || !paymentDetails || paymentDetails.currentBalance < 0}>
              {loading ? (
                <div className="btn-status-flow">
                  <Loader2 size={20} className="spinner-quantum" />
                  <span>{processingStep === 1 ? "AUTHORIZING..." : processingStep === 2 ? "SETTLING..." : "FINALIZING..."}</span>
                </div>
              ) : (
                <div className="btn-label-group">
                   <div className="btn-text">INITIALIZE_SETTLEMENT</div>
                   <div className="btn-amount">Rs. {paymentDetails?.totalAmount?.toLocaleString()}</div>
                </div>
              )}
            </button>

            <div className="terminal-telemetry">
              <div className="terminal-header"><Activity size={14} /> <span>SYSTEM_TELEMETRY</span></div>
              <div className="terminal-body">
                {statusLog.map((log, i) => (<div key={i} className="log-entry">{`>> ${log}`}</div>))}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Payment;