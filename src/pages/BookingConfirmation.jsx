import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FaCheckCircle, FaCalendarAlt, FaMotorcycle, FaArrowLeft, FaHistory } from "react-icons/fa";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bikeName, bikeImage, startDate, endDate, totalPrice, bookingId } = location.state || {};

  useEffect(() => {
    if (bikeName) {
      // Trigger Confetti on successful load
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#28a745", "#ffc107", "#007bff"]
      });
    }
  }, [bikeName]);

  if (!bikeName) {
    return (
      <div style={styles.errorContainer}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
          <h2 style={{ color: "#dc3545" }}>Session Expired</h2>
          <p>We couldn't find your recent booking details.</p>
          <button style={styles.homeBtn} onClick={() => navigate("/")}>
            <FaArrowLeft /> Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.card}
      >
        <div style={styles.successHeader}>
          <FaCheckCircle style={styles.successIcon} />
          <h1 style={styles.title}>Booking Confirmed!</h1>
          <p style={styles.subtitle}>Your ride is ready for the Kathmandu streets.</p>
        </div>

        <div style={styles.receiptContainer}>
          <div style={styles.imageWrapper}>
             <img src={bikeImage || "/images/default-bike.jpg"} alt={bikeName} style={styles.image} />
             <div style={styles.badge}>Reserved</div>
          </div>

          <div style={styles.infoSection}>
            <h2 style={styles.bikeName}>{bikeName}</h2>
            <div style={styles.idBadge}>ID: #{bookingId?.slice(-6).toUpperCase() || "BKR-882"}</div>
            
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <FaCalendarAlt style={styles.detailIcon} />
                <div>
                  <span style={styles.label}>Pickup</span>
                  <p style={styles.value}>{new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div style={styles.detailItem}>
                <FaCalendarAlt style={styles.detailIcon} />
                <div>
                  <span style={styles.label}>Return</span>
                  <p style={styles.value}>{new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.priceRow}>
              <span>Total Amount Paid</span>
              <span style={styles.priceText}>Rs. {totalPrice}</span>
            </div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.historyBtn} onClick={() => navigate("/my-bookings")}>
            <FaHistory /> My Bookings
          </button>
          <button style={styles.homeBtn} onClick={() => navigate("/")}>
            <FaMotorcycle /> Rent Another
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  successHeader: {
    marginBottom: "30px",
  },
  successIcon: {
    fontSize: "60px",
    color: "#28a745",
    marginBottom: "15px",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    margin: "0 0 10px 0",
    fontWeight: "800",
  },
  subtitle: {
    color: "#666",
    fontSize: "1.1rem",
  },
  receiptContainer: {
    textAlign: "left",
    backgroundColor: "#fcfcfc",
    border: "1px solid #eee",
    borderRadius: "15px",
    marginBottom: "30px",
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
  },
  badge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#28a745",
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  infoSection: {
    padding: "20px",
  },
  bikeName: {
    fontSize: "1.5rem",
    margin: "0 0 5px 0",
    color: "#222",
  },
  idBadge: {
    display: "inline-block",
    backgroundColor: "#e9ecef",
    padding: "3px 10px",
    borderRadius: "5px",
    fontSize: "0.8rem",
    color: "#495057",
    marginBottom: "20px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  detailIcon: {
    color: "#007bff",
    fontSize: "1.2rem",
  },
  label: {
    display: "block",
    fontSize: "0.75rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  value: {
    margin: 0,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: "1px",
    backgroundColor: "#eee",
    margin: "20px 0",
    borderStyle: "dashed",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "1.1rem",
  },
  priceText: {
    fontSize: "1.4rem",
    color: "#28a745",
    fontWeight: "800",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
  },
  historyBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#fff",
    color: "#333",
    border: "2px solid #333",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s",
  },
  homeBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s",
  },
};

export default BookingConfirmation;