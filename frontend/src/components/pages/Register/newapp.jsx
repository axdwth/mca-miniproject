import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for programmatic navigation
import "../../../styles/ApplicationForm.css";

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    stud_name: "",
    stud_email: "",
    stud_dob: "",
    stud_phone: "",
    stud_address: "",
    stud_gender: "",
    stud_religion: "",
    stud_nationality: "",
    stud_category: "",
    sslc_year: "",
    sslc_marks: "",
    plustwo_year: "",
    plustwo_marks: "",
    ug_year: "",
    ug_marks: "",
    stud_qualification: "",
    entrance_exam_score: "",
    stud_addmission_type: "",
    father_name: "",
    father_phone: "",
    mother_name: "",
    mother_phone: "",
    stud_photo: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // useNavigate hook

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      }

      const res = await fetch("http://localhost:5000/newreg/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        const studentEmail = result.data.stud_email; 
        setMessage("Application Submitted Successfully");

    
        setFormData({
          stud_name: "",
          stud_email: "",
          stud_dob: "",
          stud_phone: "",
          stud_address: "",
          stud_gender: "",
          stud_religion: "",
          stud_nationality: "",
          stud_category: "",
          sslc_year: "",
          sslc_marks: "",
          plustwo_year: "",
          plustwo_marks: "",
          ug_year: "",
          ug_marks: "",
          stud_qualification: "",
          entrance_exam_score: "",
          stud_addmission_type: "",
          father_name: "",
          father_phone: "",
          mother_name: "",
          mother_phone: "",
          stud_photo: null,
        });

        navigate(`/newreg/payfee/${studentEmail}`);
      } else {
        setMessage(result.message || "Submission failed");
      }
    } catch (err) {
      
      setMessage("Submission failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>MCA Registration</h1>

      {/* Personal Details */}
      <input type="text" name="stud_name" value={formData.stud_name} onChange={handleChange} placeholder="Full Name" required />
      <input type="email" name="stud_email" value={formData.stud_email} onChange={handleChange} placeholder="Email" required />
      <input type="date" name="stud_dob" value={formData.stud_dob} onChange={handleChange} required />
      <input type="text" name="stud_phone" value={formData.stud_phone} onChange={handleChange} placeholder="Phone" required />
      <input type="text" name="stud_address" value={formData.stud_address} onChange={handleChange} placeholder="Address" required />
      <select name="stud_gender" value={formData.stud_gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input type="text" name="stud_religion" value={formData.stud_religion} onChange={handleChange} placeholder="Religion" required />
      <select name="stud_category" value={formData.stud_category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="General">General</option>
        <option value="OBC">OBC</option>
        <option value="SC/ST">SC/ST</option>
      </select>
      <input type="text" name="stud_nationality" value={formData.stud_nationality} onChange={handleChange} placeholder="Nationality" required />

      {/* Upload */}
      <label>Student Photo</label>
      <input type="file" name="stud_photo" onChange={handleChange} required />

      <button type="submit">Submit Application</button>
      <p>{message}</p>
    </form>
  );
}
