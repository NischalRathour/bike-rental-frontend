import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axiosConfig'; // Using your standard interceptor-enabled API

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  // Helper to track process for supervisor demo
  const addLog = (msg) => {
    console.log(msg);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDebugLog([]); // Reset log for new attempt

    addLog('🚀 Starting Payment Process...');

    if (!stripe || !elements) {
      addLog('❌ Error: Stripe.js not ready');
      setError("Payment system is still initializing. Please wait.");
      return;
    }

    // ✅ VALIDATION: Ensure amount is valid before calling Port 5000
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      addLog(`❌ Validation Failed: Amount is ${amount}`);
      setError("Invalid payment amount. Please check your rental details.");
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Get Payment Intent from Backend
      addLog(`📡 Requesting Intent for Rs. ${numericAmount}...`);
      const { data } = await api.post('/payments/create-payment-intent', {
        amount: numericAmount
      });

      if (!data.clientSecret) {
        throw new Error('Server did not return a client secret.');
      }
      addLog('✅ Intent Received.');

      // STEP 2: Confirm Payment with Stripe
      addLog('💳 Verifying Card with Stripe...');
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Ride N Roar Customer",
            },
          },
        }
      );

      if (stripeError) {
        addLog(`❌ Stripe Error: ${stripeError.message}`);
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        addLog('🎉 Payment Success!');
        setSuccess(true);
        
        // STEP 3: Finalize Booking on Backend
        if (bookingId && onSuccess) {
          addLog('🔄 Syncing Booking Status...');
          await onSuccess(paymentIntent.id);
          addLog('✅ Booking Confirmed.');
        }
      }

    } catch (err) {
      console.error('Payment Error:', err);
      const msg = err.response?.data?.message || err.message || "Payment processing failed";
      addLog(`❌ Error: ${msg}`);
      setError(msg);
    } finally {
      setLoading(false);
      addLog('=== END OF PROCESS ===');
    }
  };

  return (
    <div className="payment-form-wrapper">
      <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Enter Card Details</h3>
      
      {success ? (
        <div style={{ textAlign: 'center', padding: '20px', background: '#dcfce7', borderRadius: '12px' }}>
          <h4 style={{ color: '#15803d', margin: 0 }}>✅ Payment Successful</h4>
          <p style={{ fontSize: '0.9rem', color: '#166534' }}>Redirecting to confirmation...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ 
            padding: '15px', 
            border: '1px solid #e2e8f0', 
            borderRadius: '10px', 
            background: '#fff',
            marginBottom: '20px'
          }}>
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#1e293b' } } }} />
          </div>

          {error && (
            <div style={{ 
              background: '#fef2f2', 
              color: '#b91c1c', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              marginBottom: '20px',
              border: '1px solid #fee2e2'
            }}>
              <strong>⚠️ Payment Failed:</strong> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!stripe || loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#94a3b8' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Validating...' : `Pay Rs. ${amount?.toLocaleString()}`}
          </button>

          {/* Collapsible Debug Log for Supervisor Presentation */}
          <details style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
            <summary style={{ cursor: 'pointer' }}>🛠️ Developer Debug Log</summary>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#f1f5f9', 
              borderRadius: '6px',
              maxHeight: '150px',
              overflowY: 'auto',
              fontFamily: 'monospace'
            }}>
              {debugLog.length === 0 ? "No active logs." : debugLog.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </details>
        </form>
      )}
    </div>
  );
}

export default Payment;