import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      // Step 1: Try login
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Login failed");
        return;
      }

      // Step 2: Check session
      const checkRes = await fetch("http://localhost:5000/check_session", {
        credentials: "include",
      });
      const checkData = await checkRes.json();

      if (checkData.logged_in) {
        setMessage("Login successful!");
        sessionStorage.setItem("logged_in", "true");
        if (checkData.role === "admin") {
          navigate("/admin/dashboard");
        } else if (checkData.role === "student") {
          navigate("/student/dashboard");
        } else {
          setMessage("Unknown role");
        }
      } else {
        setMessage("Session not found, try again");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };
  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="none  "
              required
              fullWidth
              id="username"
              label="Username or Email"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />  
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          {message && (
            <div
              className={`login-message ${
                message.includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </Box>
      </Container>
  );
}
