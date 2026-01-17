import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and any other stored user info
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo"); // if you store user info
    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="brand">
        <Link to="/">Ride N Roar</Link>
      </div>
      <div className="links">
        <Link to="/bikes">Bikes</Link>

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="btn btn-logout"
              style={{ marginLeft: "10px" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
