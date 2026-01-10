import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig"; // Your Axios setup

const Booking = () => {
  const { id } = useParams(); // Get bike ID from URL
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await axios.get(`/bikes/${id}`); // Fetch single bike
        setBike(res.data);
      } catch (err) {
        console.error("Error fetching bike:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleBooking = () => {
    alert(`Booking confirmed for ${bike.name} on ${date} for ${days} day(s)!`);
    // Here you can call backend to save booking
  };

  if (loading) return <p>Loading bike details...</p>;
  if (!bike) return <p>Bike not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Booking: {bike.name}</h1>
      <img
        src={bike.images[0] || "/images/default-bike.jpg"}
        alt={bike.name}
        style={{ maxWidth: "100%", borderRadius: "8px" }}
      />
      <p>Price: Rs. {bike.price} / day</p>
      <p>{bike.description}</p>

      <div style={{ marginTop: "20px" }}>
        <label>
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ display: "block", marginTop: "5px", padding: "5px", width: "100%" }}
          />
        </label>

        <label style={{ marginTop: "10px", display: "block" }}>
          Number of Days:
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{ display: "block", marginTop: "5px", padding: "5px", width: "100%" }}
          />
        </label>

        <button
          onClick={handleBooking}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;
