import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/ApplicationForm.css'; 
export default function Application_Form() {
  const [admissions, setAdmissions] = useState([]);
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name || !qualification || !email || !phone || !dob || !address) {
      alert('All fields are required');
      return;
    }

    const newStudent = {
      stud_name: name,
      stud_email: email,
      stud_dob: dob,
      stud_phone: phone,
      stud_address: address,
      stud_qualification: qualification,
    };

    try {
      const resp = await axios.post('http://localhost:5000/student_applictions', newStudent);
      if (resp.status === 200 || resp.status === 201) {
        alert('Student added successfully!');
        setAdmissions([...admissions, newStudent]);
      
        setName('');
        setQualification('');
        setAddress('');
        setEmail('');
        setPhone('');
        setDob('');
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <center>
    <div>
      <h3>Admission Form</h3>
      <form onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
        <input value={qualification} onChange={e => setQualification(e.target.value)} placeholder="Qualification" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" rows="3" required />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" required />
        <input value={dob} onChange={e => setDob(e.target.value)} type="date" required />
        <button type="submit">UPDATE</button>
      </form>
    </div>
    </center>
  );
}
