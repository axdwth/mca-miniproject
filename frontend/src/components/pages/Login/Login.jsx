import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../../styles/Login.css"; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError('');
    setEmail('');
    setPassword('');
    alert("Login successful ✅");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p className="login-footer">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      <p className="login-footer">
        Forgot your password? <Link to="/reset-password">Reset Password</Link>
      </p>
    </div>
  );
}
