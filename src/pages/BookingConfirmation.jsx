import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bikeName, bikeImage, startDate, endDate, totalPrice } = location.state || {};

  if (!bikeName) {
    // If page opened directly without booking
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#dc3545" }}>No booking found!</h2>
        <p>Please make a booking first.</p>
        <button style={styles.button} onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Booking Confirmed!</h1>

        <img
          src={bikeImage || "/images/default-bike.jpg"}
          alt={bikeName}
          style={styles.image}
        />

        <h2 style={styles.bikeName}>{bikeName}</h2>
        <p style={styles.dates}>
          <strong>From:</strong> {new Date(startDate).toLocaleDateString()} <br />
          <strong>To:</strong> {new Date(endDate).toLocaleDateString()}
        </p>

        <p style={styles.totalPrice}>
          <strong>Total Price:</strong> Rs. {totalPrice}
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, backgroundColor: "#28a745" }}
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>

          <button
            style={{ ...styles.button, backgroundColor: "#007bff" }}
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles (you can move to CSS or Tailwind)
const styles = {
  container: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f8f9fa",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    color: "#28a745",
    marginBottom: "20px",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  bikeName: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  dates: {
    fontSize: "1rem",
    marginBottom: "10px",
    color: "#495057",
  },
  totalPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    padding: "10px 15px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default BookingConfirmation;