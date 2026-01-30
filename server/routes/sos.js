const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location missing" });
  }

  console.log("🚨 SOS TRIGGERED");
  console.log({
    latitude: lat,
    longitude: lng,
    time: new Date().toISOString(),
  });

  res.status(200).json({ message: "SOS sent successfully" });
});

module.exports = router;
