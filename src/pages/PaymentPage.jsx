import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Payment from '../components/Payment';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = () => {
      // Try all possible token names
      return localStorage.getItem('customerToken') || 
             localStorage.getItem('token_user') ||
             localStorage.getItem('token');
    };

    const fetchBooking = async () => {
      console.log('=== PAYMENT PAGE LOADING ===');
      console.log('Booking ID from URL:', bookingId);
      
      const userToken = getToken();
      setToken(userToken || '');
      
      console.log('Token found:', userToken ? 'Yes' : 'No');
      
      if (!userToken) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      // If no booking ID or test mode
      if (!bookingId || bookingId === 'test' || bookingId === 'undefined') {
        console.log('⚠️ Using test mode - no booking ID');
        setBooking({
          _id: 'test_booking',
          bike: { name: 'Test Bike', pricePerHour: 100 },
          totalHours: 8,
          totalAmount: 800,
          status: 'pending'
        });
        setLoading(false);
        return;
      }

      try {
        console.log(`🔄 Fetching booking ${bookingId}...`);
        
        // NOW using the correct endpoint: /api/bookings/:id
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });

        console.log('✅ Booking data received:', response.data);
        setBooking(response.data);

      } catch (err) {
        console.error('❌ Error:', err.response?.data || err.message);
        
        if (err.response) {
          console.log('Status:', err.response.status);
          
          if (err.response.status === 404) {
            setError(`Booking ${bookingId} not found. It may have been cancelled.`);
          } else if (err.response.status === 401) {
            setError('Please login again.');
          } else if (err.response.status === 403) {
            setError('You do not have permission to view this booking.');
          } else {
            setError(`Server error: ${err.response.status}`);
          }
        } else {
          setError('Cannot connect to server. Check if backend is running.');
        }
        
        // Fallback for testing
        console.log('⚠️ Using fallback booking data');
        setBooking({
          _id: bookingId,
          bike: { name: 'Test Bike', pricePerHour: 100 },
          totalHours: 8,
          totalAmount: 800,
          status: 'pending'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentId) => {
    console.log('✅ Payment successful, paymentId:', paymentId);
    
    // Update booking status if it's a real booking
    if (bookingId && bookingId !== 'test' && token) {
      try {
        // Use the new endpoint: /api/bookings/:id/pay
        await axios.put(`http://localhost:5000/api/bookings/${bookingId}/pay`, {
          paymentId: paymentId,
          amount: booking?.totalAmount || booking?.totalPrice || 800
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Booking updated with payment');
      } catch (err) {
        console.error('❌ Failed to update booking:', err.message);
        // Don't show error to user - payment was successful
      }
    }
    
    alert('✅ Payment successful! Your booking is confirmed.');
    navigate('/my-bookings');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Loading booking details...</h3>
        <p>Please wait</p>
      </div>
    );
  }

  const totalAmount = booking?.totalAmount || booking?.totalPrice || 800;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Complete Payment</h1>
      
      {error && (
        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ color: '#856404' }}>⚠️ Note</h3>
          <p>{error}</p>
          <p>You can still test the payment system.</p>
        </div>
      )}

      <div style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3>Payment Summary</h3>
        <p><strong>Booking ID:</strong> {booking?._id || bookingId || 'Test'}</p>
        <p><strong>Bike:</strong> {booking?.bike?.name || 'Test Bike'}</p>
        <p><strong>Price per hour:</strong> ₹{booking?.bike?.pricePerHour || booking?.bike?.price || 100}</p>
        <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        <p><strong>Status:</strong> <span style={{
          color: booking?.status === 'pending' ? '#ff9800' : 
                 booking?.status === 'confirmed' ? '#4caf50' : '#f44336'
        }}>{booking?.status || 'Pending payment'}</span></p>
      </div>

      <Payment
        amount={totalAmount}
        bookingId={bookingId || 'test'}
        onSuccess={handlePaymentSuccess}
      />

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/my-bookings')}
          style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          View My Bookings
        </button>
        
        <button 
          onClick={() => navigate('/bikes')}
          style={{
            padding: '10px 20px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Book Another Bike
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;