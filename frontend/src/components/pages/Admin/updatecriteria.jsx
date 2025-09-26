import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateCriteria() {
  const [criteria, setCriteria] = useState({
    application_payment: "",
    initial_payment: "",
    caution_deposit: "",
    annual_fee_year1: "",
    annual_fee_year2: "",
    cutoff_percentage: "",
  });

  const [message, setMessage] = useState("");

  // Fetch existing criteria from backend when page loads
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const res = await axios.get("http://localhost:5000/feedetail");
        if (res.data) {
          setCriteria({
            application_payment: res.data.application_payment || "",
            initial_payment: res.data.initial_payment || "",
            caution_deposit: res.data.caution_deposit || "",
            annual_fee_year1: res.data.annual_fee_year1 || "",
            annual_fee_year2: res.data.annual_fee_year2 || "",
            cutoff_percentage: res.data.cutoff_percentage || "",
          });
        }
      } catch (err) {
        console.error("Error fetching criteria:", err);
      }
    };
    fetchCriteria();
  }, []);

  const handleChange = (e) => {
    setCriteria({
      ...criteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/feedetails/update", criteria);
      setMessage(res.data.message || "Criteria updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating criteria.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Fee Criteria</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
  <div className="mb-3">
          <label>Application fee Amount</label>
          <input
            type="number"
            name="application_payment"
            value={criteria.application_payment}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

          <label>Initial Payment Amount</label>
          <input
            type="number"
            name="initial_payment"
            value={criteria.initial_payment}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Caution Deposit</label>
          <input
            type="number"
            name="caution_deposit"
            value={criteria.caution_deposit}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Annual Fee (Year 1)</label>
          <input
            type="number"
            name="annual_fee_year1"
            value={criteria.annual_fee_year1}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Annual Fee (Year 2)</label>
          <input
            type="number"
            name="annual_fee_year2"
            value={criteria.annual_fee_year2}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Cutoff % for Next Year</label>
          <input
            type="number"
            name="cutoff_percentage"
            value={criteria.cutoff_percentage}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Save Criteria</button>
      </form>
    </div>
  );
}
