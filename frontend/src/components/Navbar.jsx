import React from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Import useLocation
import "../styles/Navbar.css";
import Asiet from "../../public/assets/8784_logo (3).png";

export default function Navbar() {
  const location = useLocation(); // ✅ Get the current location object

  // --- Logic to hide Navbar ---
  // Check if the current path is an admin or student dashboard route
  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/student");

  if (isDashboardRoute) {
    return null; // Don't render anything if it's a dashboard route
  }
  // --- End of logic ---


  // Check login status from sessionStorage
  const loggedIn = sessionStorage.getItem("logged_in") === "true";

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    sessionStorage.removeItem("logged_in");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={Asiet} alt="ASIET" />
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#2f8cd6",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}