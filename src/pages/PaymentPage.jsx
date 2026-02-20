import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // ✅ Using your interceptor-enabled API
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
        setBooking(response.data);
      } catch (err) {
        console.error('❌ Error fetching booking:', err.response?.data || err.message);
        setError('We couldn’t retrieve your booking details. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && bookingId !== 'test') {
      fetchBookingDetails();
    } else {
      // Logic for test/mock mode if needed
      setLoading(false);
    }
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentId) => {
    console.log('✅ Stripe Payment Success. Updating backend...');
    
    try {
      const finalAmount = booking?.totalPrice || booking?.totalAmount;

      // 1. Update the booking status in MongoDB to 'Confirmed' and 'Paid'
      await api.put(`/bookings/${bookingId}/pay`, {
        paymentId: paymentId,
        amount: finalAmount
      });

      // 2. ✅ NAVIGATE TO SUCCESS PAGE WITH DATA
      // Passing state is crucial so the Confirmation page knows what to show
      navigate('/booking-success', {
        state: {
          bookingId: bookingId,
          bikeName: booking?.bike?.name || "Premium Bike",
          bikeImage: booking?.bike?.image || booking?.bike?.images?.[0],
          startDate: booking?.startDate,
          endDate: booking?.endDate,
          totalPrice: finalAmount
        }
      });

    } catch (err) {
      console.error('❌ Backend update failed:', err.message);
      // If the payment worked but the update failed, we still show the success page
      // but warn the user or redirect to my-bookings
      alert("Payment verified! Redirecting to your bookings...");
      navigate('/my-bookings');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div className="spinner"></div>
        <p>Loading Secure Checkout...</p>
      </div>
    );
  }

  const amountToPay = booking?.totalPrice || booking?.totalAmount || 0;

  return (
    <div className="payment-page-container" style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Finalize Payment</h1>
        <p style={{ color: '#666' }}>Secure transaction via Stripe</p>
      </header>

      {error && (
        <div style={{ padding: '15px', background: '#fff5f5', color: '#e53e3e', borderRadius: '10px', marginBottom: '20px', border: '1px solid #fed7d7' }}>
          ⚠️ {error}
        </div>
      )}

      {/* RENTAL SUMMARY CARD */}
      <div className="summary-box" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #f0f0f0' }}>
        <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Rental Details</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ color: '#777' }}>Vehicle:</span>
          <span style={{ fontWeight: 'bold' }}>{booking?.bike?.name || 'Loading...'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ color: '#777' }}>Duration:</span>
          <span>
            {booking?.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} - {booking?.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', marginTop: '10px', borderTop: '2px solid #f0f0f0' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Payable:</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#28a745' }}>Rs. {amountToPay}</span>
        </div>
      </div>

      {/* STRIPE PAYMENT COMPONENT */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #007bff20' }}>
        <Payment
          amount={amountToPay}
          bookingId={bookingId}
          onSuccess={handlePaymentSuccess}
        />
      </div>

      <p style={{ textAlign: 'center', color: '#999', fontSize: '0.9rem', marginTop: '30px' }}>
        🔒 Your payment data is encrypted and secure.
      </p>
    </div>
  );
}

export default PaymentPage;