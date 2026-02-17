import { useState } from "react";
import Navbar from "../Navbar";

function UserSOSPage() {
  const [status, setStatus] = useState("");

  const handleSOS = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Sending SOS...");

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const utcTime = new Date().toISOString();

        const istTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata"
        });

        fetch("http://localhost:5000/api/sos", {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`},
          body: JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            utcTime,
            istTime,
            triggerType: "normal",
            method: "button",
            status: "pending"
          }),
        })
          .then((res) => res.json())
          .then(() => setStatus("SOS Sent Successfully"))
          .catch(() => setStatus("Failed to send SOS"));
      },
      () => setStatus("Location permission denied")
    );
  };

  return (
    <>
    <Navbar />
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
    </div></>
  );
}

export default UserSOSPage;
