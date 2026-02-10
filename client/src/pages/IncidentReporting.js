import { useState } from "react";

function IncidentReport() {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      setMessage("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const finalCategory =
        category === "Other" ? customCategory : category;

      try {
        await fetch("http://localhost:5000/api/incident_reporting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            category: finalCategory,
            description: description,
          }),
        });

        setMessage(" Incident reported successfully");
        setCategory("");
        setCustomCategory("");
        setDescription("");
      } catch (err) {
        setMessage(" Failed to report incident");
      }
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Report Incident</h2>

      <form onSubmit={handleSubmit}>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Harassment">Harassment</option>
          <option value="Stalking">Stalking</option>
          <option value="Theft">Theft</option>
          <option value="Unsafe Area">Unsafe Area</option>
          <option value="Suspicious Activity">Suspicious Activity</option>
          <option value="Other">Other</option>
        </select>

        {category === "Other" && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

        <br /><br />

        <textarea
          placeholder="Describe the incident"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
          cols="40"
        />

        <br /><br />

        <button type="submit">
          Submit Incident
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default IncidentReport;
