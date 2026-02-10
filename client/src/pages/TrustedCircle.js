import { useEffect, useState } from "react";

function TrustedCircle() {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Fetch SOS alerts
  const fetchSOS = () => {
    fetch("http://localhost:5000/api/sos")
      .then((res) => res.json())
      .then((data) => setSosAlerts(data))
      .catch(console.error);
  };

const fetchIncidents = () => {
  fetch("http://localhost:5000/api/incident_reporting")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched incidents:", data);
      setIncidents(data);
    })
    .catch(console.error);
};


  useEffect(() => {
    fetchSOS();
    fetchIncidents();
  }, []);

  // Update SOS status
  const updateSOSStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(fetchSOS);
  };

  // Delete SOS (False Alarm)
  const deleteSOS = (id) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: "DELETE",
    }).then(fetchSOS);
  };

  // Update Incident status
  const updateIncidentStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/incident_reporting/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(fetchIncidents);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trusted Circle Dashboard</h1>

      {/* SOS SECTION */}
      <h2> SOS Alerts</h2>
      {sosAlerts.map((alert) => (
        <div
          key={alert._id}
          style={{
            border: "2px solid red",
            margin: "15px",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <p><b>Latitude:</b> {alert.lat}</p>
          <p><b>Longitude:</b> {alert.lng}</p>
          <p><b>Time:</b> {alert.istTime}</p>
          <p><b>Status:</b> {alert.status}</p>

          {alert.status !== "resolved" && (
            <>
              <button
                onClick={() => updateSOSStatus(alert._id, "help coming")}
                style={{ marginRight: "10px" }}
              >
                Help Coming
              </button>

              <button
                onClick={() => updateSOSStatus(alert._id, "resolved")}
                style={{ marginRight: "10px" }}
              >
                Resolved
              </button>

              <button onClick={() => deleteSOS(alert._id)}>
                False Alarm
              </button>
            </>
          )}
        </div>
      ))}

      {/* INCIDENT SECTION */}
      <h2> Reported Incidents</h2>
      {incidents.map((incident) => (
        <div
          key={incident._id}
          style={{
            border: "1px solid gray",
            margin: "15px",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <p><b>Category:</b> {incident.category}</p>
          <p><b>Description:</b> {incident.description}</p>
          <p><b>Location:</b> {incident.lat}, {incident.lng}</p>
          <p><b>Time:</b> {incident.reportedAtIST}</p>
          <p><b>Status:</b> {incident.status}</p>

          {incident.status !== "resolved" && (
            <>
              <button
                onClick={() => updateIncidentStatus(incident._id, "investigating")}
                style={{ marginRight: "10px" }}
              >
                Investigating
              </button>

              <button
                onClick={() => updateIncidentStatus(incident._id, "resolved")}
              >
                Resolved
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrustedCircle;
