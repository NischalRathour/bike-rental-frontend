import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use global Auth
import api from "../api/axiosConfig";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // ✅ Get user from context

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await api.get(`/bikes/${id}`);
        setBike(res.data);
      } catch (err) {
        setError("Failed to load bike details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleBooking = async () => {
    if (!date) {
      alert("Please select a start date");
      return;
    }

    if (!user || user.role !== 'customer') {
      alert("Only customers can make bookings. Please login as a customer.");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));
      const totalPrice = bike.price * days;

      // ✅ Dates as ISO strings for Mongoose compatibility
      const res = await api.post("/bookings", {
        bike: bike._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        days: Number(days)
      });

      // Pass state to the next page for the advanced confirmation view
      const bookingId = res.data._id || res.data.booking?._id;
      
      alert(`✅ Booking successful!\nTotal: Rs. ${totalPrice}`);
      
      // Navigate to payment with the specific booking ID
      navigate(`/payment/${bookingId}`);
      
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      setError(msg);
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) return <p style={{ padding: "50px", textAlign: "center" }}>Loading details...</p>;
  if (!bike) return <p style={{ padding: "50px", textAlign: "center" }}>Bike not found</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Confirm Booking</h1>
      
      <img
        src={bike.image || "/images/default-bike.jpg"}
        alt={bike.name}
        style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>{bike.name}</h2>
        <p style={{ color: "#666" }}>{bike.description}</p>
        <p><strong>Rate:</strong> Rs. {bike.price} / day</p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Pickup Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Duration (Days):</label>
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px" }}
        />
      </div>

      <div style={{ padding: "15px", background: "#f0f9ff", borderLeft: "5px solid #007bff", borderRadius: "5px", marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#007bff" }}>
          Total Price: Rs. {bike.price * days}
        </p>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#555" }}>
          {days} {days > 1 ? 'days' : 'day'} at Rs. {bike.price}/day
        </p>
      </div>

      {error && <p style={{ color: "#dc3545", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

      <button
        onClick={handleBooking}
        disabled={bookingLoading || !date}
        style={{
          width: "100%",
          padding: "15px",
          background: bookingLoading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: bookingLoading || !date ? "not-allowed" : "pointer"
        }}
      >
        {bookingLoading ? "Processing..." : "Confirm & Proceed to Payment"}
      </button>
    </div>
  );
};

export default Booking;