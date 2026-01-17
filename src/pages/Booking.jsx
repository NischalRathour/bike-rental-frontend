import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig"; // Make sure baseURL = http://localhost:5000/api

const Booking = () => {
  const { id } = useParams(); // Bike ID from URL
  const navigate = useNavigate();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true); // Loading bike details
  const [bookingLoading, setBookingLoading] = useState(false); // Booking process
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);

  // Fetch bike details from backend
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await axios.get(`/bikes/${id}`);
        setBike(res.data);
      } catch (err) {
        console.error("Error fetching bike:", err);
        alert("Failed to load bike details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [id]);

  // Handle booking
  const handleBooking = async () => {
    if (!date) return alert("Please select a start date.");

    const token = localStorage.getItem("customerToken");
    if (!token) return alert("You must be logged in as a Customer to book.");

    setBookingLoading(true);

    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Number(days) - 1);

      // Send booking request
      await axios.post(
        "/bookings",
        {
          bikeId: bike._id,
          from: startDate.toISOString().split("T")[0],
          to: endDate.toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Booking confirmed for ${bike.name}!`);
      navigate("/my-bookings"); // Redirect to customer's booking page
    } catch (err) {
      console.error("Booking failed:", err);
      const msg =
        err.response?.data?.message ||
        "Booking failed! Please check availability or try again.";
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  // Show loading or error
  if (loading) return <p>Loading bike details...</p>;
  if (!bike) return <p>Bike not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Booking: {bike.name}</h1>
      <img
        src={bike.images?.[0] || "/images/default-bike.jpg"}
        alt={bike.name}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
      <p>Price: Rs. {bike.price} / day</p>
      <p>{bike.description}</p>

      <div style={{ marginTop: "20px" }}>
        <label>
          Select Start Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              display: "block",
              marginTop: "5px",
              padding: "5px",
              width: "100%",
            }}
          />
        </label>

        <label style={{ marginTop: "10px", display: "block" }}>
          Number of Days:
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{
              display: "block",
              marginTop: "5px",
              padding: "5px",
              width: "100%",
            }}
          />
        </label>

        <p style={{ marginTop: "10px" }}>
          <strong>Total Price: Rs. {bike.price * days}</strong>
        </p>

        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
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
    </div>
  );
};

export default Booking;
