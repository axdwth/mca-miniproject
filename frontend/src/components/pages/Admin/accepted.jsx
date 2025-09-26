import React, { useEffect, useState } from "react";

const Accepted = () => {
  const [acceptedApps, setAcceptedApps] = useState([]);

  useEffect(() => {
    // Fetch all accepted applications from backend
    fetch("http://localhost:5000/applications/accepted")
      .then((res) => res.json())
      .then((data) => setAcceptedApps(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Accepted Applications</h2>
      {acceptedApps.length === 0 ? (
        <p>No applications have been accepted yet.</p>
      ) : (
        <div className="row">
          {acceptedApps.map((app) => (
            <div key={app._id} className="col-md-4 mb-3">
              <div className="card border-success">
                <div className="card-body">
                  <h5 className="card-title">{app.stud_name}</h5>
                  <p className="card-text">Email: {app.email}</p>
                  <p className="card-text">Application ID: {app._id}</p>
                  <span className="badge bg-success">ACCEPTED</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accepted;
