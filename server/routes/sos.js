const express = require("express");
const router = express.Router();
const SOS = require("../models/sos");
const { protect } = require("../middleware/authMiddleware");

//  CREATE SOS
router.post("/", protect, async (req, res) => {
  try {
    const newSOS = new SOS(req.body);
    await newSOS.save();
    res.json(newSOS);
  } catch (err) {
    res.status(500).json({ message: "Error saving SOS" });
  }
});

//GET ALL SOS 
router.get("/", async (req, res) => {
  try {
    const alerts = await SOS.find().sort({ reportedAtUTC:-1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching SOS" });
  }
});

// UPDATE STATUS 
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedSOS = await SOS.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedSOS);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

//  DELETE SOS (False Alarm)
router.delete("/:id", async (req, res) => {
  try {
    await SOS.findByIdAndDelete(req.params.id);
    res.json({ message: "SOS deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting SOS" });
  }
});

module.exports = router;
