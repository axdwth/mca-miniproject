import React, { useEffect, useState } from "react";
import AdminDashboard from './Admindashboard';

const Queue = () => {
  const [queueApps, setqueueApps] = useState([]);

  useEffect(() => {
    // Fetch all accepted applications from backend
    fetch("http://localhost:5000/applications/queue")
      .then((res) => res.json())
      .then((data) => setqueueApps(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">queued Applications</h2>
      {queueApps.length === 0 ? (
        <p>No applications have been queued yet.</p>
      ) : (
        <div className="row">
          {queueApps.map((app) => (
            <div key={app._id} className="col-md-4 mb-3">
              <div className="card border-success">
                <div className="card-body">
                  <h5 className="card-title">{app.stud_name}</h5>
                  <p className="card-text">Email: {app.email}</p>
                  <p className="card-text">Application ID: {app._id}</p>
                  <span className="badge bg-success">Queued</span>
                  <p><a href="/admin/*">back</a></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queue;
