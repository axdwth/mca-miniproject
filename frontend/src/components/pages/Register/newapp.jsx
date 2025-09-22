import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    stud_id: null,
  });
console.log(setFormData);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
  stud_phone: "",
  father_phone: "",
  mother_phone: "",
});


  const handleChange = (e) => {
  const { name, type, value, files } = e.target;

  if (type === "file") {
    setFormData({ ...formData, [name]: files[0] });
  } else {
    setFormData({ ...formData, [name]: value });
  }

  // Validate phone numbers live
  if (["stud_phone", "father_phone", "mother_phone"].includes(name)) {
    if (!/^\d{0,10}$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only digits allowed (max 10)",
      }));
    } else if (value.length > 0 && value.length < 10) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Must be 10 digits",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setMessage("message",errors);
  }
};


const handleSubmit = (e) => {
  e.preventDefault();

  if (
    formData.father_phone.length === 10 &&
    formData.mother_phone.length === 10 &&
    formData.stud_phone.length === 10
  ) {
    setMessage("Redirecting to payment...");
    navigate(`/newreg/payfee/${formData.stud_email}`, {
      state: { student: { ...formData } },
    });
  } else {
    setMessage("Please correct phone number errors before submitting.");
  }
};
// Example: last 50 years till current year
const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);


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

      {/* Academic Details */}
      <h3>Academic Information</h3>
  <select
  name="sslc_year"
  value={formData.sslc_year}
  onChange={handleChange}
  required
>
  <option value="">Select SSLC Year</option>
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

      <input type="text" name="sslc_marks" value={formData.sslc_marks} onChange={handleChange} placeholder="SSLC Marks" required />
<select
  name="plustwo_year"
  value={formData.plustwo_year}
  onChange={handleChange}
  required
>
  <option value="">Select Plus Two Year</option>
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

      <input type="text" name="plustwo_marks" value={formData.plustwo_marks} onChange={handleChange} placeholder="Plus Two Marks" required />
<select
  name="ug_year"
  value={formData.ug_year}
  onChange={handleChange}
>
  <option value="">Select UG Passing Year</option>
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
      <input type="text" name="ug_marks" value={formData.ug_marks} onChange={handleChange} placeholder="UG Marks" />

      <input type="text" name="stud_qualification" value={formData.stud_qualification} onChange={handleChange} placeholder="Highest Qualification" required />
      <input type="text" name="entrance_exam_score" value={formData.entrance_exam_score} onChange={handleChange} placeholder="Entrance Exam Score" />

      <select name="stud_addmission_type" value={formData.stud_addmission_type} onChange={handleChange} required>
        <option value="">Select Admission Type</option>
        <option value="merit">Merit</option>
        <option value="management">Management</option>
      </select>

      {/* Parent Details */}
      <h3>Parent Details</h3>
      <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} placeholder="Father's Name" required />
      <input type="text" name="father_phone" value={formData.father_phone} onChange={handleChange} placeholder="Father's Phone" required />

      <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} placeholder="Mother's Name" required />
      <input type="text" name="mother_phone" value={formData.mother_phone} onChange={handleChange} placeholder="Mother's Phone" required />

      {/* Upload */}
      <label>Student Photo</label>
      <input type="file" name="stud_photo" onChange={handleChange} required />

      <label>Student Id proof</label>
      <input type="file" name="stud_id" onChange={handleChange} required />

      <button type="submit">Submit Application</button>
      <p>{message}</p>
    </form>
  );
}
