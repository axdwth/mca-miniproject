import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, role }) {
  const [auth, setAuth] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/check_session", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.logged_in && (!role || data.role === role)) {
          setAuth({ loading: false, allowed: true });
        } else {
          setAuth({ loading: false, allowed: false });
        }
      } catch (err) {
        setAuth({ loading: false, allowed: false });
        print("Error checking session:", err);
      }
    };

    checkSession();
  }, [role]);

  if (auth.loading) {
    return (  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <CircularProgress />
                </Box>) // you can replace with spinner
  }
{/*
  if (!auth.allowed) {
    return <Navigate to="/login" replace />;
  }
*/}
  return children;  
}
