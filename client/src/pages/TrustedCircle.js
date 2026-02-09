import { useEffect, useState } from "react";

function TrustedCircle() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = () => {
    fetch("http://localhost:5000/api/sos")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(fetchAlerts);
  };

  const deleteAlert = (id) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: "DELETE",
    }).then(fetchAlerts);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trusted Circle Dashboard</h1>

      {alerts.map((alert) => (
        <div
          key={alert._id}
          style={{
            border: "1px solid black",
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
                onClick={() => updateStatus(alert._id, "help coming")}
                style={{ marginRight: "10px" }}
              >
                Help Coming
              </button>

              <button
                onClick={() => updateStatus(alert._id, "resolved")}
                style={{ marginRight: "10px" }}
              >
                Resolved
              </button>

              <button
                onClick={() => deleteAlert(alert._id)}
              >
                False Alarm
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TrustedCircle;
