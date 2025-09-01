import React, { useState } from 'react';
import axios, { HttpStatusCode } from 'axios';

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [exp, setExp] = useState('');
  const [email, setEmail] = useState('');
  const [discrp, setDiscrp] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault(); 

    if (!name || !qualification || !exp || !email || !discrp) {
      alert('All fields are required');
      return;
    }

    const newFaculty = {
      faculty_name: name,
      faculty_email: email,
      faculty_exp: exp,
      faculty_description: discrp,
      faculty_qualification: qualification
    };

    try {
      const resp = await axios.post('http://localhost:5000/add_faculty', newFaculty);
      if (resp.status === HttpStatusCode.Created) {
        alert('Faculty added successfully');
        setFaculty([...faculty, newFaculty]);
        setName('');
        setQualification('');
        setExp('');
        setEmail('');
        setDiscrp('');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h3>Add Faculty</h3>
      <form onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={qualification} onChange={e => setQualification(e.target.value)} placeholder="Qualification" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={exp} onChange={e => setExp(e.target.value)} placeholder="Experience" required />
        <input value={discrp} onChange={e => setDiscrp(e.target.value)} placeholder="Description" required />
        <button type="submit">Add Faculty</button>
      </form>
<br />
<h3>Faculty List</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Qualification</th>
      <th>Email</th>
      <th>Experience</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {faculty.map((i, index) => (
      <tr key={index}>
        <td>{i.faculty_name}</td>
        <td>{i.faculty_qualification}</td>
        <td>{i.faculty_email}</td>
        <td>{i.faculty_exp}</td>
        <td>{i.faculty_description}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
