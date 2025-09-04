import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../styles/Viewapplication.css"; // import CSS

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
    <div className="applications-container">
      <h3 className="applications-title">Student Applications 2025-27</h3>
      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Slno</th>
              <th>Name</th>
              <th>Qualification</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Marks</th>
              <th>Entrance Score</th>
              <th>Submitted At</th>
              <th colSpan={3}>Action</th>
            </tr>
          </thead>
          <tbody>
            
            {applications.map((i, index) => 
            (
              <tr key={i.id || index}>
                <td>{++index}</td>
                <td>{i.stud_name}</td>
                <td>{i.stud_qualification}</td>
                <td>{i.stud_email}</td>
                <td>{i.stud_phone}</td>
                <td>{i.stud_percentage}</td>
                <td>{i.stud_lbs}</td>
                <td>{new Date(i.submitted_at).toLocaleString()}</td>
                <td>
                  <button className="view-btn" onClick={() => alert(`Viewing ${i.index}`)}>
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
