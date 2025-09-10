import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Payment() {
  const { studentId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePayment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/newreg/pay_fee/${studentId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Network error");
      }

      const result = await response.json();
      setPaymentStatus(result.message);
      setErrorMessage("");
    } catch (err) {
      setPaymentStatus(null);
      setErrorMessage(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Page</h2>
      <p>Student ID: {studentId}</p>
      <button onClick={handlePayment}>Pay Now</button>
      {paymentStatus && <p style={{ color: "green" }}>{paymentStatus}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
