import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import Payment from '../components/Payment';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        console.log(`🔄 Fetching details for booking: ${bookingId}`);
        const response = await api.get(`/bookings/${bookingId}`);
        
        // ✅ FIX: Access response.data.booking because of your controller structure
        if (response.data && response.data.booking) {
          setBooking(response.data.booking);
        } else {
          // Fallback if structure is different
          setBooking(response.data);
        }
      } catch (err) {
        console.error('❌ Error fetching booking:', err.response?.data || err.message);
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
    console.log('✅ Stripe Payment Success. Updating backend...');
    
    try {
      const finalAmount = booking?.totalPrice;

      // 1. Update the booking status in MongoDB via your specific route
      await api.put(`/bookings/${bookingId}/pay`, {
        paymentId: paymentId,
        amount: finalAmount
      });

      // 2. Navigate to success page with full state for the receipt
      navigate('/booking-success', {
        state: {
          bookingId: bookingId,
          bikeName: booking?.bike?.name || "Ride N Roar Bike",
          startDate: booking?.startDate,
          endDate: booking?.endDate,
          totalPrice: finalAmount,
          transactionId: paymentId
        }
      });

    } catch (err) {
      console.error('❌ Backend update failed:', err.message);
      alert("Payment verified! Your booking is being processed.");
      navigate('/customer'); // Send to dashboard as fallback
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#1e293b' }}>
        <div className="admin-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Initialising Secure Checkout...</p>
      </div>
    );
  }

  // ✅ Use totalPrice directly from the synced booking state
  const amountToPay = booking?.totalPrice || 0;

  return (
    <div className="payment-page-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', fontWeight: '800' }}>Finalize Payment</h1>
        <p style={{ color: '#64748b' }}>Secure transaction for your Kathmandu ride</p>
      </header>

      {error && (
        <div style={{ padding: '15px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fecaca' }}>
          ⚠️ {error}
        </div>
      )}

      {/* RENTAL SUMMARY CARD */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#1e293b' }}>Rental Summary</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: '#64748b' }}>Bike Model:</span>
          <span style={{ fontWeight: '700', color: '#1e293b' }}>{booking?.bike?.name}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ color: '#64748b' }}>Rental Period:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
            {new Date(booking?.startDate).toLocaleDateString()} - {new Date(booking?.endDate).toLocaleDateString()}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0 0', borderTop: '2px dashed #e2e8f0' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>Total Amount:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>Rs. {amountToPay.toLocaleString()}</span>
        </div>
      </div>

      {/* STRIPE PAYMENT COMPONENT */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Payment
          amount={amountToPay}
          bookingId={bookingId}
          onSuccess={handlePaymentSuccess}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          🔒 Encrypted by Stripe. Ride N Roar never stores your card details.
        </p>
      </div>
    </div>
  );
}

export default PaymentPage;