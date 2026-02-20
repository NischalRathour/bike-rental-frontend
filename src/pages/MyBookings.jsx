import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { FaMotorcycle, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // ✅ 1. We use api.get - the interceptor handles the token automatically
        // ✅ 2. We hit the /my endpoint which we reordered in the backend
        const res = await api.get("/bookings/my");

        // ✅ 3. HANDLE NESTED DATA: backend sends { success: true, bookings: [] }
        if (res.data && res.data.success) {
          setBookings(res.data.bookings);
        } else if (Array.isArray(res.data)) {
          // Fallback if backend sends raw array
          setBookings(res.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Unable to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Fetching your Kathmandu rides...</p>
    </div>
  );

  return (
    <div className="my-bookings-container">
      <header className="bookings-header">
        <h1>My Bookings ✅</h1>
        <p>Manage your current and past rentals</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaExclamationCircle size={50} color="#cbd5e0" />
          <h2>No bookings found.</h2>
          <p>You haven't made any bookings yet.</p>
          <button onClick={() => navigate("/bikes")} className="btn-primary">
            Browse Available Bikes
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card-advanced">
              <div className="card-image-wrapper">
                <img 
                  src={booking.bike?.image || "/images/default-bike.jpg"} 
                  alt={booking.bike?.name} 
                />
                <div className={`status-pill ${booking.status.toLowerCase()}`}>
                  {booking.status === 'Confirmed' ? <FaCheckCircle /> : null} {booking.status}
                </div>
              </div>

              <div className="booking-info">
                <h2>{booking.bike?.name}</h2>
                <div className="info-row">
                  <FaCalendarAlt className="icon" />
                  <span>
                    {new Date(booking.startDate).toLocaleDateString('en-IN')} - {new Date(booking.endDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                
                <div className="price-status-row">
                  <span className="price">Rs. {booking.totalPrice}</span>
                  <span className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
                    {booking.paymentStatus === 'Paid' ? '✓ Paid' : 'Pending Payment'}
                  </span>
                </div>

                {booking.paymentStatus !== 'Paid' && (
                  <button 
                    className="pay-btn"
                    onClick={() => navigate(`/payment/${booking._id}`)}
                  >
                    Complete Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;