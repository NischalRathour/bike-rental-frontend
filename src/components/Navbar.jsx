import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar(){
  const token = localStorage.getItem("token");
  return (
    <nav className="nav">
      <div className="brand"><Link to="/">Ride N Roar</Link></div>
      <div className="links">
        <Link to="/bikes">Bikes</Link>
        {token ? <Link to="/dashboard">Dashboard</Link> : <><Link to="/login">Login</Link> <Link to="/register">Register</Link></>}
      </div>
    </nav>
  );
}
