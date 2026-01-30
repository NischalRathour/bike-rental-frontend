import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";

// ✅ Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51SoGdhFOkjXvJLGw4VrVT3ZDm33c0xNtmAJNkyKki45CyNhBWswKYAzjBfpbHC7l5KCOmm2WzBjnCqkbmMRxmDFA001J2tI6Qm"
);

// ✅ Debug: Check if Stripe key is loaded
console.log("🔑 Stripe Key Loaded:", 
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? "Yes" : "No"
);

export default function App() {
  return (
    <Router>
      <Navbar />
      
      {/* ✅ WRAP YOUR APP WITH STRIPE ELEMENTS */}
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/bikes/:id" element={<BikeDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ Payment page now has Stripe context */}
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
        </Routes>
      </Elements>
    </Router>
  );
}