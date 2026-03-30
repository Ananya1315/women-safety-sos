const express = require("express");
const router = express.Router();
const Incident = require("../models/incident_reporting");

// CREATE INCIDENT
router.post("/", async (req, res) => {
  console.log("REQ BODY ", req.body);

  const { lat, lng, category, description } = req.body;

  if (!lat || !lng || !category || !description) {
    console.log("Missing fields");
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const incident = await Incident.create({
      lat,
      lng,
      category,
      description,
      reportedAtUTC: new Date().toISOString(),
      reportedAtIST: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    });

    console.log("SAVED:", incident);
    res.status(201).json(incident);
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ message: "Error saving incident" });
  }
});


// GET ALL INCIDENTS
router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ reportedAtUTC:-1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching incidents" });
  }
});

// UPDATE STATUS
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Incident.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;
