const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location missing" });
  }

  const utcTime = new Date().toISOString();

  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  console.log("🚨 SOS TRIGGERED");
  console.log({
    latitude: lat,
    longitude: lng,
    utcTime: utcTime,
    istTime: istTime,
  });

  res.status(200).json({
    message: "SOS sent successfully",
    time: istTime,
  });
});

module.exports = router;
