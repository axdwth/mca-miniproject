import React from "react";
import { useNavigate } from "react-router-dom";

// Import Material-UI components
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function Setting() {
  const navigate = useNavigate();

  // An array to hold card data to avoid repetition
  const settingsCards = [
    {
      title: "Fee Criteria",
      description: "Manage initial payment, caution deposit, annual fees, cutoff %",
      buttonText: "Update Criteria",
      buttonColor: "primary",
      onClick: () => navigate("/admin/updatecriteria"),
    },
    {
      title: "Profile",
      description: "View or edit your profile and manage applications",
      buttonText: "View Profile",
      buttonColor: "success",
      onClick: () => navigate("/admin/profile"),
    },
    {
      title: "Department Info",
      description: "Update About, Contact, Timings",
      buttonText: "Manage Info",
      buttonColor: "warning",
      onClick: () => navigate("/manage-about"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        color="primary.main"
        fontWeight="bold"
      >
        Admin Settings
      </Typography>

      <Grid container spacing={4} mt={2} justifyContent="center">
        {settingsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                boxShadow: 3, // Add a subtle shadow
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  variant="contained"
                  color={card.buttonColor}
                  onClick={card.onClick}
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}