import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function UserSOSPage() {
  const [status, setStatus] = useState("");
  const [latestSOS, setLatestSOS] = useState(null);

  // 🔁 Fetch latest SOS
  const fetchLatestSOS = () => {
    fetch("http://localhost:5000/api/sos")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setLatestSOS(data[0]); // assuming latest comes first
        }
      })
      .catch((err) => console.error(err));
  };

  // 🔄 Poll every 3 seconds
  useEffect(() => {
    fetchLatestSOS();

    const interval = setInterval(fetchLatestSOS, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🚨 Trigger SOS
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
          timeZone: "Asia/Kolkata",
        });

        fetch("http://localhost:5000/api/sos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            utcTime,
            istTime,
            triggerType: "normal",
            method: "button",
            status: "pending",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setStatus("SOS Sent Successfully");
            setLatestSOS(data); // store created SOS
          })
          .catch(() => setStatus("Failed to send SOS"));
      },
      () => setStatus("Location permission denied")
    );
  };

  // ❗ Mark False Alarm
  const markFalseAlarm = (id) => {
    fetch(`http://localhost:5000/api/sos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "false alarm" }),
    })
      .then(() => {
        setLatestSOS(null);
        setStatus("Marked as False Alarm");
      })
      .catch((err) => console.error(err));
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

        {/* 🚑 Help Coming Notification */}
        {latestSOS && latestSOS.status === "help coming" && (
          <div
            style={{
              padding: "15px",
              marginTop: "20px",
              borderRadius: "10px",
              display: "inline-block",
            }}
          >
            <h3>Help is on the way!</h3>

            <button
              onClick={() => markFalseAlarm(latestSOS._id)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              It was a False Alarm
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default UserSOSPage;