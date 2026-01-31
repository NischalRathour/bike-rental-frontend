import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Main pages
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";
import CustomerDashboard from './pages/CustomerDashboard';

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import Navbar from "./components/Navbar";

// ✅ Initialize Stripe
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51SoGdhFOkjXvJLGw4VrVT3ZDm33c0xNtmAJNkyKki45CyNhBWswKYAzjBfpbHC7l5KCOmm2WzBjnCqkbmMRxmDFA001J2tI6Qm"
);

export default function App() {
  return (
    <Router>
      {/* Conditionally render Navbar - don't show on admin pages */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>
      
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/bikes/:id" element={<BikeDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
          
          {/* Protected User Routes - temporarily remove protection */}
          <Route path="/my-bookings" element={<MyBookings />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Elements>
    </Router>
  );
}

// ⚠️ REMOVE EVERYTHING BELOW THIS LINE - AdminLogin should be in its own file!