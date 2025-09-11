import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Payment() {
  const { studentId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePayment = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/newreg/pay_fee/${studentId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await response.json();
      if (result.message) {
        setPaymentStatus(result.message);
        setErrorMessage("");
      } else {
        setPaymentStatus(null);
        setErrorMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus(null);
      setErrorMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "30px",
          width: "380px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "20px",
          }}
        >
          Payment Portal
        </h2>

        <p style={{ textAlign: "center", color: "#4b5563", marginBottom: "15px" }}>
          Student ID: <span style={{ fontFamily: "monospace" }}>{studentId}</span>
        </p>

        <div
          style={{
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: "500", color: "#111827" }}>
            Amount: ₹500
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Application Fee</p>
        </div>

        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Pay Now
        </button>

        {paymentStatus && (
          <p style={{ marginTop: "20px", color: "green", textAlign: "center" }}>
            {paymentStatus}
          </p>
        )}
        {errorMessage && (
          <p style={{ marginTop: "20px", color: "red", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
