import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/MyBookings.css"; // <-- correct path

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        if (!token) return alert("Please login");

        const res = await api.get("/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="loading">Loading bookings...</p>;

  return (
    <div className="my-bookings-container">
      <h1>My Bookings ✅</h1>

      {bookings.length === 0 && <p className="empty">No bookings found.</p>}

      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            {booking.bike?.image && (
              <img src={booking.bike.image} alt={booking.bike.name} />
            )}
            <div className="booking-info">
              <h2>{booking.bike?.name}</h2>
              <p>
                <strong>From:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p className="price">Rs. {booking.totalPrice}</p>
              <span className="status confirmed">Booking Confirmed ✔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
