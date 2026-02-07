import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        alert("Failed to load bike");
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

    // ✅ CORRECT token - axios expects token_user for customer
    const token = localStorage.getItem("token_user");
    
    if (!token) {
      alert("Please login as customer\n\nToken should be saved as 'token_user'");
      return;
    }

    // Quick token check
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log("Token role:", decoded.role);
      
      if (decoded.role !== 'customer') {
        alert(`Wrong account type!\n\nYou are: ${decoded.role}\nNeed: customer\n\nPlease login as customer.`);
        return;
      }
    } catch (e) {
      console.error("Invalid token:", e);
    }

    setBookingLoading(true);
    setError("");

    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days));
      const totalPrice = bike.price * days;

      console.log("Booking request:", {
        bike: bike._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
        days: Number(days)
      });

      // ✅ FIXED: Dates as ISO strings, include days field
      await api.post("/bookings", {
        bike: bike._id,
        startDate: startDate.toISOString(),  // ✅ Convert to ISO string
        endDate: endDate.toISOString(),      // ✅ Convert to ISO string
        totalPrice,
        days: Number(days)                    // ✅ Add days field
      });

      alert(`✅ Booking successful!\n\nTotal: Rs. ${totalPrice}`);
      navigate(`/payment/${bike._id}?amount=${totalPrice}`);
      
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      
      if (err.response?.status === 403) {
        setError("Access denied. Make sure you're logged in as customer.");
        alert("ACCESS DENIED!\n\nYou need to be logged in as CUSTOMER.\n\nCheck that:\n1. Token is saved as 'token_user'\n2. Your role is 'customer' in the token");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid data");
        alert(`Invalid data: ${err.response.data?.message}`);
      } else {
        setError(err.response?.data?.message || "Booking failed");
        alert(err.response?.data?.message || "Booking failed. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Login helper
  const loginAsCustomer = async () => {
    try {
      // Clear old tokens
      localStorage.removeItem("token_user");
      localStorage.removeItem("token_owner");
      
      const response = await api.post("/users/login", {
        email: "test123@gmail.com",
        password: "123456"
      });
      
      // ✅ Save as token_user (what axios expects)
      localStorage.setItem("token_user", response.data.token);
      
      alert("✅ Logged in as customer!");
      window.location.reload();
      
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check credentials.");
    }
  };

  // Clear tokens
  const clearTokens = () => {
    localStorage.removeItem("token_user");
    localStorage.removeItem("token_owner");
    alert("Tokens cleared. Please login again.");
    window.location.reload();
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading bike details...</p>;
  if (!bike) return <p style={{ padding: "20px" }}>Bike not found</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1>Book {bike.name}</h1>
      
      {/* Debug info */}
      <div style={{ padding: "10px", background: "#f5f5f5", marginBottom: "15px", borderRadius: "5px" }}>
        <p style={{ margin: "0 0 10px 0" }}><strong>Token Status:</strong> {localStorage.getItem("token_user") ? "✅ Found" : "❌ Missing"}</p>
        <button 
          onClick={loginAsCustomer} 
          style={{ padding: "8px 12px", marginRight: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "4px" }}
        >
          Login as Customer
        </button>
        <button 
          onClick={clearTokens}
          style={{ padding: "8px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
        >
          Clear Tokens
        </button>
      </div>

      {error && (
        <div style={{ padding: "10px", background: "#f8d7da", color: "#721c24", marginBottom: "15px", borderRadius: "5px" }}>
          {error}
        </div>
      )}

      <img
        src={bike.images?.[0] || "/images/default-bike.jpg"}
        alt={bike.name}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "15px" }}
      />

      <p><strong>Price:</strong> Rs. {bike.price} / day</p>
      <p style={{ marginBottom: "20px" }}>{bike.description}</p>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Start Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Number of Days:</label>
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
        />
      </div>

      <div style={{ padding: "15px", background: "#e8f5e8", borderRadius: "5px", marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "18px" }}><strong>Total Price:</strong> Rs. {bike.price * days}</p>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
          {days} day{days > 1 ? 's' : ''} × Rs. {bike.price}/day
        </p>
      </div>

      <button
        onClick={handleBooking}
        disabled={bookingLoading || !date}
        style={{
          width: "100%",
          padding: "12px",
          background: bookingLoading ? "#6c757d" : (!date ? "#adb5bd" : "#007BFF"),
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: bookingLoading || !date ? "not-allowed" : "pointer"
        }}
      >
        {bookingLoading ? "Processing..." : (!date ? "Select Date First" : "Confirm Booking")}
      </button>
    </div>
  );
};

export default Booking;