import React, { useState } from "react";
import "../../../styles/ApplicationForm.css";
export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    // Personal
    stud_name: "",
    stud_email: "",
    stud_dob: "",
    stud_phone: "",
    stud_address: "",
    stud_gender: "",
    stud_religion: "",
    stud_nationality: "",
    stud_category: "",

    // Academics
    sslc_school: "",
    sslc_year: "",
    sslc_marks: "",
    plustwo_school: "",
    plustwo_year: "",
    plustwo_marks: "",
    ug_college: "",
    ug_year: "",
    ug_marks: "",
    stud_qualification: "",
    has_math: false,
    entrance_exam_score: "",

    // Parents
    father_name: "",
    father_occupation: "",
    father_phone: "",
    mother_name: "",
    mother_occupation: "",
    mother_phone: "",

    // File uploads
    stud_photo: null,
    stud_id: null,
    stud_10_certificate: null,
    stud_plustwo_certificate: null,
    stud_degree_certificate: null,

    // Declaration
    declaration: false,
  });
// Generate an array of years from start to end
const generateYears = (start, end) => {
  const years = [];
  for (let year = end; year >= start; year--) {
    years.push(year);
  }
  return years;
};

// Example: 2000 to current year
const currentYear = new Date().getFullYear();
const yearOptions = generateYears(1900, currentYear);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
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
        data.append(key, formData[key]);
      }

      const res = await fetch("http://localhost:5000/student_applications", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      setMessage(result.message || "Application Submitted Successfully");
    } catch (err) {
      setMessage("Submission failed", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <center>
        <div className="header">
      <h1>MCA REGISTRATION</h1>
      </div>
      </center>
    
      <h3>Personal Details</h3>
      <input
        type="text"
        name="stud_name"
        value={formData.stud_name}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        name="stud_email"
        value={formData.stud_email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="date"
        name="stud_dob"
        value={formData.stud_dob}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="stud_phone"
        value={formData.stud_phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        type="text"
        name="stud_address"
        value={formData.stud_address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <select
        name="stud_gender"
        value={formData.stud_gender}
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="text"
        name="stud_religion"
        value={formData.stud_religion}
        onChange={handleChange}
        placeholder="Religion"
        required
      />
        <select
        name="stud_category"
        value={formData.stud_category}
        onChange={handleChange}
        required
      >
        <option value="General">Select categroy</option>
    <option value="General">General</option>
  <option value="OBC">OBC</option>
  <option value="SC/ST">SC/ST</option>
  <option value="EWS">EWS</option>
      </select>
      <input
        type="text"
        name="stud_nationality"
        value={formData.stud_nationality}
        onChange={handleChange}
        placeholder="Nationality"
        required
      />
{/**10888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888 */}
      <h3>Academics</h3>
      <label>SSLC/10th</label><br/>
      <input
        type="text"
        name="sslc_school"
        value={formData.sslc_school}
        onChange={handleChange}
        placeholder="SSLC School"
        required
      />
    <select
  name="sslc_year"
  value={formData.sslc_year}
  onChange={handleChange}
  required
>
  <option value="">Select Year of passout</option>
  {yearOptions.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

      <input
        type="text"
        name="sslc_marks"
        value={formData.sslc_marks}
        onChange={handleChange}
        placeholder="SSLC Marks"
        required
      />
       <label>Upload 10th certificate</label>
      <input
        type="file"
        name="stud_10_certificate"
        onChange={handleChange}
        required
      />
      <br /><br />
      {/**1288888888888888888888888888888888888888888888888888888888888888888888888888888888888888 */}
      <label>PLUSTWO/12th</label><br />
      <input
        type="text"
        name="plustwo_school"
        value={formData.plustwo_school}
        onChange={handleChange}
        placeholder="Plus Two School"
        required
      />
    <select
  name="plustwo_year"
  value={formData.plustwo_year}
  onChange={handleChange}
  required
>
  <option value="">Select Year of passout</option>
  {yearOptions.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
      <input
        type="text"
        name="plustwo_marks"
        value={formData.plustwo_marks}
        onChange={handleChange}
        placeholder="Plus Two Marks"
        required
      />
      <label>Upload 12th certificate</label>
          <input
        type="file"
        name="stud_plustwo_certificate"
        onChange={handleChange}
        required
      /><br/>
{/**ug 88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888*/}
<label>DEGREE</label><br/>
      <input
        type="text"
        name="ug_college"
        value={formData.ug_college}
        onChange={handleChange}
        placeholder="UG College"
        required
      />
<select
  name="ug_year"
  value={formData.ug_year}
  onChange={handleChange}
  required
>
  <option value="">Select Year of passout</option>
  {yearOptions.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>
      <input
        type="text"
        name="ug_marks"
        value={formData.ug_marks}
        onChange={handleChange}
        placeholder="UG Marks"
        required
      />
      <label>Upload Degree or appropriate certificate</label>
      <input
        type="file"
        name="stud_degree_certificate"
        onChange={handleChange}
      />
      <input
        type="text"
        name="stud_qualification"
        value={formData.stud_qualification}
        onChange={handleChange}
        placeholder="Qualification  BSC, BCOM ,BCA,etc"
        required
      />
      <label>
        <input
          type="checkbox"
          name="has_math"
          checked={formData.has_math}
          onChange={handleChange}
        />
        Studied Mathematics
      </label>
      <br/><input
        type="text"
        name="entrance_exam_score"
        value={formData.entrance_exam_score}
        onChange={handleChange}
        placeholder="Entrance Exam Score"
      />

      <h3>Parents</h3>
<div className="row">
  <input
    type="text"
    name="father_name"
    value={formData.father_name}
    onChange={handleChange}
    placeholder="Father's Name"
    required
  />
  <input
    type="text"
    name="father_phone"
    value={formData.father_phone}
    onChange={handleChange}
    placeholder="Father's Phone"
  />
</div>
<div className="row">
  <input
    type="text"
    name="father_occupation"
    value={formData.father_occupation}
    onChange={handleChange}
    placeholder="Father's Occupation"
  />
  <input
    type="text"
    name="mother_name"
    value={formData.mother_name}
    onChange={handleChange}
    placeholder="Mother's Name"
  />
</div>
<div className="row">
  <input
    type="text"
    name="mother_occupation"
    value={formData.mother_occupation}
    onChange={handleChange}
    placeholder="Mother's Occupation"
  />
  <input
    type="text"
    name="mother_phone"
    value={formData.mother_phone}
    onChange={handleChange}
    placeholder="Mother's Phone"
  />
</div>

      <h3>Uploads</h3>
      <label htmlFor="">Student Photo</label>
      <input type="file" name="stud_photo" onChange={handleChange} required />
      <label htmlFor="">Student id proof</label>
      <input type="file" name="stud_id" onChange={handleChange} required />
  <h3>Mode of Admission</h3>
        <select
        name="stud_addmission_type"
        value={formData.stud_addmission_type}
        onChange={handleChange}
        required
      >
        <option value="">Select </option>
    <option value="Lbs Quota">Lbs/Merit</option>
  <option value="Management Quota">Management</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="declaration"
          checked={formData.declaration}
          onChange={handleChange}
          required
        />
        I hereby declare that all details are true
      </label>

      <button type="submit">Submit Application</button>
      <p>{message}</p>
    </form>
  );
}
