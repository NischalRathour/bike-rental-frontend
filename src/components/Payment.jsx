import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentApi from '../api/paymentApi'; // Import clean API

function Payment({ amount, onSuccess, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebug = (message) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    addDebug('=== PAYMENT PROCESS START ===');
    addDebug(`Stripe loaded: ${!!stripe}`);
    addDebug(`Elements loaded: ${!!elements}`);
    addDebug(`Amount: ₹${amount}`);
    
    if (!stripe || !elements) {
      addDebug('❌ Stripe.js not loaded yet');
      setError("Payment system is not ready. Please wait...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // METHOD 1: Try with clean payment API
      addDebug('🔄 Step 1: Creating payment intent...');
      
      const { data } = await paymentApi.post('/payments/create-payment-intent', {
        amount: amount
      });
      
      addDebug('✅ Step 1: Payment intent created');
      addDebug(`Client Secret: ${data.clientSecret.substring(0, 30)}...`);
      
      if (!data.clientSecret) {
        throw new Error('No client secret received from backend');
      }

      // METHOD 2: Process with Stripe
      addDebug('🔄 Step 2: Processing with Stripe.js...');
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Test Customer",
            },
          },
        }
      );

      if (stripeError) {
        addDebug(`❌ Stripe Error: ${stripeError.message}`);
        setError(`Payment failed: ${stripeError.message}`);
        setLoading(false);
        return;
      }

      addDebug(`✅ Step 3: Payment successful! ID: ${paymentIntent.id}`);
      setSuccess(true);
      
      // Update booking
      if (bookingId && onSuccess) {
        addDebug('🔄 Step 4: Updating booking status...');
        await onSuccess(paymentIntent.id);
        addDebug('✅ Step 4: Booking updated');
      }

    } catch (err) {
      console.error('Full error:', err);
      
      let errorMessage = 'Payment failed';
      
      if (err.response) {
        // Server responded with error
        addDebug(`❌ Server Error: ${err.response.status}`);
        addDebug(`Error Data: ${JSON.stringify(err.response.data)}`);
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server Error (${err.response.status})`;
      } else if (err.request) {
        // Request made but no response
        addDebug('❌ No response from server');
        errorMessage = 'Cannot connect to payment server. Please check your internet connection.';
      } else {
        // Other errors
        addDebug(`❌ Error: ${err.message}`);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      addDebug('=== PAYMENT PROCESS END ===');
    }
  };

  // Test button for debugging
  const testBackend = async () => {
    try {
      addDebug('🧪 Testing backend connection...');
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 })
      });
      
      const data = await response.json();
      addDebug(`✅ Backend test: ${response.status} ${response.statusText}`);
      addDebug(`Response: ${JSON.stringify(data)}`);
      
    } catch (error) {
      addDebug(`❌ Backend test failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Pay ₹{amount}</h2>
      
      {/* Test Button */}
      <button 
        onClick={testBackend}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🧪 Test Backend Connection
      </button>
      
      {success ? (
        <div style={{ color: 'green', padding: '20px', textAlign: 'center' }}>
          <h3>✅ Payment Successful!</h3>
          <p>Your payment has been processed successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ 
            border: '1px solid #ccc', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <label>Card Details</label>
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              padding: '15px', 
              marginBottom: '20px',
              background: '#ffebee',
              borderRadius: '5px',
              border: '1px solid #ffcdd2'
            }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!stripe || loading}
            style={{
              background: loading ? '#ccc' : '#0066cc',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>

          {/* Debug Info */}
          <div style={{ 
            marginTop: '30px',
            padding: '15px', 
            background: '#f5f5f5', 
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <strong>🛠️ Debug Log:</strong>
            {debugInfo.map((log, index) => (
              <div key={index} style={{ 
                padding: '3px 0',
                borderBottom: '1px solid #ddd'
              }}>
                {log}
              </div>
            ))}
          </div>

          {/* Test Card Info */}
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#e8f5e9', 
            borderRadius: '5px' 
          }}>
            <p><strong>💡 Test Card:</strong></p>
            <p><code>4242 4242 4242 4242</code></p>
            <p>Expiry: 12/34 | CVC: 123 | Name: Any name</p>
          </div>
        </form>
      )}
    </div>
  );
}

export default Payment;