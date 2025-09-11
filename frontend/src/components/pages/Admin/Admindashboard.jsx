import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Admindashboard.css'; // Assuming you have a CSS file for styling';
export default function AdminDashboard() {
  return (
    <center>
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <nav className="dashboard-nav">
        <ul className="nav-list">
          {/*<li className="nav-item"><Link to="/admin/managefaculty" className="nav-link">Manage Faculty</Link></li>
          <li className="nav-item"><Link to="/admin/updatecriteria" className="nav-link">Update Criteria</Link></li>  */}
          <li className="nav-item"><Link to="/admin/viewapplications" className="nav-link">New Applications</Link></li>
          <li className="nav-item"><Link to="/admin/accepted" className="nav-link">Accepted Applications</Link></li>
          <li className="nav-item"><Link to="/admin/queue" className="nav-link">Watinglist Applications</Link></li>
          <li className="nav-item"><Link to="/admin/queue" className="nav-link">Rejected</Link></li>
        </ul>
      </nav>
    </div>
    </center>
  );
}
