import { useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
export default function AdminAdmin() {
  const [Admin, setAdmin] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault(); 

    if (!name||!email) {
      alert('All fields are required');
      return;
    }

    const newAdmin = {
      Admin_name: name,
      Admin_email: email,
        Admin_password: password
    };

    try {
      const resp = await axios.post('http://localhost:5000/register_admin', newAdmin);
      if (resp.status === HttpStatusCode.Created) {
        alert('success');
        setAdmin([...Admin, newAdmin]);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h3>Admin reg</h3>
      <form onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />      
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
