import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

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

    // ✅ Only Customers can book
    if (!user || user.role !== 'customer') {
      alert("Access Denied: Only customers can make bookings.");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));
      const totalPrice = bike.price * days;

      // ✅ Dates as ISO strings for Mongoose
      const res = await api.post("/bookings", {
        bike: bike._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        days: Number(days)
      });

      const bookingId = res.data.booking?._id || res.data._id;
      alert(`✅ Booking successful! Total: Rs. ${totalPrice}`);
      navigate(`/payment/${bookingId}`); // Proceed to payment
      
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed.";
      setError(msg);
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) return <p style={{ padding: "50px", textAlign: "center" }}>Syncing session...</p>;
  if (!bike) return <p style={{ padding: "50px", textAlign: "center" }}>Bike not found</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Confirm Booking</h1>
      <img src={bike.image || "/images/default-bike.jpg"} alt={bike.name} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }} />
      <div style={{ marginBottom: "20px" }}>
        <h2>{bike.name}</h2>
        <p><strong>Rate:</strong> Rs. {bike.price} / day</p>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Pickup Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px" }} min={new Date().toISOString().split('T')[0]} />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>Duration (Days):</label>
        <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} style={{ width: "100%", padding: "12px" }} />
      </div>
      <div style={{ padding: "15px", background: "#f0f9ff", borderRadius: "5px", marginBottom: "20px" }}>
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>Total Price: Rs. {bike.price * days}</p>
      </div>
      <button onClick={handleBooking} disabled={bookingLoading || !date} style={{ width: "100%", padding: "15px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        {bookingLoading ? "Processing..." : "Confirm & Proceed to Payment"}
      </button>
    </div>
  );
};

export default Booking;