import React, { useEffect, useState } from "react";

const Queue = () => {
  const [queueApps, setQueueApps] = useState([]);

  // Fetch all queued applications
  const fetchQueueApps = () => {
    fetch("http://localhost:5000/applications/queue")
      .then((res) => res.json())
      .then((data) => setQueueApps(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQueueApps();
  }, []);

  // Accept handler for a single application
  const handleAccept = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:5000/applications/accept/${email}`,
        {
          method: "PUT",
        }
      );
      if (res.ok) {
        fetchQueueApps(); // refresh list
      } else {
        alert("Failed to accept application.");
      }
    } catch (err) {
      console.error("Error accepting application:", err);
    }
  };

  // Accept all handler
  const handleAcceptAll = async () => {
    try {
      await Promise.all(
        queueApps.map((app) =>
          fetch(`http://localhost:5000/applications/accept/${app.stud_email}`, {
            method: "PUT",
          })
        )
      );
      fetchQueueApps(); // refresh list
      alert("All applications accepted!");
    } catch (err) {
      console.error("Error accepting all applications:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Queued Applications</h2>
      {queueApps.length === 0 ? (
        <p>No applications have been queued yet.</p>
      ) : (
        <>
          <button className="btn btn-success mb-3" onClick={handleAcceptAll}>
            Accept All
          </button>
          <div className="row">
            {queueApps.map((app) => (
              <div key={app._id} className="col-md-4 mb-3">
                <div className="card border-success">
                  <div className="card-body">
                    <h5 className="card-title">{app.stud_name}</h5>
                    <p className="card-text">Email: {app.stud_email}</p>
                    <p className="card-text">Application ID: {app._id}</p>
                    <span className="badge bg-success">Queued</span>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleAccept(app.stud_email)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Queue;
