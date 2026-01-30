import { useState } from "react";

function App() {
  const [status, setStatus] = useState("");

  const handleSOS = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Sending SOS...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch("http://localhost:5000/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        })
          .then(() => setStatus("🚨 SOS Sent Successfully"))
          .catch(() => setStatus("Failed to send SOS"));
      },
      () => setStatus("Location permission denied")
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Women Safety Platform</h1>

      <button
        onClick={handleSOS}
        style={{
          padding: "30px",
          fontSize: "24px",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
        }}
      >
        SOS
      </button>

      <p>{status}</p>
    </div>
  );
}

export default App;
