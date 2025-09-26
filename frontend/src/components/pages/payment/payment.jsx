import React, { useState ,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Alert, Snackbar, Button, Box } from "@mui/material";

const stripePromise = loadStripe("pk_test_51S6D60Rz40SdBfbAF5SwGKccjfqf6qPb3SRHmocPzblkHAHaADgt2FmfKfp4ASkotvcS64B4aUYDGbLjUbl6kwRs00RipurT8f");

function CheckoutForm({ student }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);
const [appFee, setAppFee] = useState(null);

useEffect(() => {
  async function fetchAppFee() {
    const res = await fetch("http://localhost:5000/feedetails/");
    const data = await res.json();
    setAppFee(data.application_payment); 
  }
  fetchAppFee();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setMessage("Processing payment...");
    setSeverity("info");
    setOpen(true);


    
    try {
      // 1️⃣ Create PaymentIntent
      const res = await fetch("http://localhost:5000/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: appFee, email: student.stud_email }),
      });

      const { client_secret, error } = await res.json();
      if (error) {
        setMessage(error);
        setSeverity("error");
        setOpen(true);
        return;
      }

      // 2️⃣ Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeError) {
        setMessage("Payment failed: " + stripeError.message);
        setSeverity("error");
        setOpen(true);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Saving student...");
        setSeverity("success");
        setOpen(true);

        // 3️⃣ Save student in DB
        const data = new FormData();
        for (let key in student) {
          if (student[key] !== null && student[key] !== undefined) {
            data.append(key, student[key]);
          }
        }
        data.append("fee_paid", "true");

        await fetch("http://localhost:5000/newreg/register", {
          method: "POST",
          body: data,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage("Payment not completed.");
        setSeverity("error");
        setOpen(true);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
      <form onSubmit={handleSubmit}>
        <h2>Pay {appFee} Application Fee</h2>
        <Box sx={{ my: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <CardElement />
        </Box>
        <Button type="submit" variant="contained" color="primary" disabled={!stripe}>
          Pay Now
        </Button>
      </form>

      {/* Snackbar Alert */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={severity} onClose={() => setOpen(false)} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function Payment() {
  const location = useLocation();
  const student = location.state?.student;

  if (!student) {
    return <p>No student data. Please go back and fill the form.</p>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm student={student} />
    </Elements>
  );
}
