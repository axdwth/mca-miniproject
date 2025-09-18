import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51S6D60Rz40SdBfbAF5SwGKccjfqf6qPb3SRHmocPzblkHAHaADgt2FmfKfp4ASkotvcS64B4aUYDGbLjUbl6kwRs00RipurT8f");

function CheckoutForm({ student }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setMessage("Processing payment...");

    try {
      // 1️⃣ Create PaymentIntent
      const res = await fetch("http://localhost:5000/payment/create-payment-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50000, email: student.stud_email }),
      });

      const { client_secret, error } = await res.json();
      if (error) {
        setMessage(error);
        return;
      }

      // 2️⃣ Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeError) {
        setMessage("Payment failed: " + stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Saving student...");

        // 3️⃣ Save student in DB with fee_paid=true
        const data = new FormData();
        for (let key in student) {
          if (student[key] !== null && student[key] !== undefined) {
            data.append(key, student[key]);
          }
        }
        data.append("fee_paid", "true"); // 👈 force paid

        await fetch("http://localhost:5000/student_applications", {
          method: "POST",
          body: data,
        });

        navigate("/"); // redirect after success
      } else {
        setMessage("Payment not completed.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pay 20000 Application Fee</h2>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay Now</button>
      <p>{message}</p>
    </form>
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
  