import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";  // ✅ import external css
import Asiet from"../../public/assets/8784_logo (3).png"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={Asiet} alt="ASIET" />
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/admin">Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
