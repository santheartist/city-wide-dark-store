import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logix.png";  // Adjust the path to your logo image

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo Image */}
      <div className="logo">
        <img src={logo} alt="OptiStore Logo" style={{ height: "40px" }} /> {/* Use the imported logo */}
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
