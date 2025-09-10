import React from "react";
import "../../../styles/Homepage.css";
import { Link } from "react-router-dom"; // make sure path is correct
import Login from './../Login/Login';

export default function Home() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to MCA Department</h1>
          <p>
            Your gateway to knowledge, innovation, and a bright career in
            Computer Applications.
          </p>
        <Link to="/newregistration">
  <button className="btn primary">Register Now</button>
</Link>
        <Link to="/login">
        <button className="btn secondary">Login</button>
        </Link>
        </div>
      </header>

      {/* About / Info Section */}
      <section className="about">
        <div className="about-content">
          <h2>About MCA</h2>
          <p>
            The Master of Computer Applications (MCA) program is designed to
            prepare students for the ever-evolving IT industry. With expert
            faculty, modern labs, and an innovative curriculum, we provide the
            best platform to build your career in technology.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MCA Department. All rights reserved.</p>
      </footer>
    </div>
  );
}
