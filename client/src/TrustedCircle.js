import { useEffect, useState } from "react";

function TrustedCircle() {
  const [sosList, setSosList] = useState([]);

  const fetchSOS = () => {
    fetch("http://localhost:5000/api/sos")
      .then((res) => res.json())
      .then((data) => setSosList(data));
  };

  useEffect(() => {
    fetchSOS();
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/sos/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => fetchSOS());
  };

  return (
    <div>
      <h2>Trusted Circle Dashboard</h2>
      {sosList.map((sos) => (
        <div key={sos.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <p><strong>Location:</strong> {sos.lat}, {sos.lng}</p>
          <p><strong>Time:</strong> {sos.istTime}</p>
          <p><strong>Status:</strong> {sos.status}</p>

          <button onClick={() => updateStatus(sos.id, "help_on_the_way")}>
            Help on the way
          </button>

          <button onClick={() => updateStatus(sos.id, "resolved")}>
            Resolved
          </button>

          <button onClick={() => updateStatus(sos.id, "false_alarm")}>
            False Alarm
          </button>
        </div>
      ))}
    </div>
  );
}

export default TrustedCircle;
