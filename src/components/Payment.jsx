import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axiosConfig'; 
import { ShieldCheck, Lock, CreditCard, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';
import "../styles/Payment.css";

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDebugLog([]);
    addLog('🚀 Initializing transaction...');

    if (!stripe || !elements) {
      setError("Payment gateway is initializing. Please wait.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Invalid amount detected.");
      return;
    }

    setLoading(true);

    try {
      addLog(`📡 Generating Payment Intent for Rs. ${numericAmount}`);
      
      // ✅ TARGETING FIXED ROUTE: /api/payments/create-intent
      const { data } = await api.post('/payments/create-intent', {
        bookingId: bookingId, // Backend uses this to find the price and link the transaction
      });

      if (!data.clientSecret) throw new Error('Client secret missing from gateway.');
      addLog('✅ Intent handshake successful.');

      const cardElement = elements.getElement(CardElement);
      addLog('💳 Syncing card with encrypted vault...');
      
      // 🏦 STRIPE CONFIRMATION
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: "Ride N Roar Verified Customer" },
          },
        }
      );

      if (stripeError) {
        addLog(`❌ Failure: ${stripeError.message}`);
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        addLog('🎉 Transaction authorized by bank.');
        setSuccess(true);
        
        if (bookingId && onSuccess) {
          addLog('🔄 Synchronizing booking state...');
          // ✅ paymentIntent.id is the 'pi_...' reference from Stripe
          await onSuccess(paymentIntent.id);
          addLog('✅ Ledger updated.');
        }
      }

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Processing error";
      addLog(`❌ System Exception: ${msg}`);
      setError(`Gateway Error: ${msg}`);
    } finally {
      setLoading(false);
      addLog('=== END OF TRANSACTION ===');
    }
  };

  return (
    <div className="payment-form-container">
      {success ? (
        <div className="payment-success-state">
          <CheckCircle2 size={48} color="#10b981" />
          <h4>Authorization Successful</h4>
          <p>Your ride has been secured. Redirecting to receipt...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="premium-card-form">
          <div className="card-input-label">
            <CreditCard size={16} /> <span>Credit or Debit Card</span>
          </div>
          
          <div className={`stripe-element-container ${loading ? 'processing' : ''}`}>
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

          {error && (
            <div className="payment-error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!stripe || loading}
            className={`btn-payment-submit ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <span className="loader-text">Verifying with Bank...</span>
            ) : (
              <span className="btn-flex">
                Pay Rs. {amount?.toLocaleString()} <Lock size={16} />
              </span>
            )}
          </button>

          {/* 🛠️ Debug Console for presentation */}
          <div className="debug-log-wrapper">
            <details>
              <summary><Terminal size={14} /> System Activity Log</summary>
              <div className="debug-console">
                {debugLog.length === 0 ? (
                  <div className="log-line idle">> Awaiting user input...</div>
                ) : (
                  debugLog.map((log, i) => (
                    <div key={i} className="log-line">{log}</div>
                  ))
                )}
              </div>
            </details>
          </div>
        </form>
      )}
    </div>
  );
}

export default Payment;