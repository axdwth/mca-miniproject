import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon for rejected status
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'; // Icon for empty state

// Renamed component for clarity
export default function RejectedApplications() {
  // Renamed state to match the data being fetched
  const [rejectedApps, setRejectedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        const response = await fetch("http://localhost:5000/applications/rejected");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRejectedApps(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch rejected applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejected();
  }, []);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message if the fetch fails
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load applications. Please try again later. — {error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Rejected Applications
      </Typography>

      {rejectedApps.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <DoNotDisturbOnIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary" mt={2}>
            No applications have been rejected yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {rejectedApps.map((app) => (
            <Grid item key={app._id} xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: 'error.light',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {app.stud_name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                    Email: {app.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Application ID: {app._id}
                  </Typography>
                  <Chip
                    icon={<HighlightOffIcon />}
                    label="Rejected"
                    color="error" // 'error' color is red in MUI
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}