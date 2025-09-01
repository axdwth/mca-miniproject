import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function ViewApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/Viewapplications");
        setApplications(resp.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <center>
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h3>Student Applications</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
       <thead>
  <tr>
    <th>Name</th>
    <th>Qualification</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Address</th>
    <th>Marks</th>
    <th>Entrance Score</th>
    <th>Submitted At</th>
    <th colSpan={3}>Action</th>
  </tr>
</thead>
<tbody>
    {applications.map((i, index) => (
      <tr key={i.id||index}>
      <td>{i.stud_name}</td>
      <td>{i.stud_qualification}</td>
      <td>{i.stud_email}</td>
      <td>{i.stud_phone}</td>
      <td>{i.stud_address}</td>
      <td>{i.stud_percentage}</td>
      <td>{i.stud_lbs}</td>
      <td>{new Date(i.submitted_at).toLocaleString()}</td>
      <td><button type=''onClick={()=>(i.id)}>View details</button></td>
    </tr>
  ))}
</tbody>
</table>
    </div>
    </center>
  );
}
