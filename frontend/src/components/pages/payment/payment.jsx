import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// It's a security risk to have this key here. You should load this from an environment variable.
const stripePromise = loadStripe("pk_test_51S6D60Rz40SdBfbAF5SwGKccjfqf6qPb3SRHmocPzblkHAHaADgt2FmfKfp4ASkotvcS64B4aUYDGbLjUbl6kwRs00RipurT8f");

const CheckoutForm = ({ studentEmail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const amount = 500; // ₹500 fixed

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const res = await fetch("http://localhost:5000/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email: studentEmail })
      });
      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Redirecting...");
        
        // This confirms the payment on the backend
        await fetch("http://localhost:5000/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: studentEmail })
        });
        
        // This redirects the user to the home page
        navigate("/");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Pay ₹500</h2>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe} style={{ marginTop: "20px", padding: "12px 20px", fontSize: "16px", borderRadius: "8px", background: "#4cafef", color: "#fff", border: "none", cursor: "pointer" }}>
        Pay Now
      </button>
      <p style={{ marginTop: "15px", color: "#555" }}>{message}</p>
    </form>
  );
};

const Payment = () => {
  const { studentEmail } = useParams(); // get email from URL
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm studentEmail={studentEmail} />
    </Elements>
  );
};

export default Payment;