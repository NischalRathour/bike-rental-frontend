import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig"; // baseURL = http://localhost:5000/api


const Booking = () => {
  const { id } = useParams(); // bike id from URL
  const navigate = useNavigate();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);

  // Fetch bike details
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await api.get(`/bikes/${id}`);
        setBike(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load bike details");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [id]);

  // Handle booking
  const handleBooking = async () => {
    if (!date) return alert("Please select a start date");

    const token = localStorage.getItem("customerToken");
    if (!token) return alert("Please login as customer to book");

    setBookingLoading(true);

    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));

      const totalPrice = bike.price * days;

      await api.post(
        "/bookings",
        {
          bike: bike._id,       // ✅ REQUIRED
          startDate,            // ✅ REQUIRED
          endDate,              // ✅ REQUIRED
          totalPrice            // ✅ REQUIRED
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     alert(`Booking confirmed for ${bike.name}`);
navigate(`/payment/${bike._id}?amount=${totalPrice}`);

    } catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading bike details...</p>;
  if (!bike) return <p style={{ padding: "20px" }}>Bike not found</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Book: {bike.name}</h1>

      <img
        src={bike.images?.[0] || "/images/default-bike.jpg"}
        alt={bike.name}
        style={{ width: "100%", borderRadius: "10px" }}
      />

      <p><strong>Price:</strong> Rs. {bike.price} / day</p>
      <p>{bike.description}</p>

      <label>
        Start Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", marginTop: "5px", padding: "6px" }}
        />
      </label>

      <label style={{ display: "block", marginTop: "10px" }}>
        Number of Days:
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ width: "100%", marginTop: "5px", padding: "6px" }}
        />
      </label>

      <p style={{ marginTop: "10px" }}>
        <strong>Total Price:</strong> Rs. {bike.price * days}
      </p>

      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "10px",
          backgroundColor: bookingLoading ? "#6c757d" : "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: bookingLoading ? "not-allowed" : "pointer",
        }}
      >
        {bookingLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default Booking;
