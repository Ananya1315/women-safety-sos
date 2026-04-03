const express = require("express");
const router = express.Router();
const Official = require("../models/officials");

// Verify official email + passcode
router.post("/verify", async (req, res) => {
  const { email, passcode } = req.body;

  try {
    const official = await Official.findOne({ email, passcode });

    if (!official) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Access granted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;