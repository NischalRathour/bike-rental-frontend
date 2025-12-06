import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <h2>Ride N Roar</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/bikes">Bikes</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
}
