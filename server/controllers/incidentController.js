const Incident = require('../models/Incident');

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({}, {
      latitude: 1,
      longitude: 1,
      _id: 0
    });

    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching incidents",
      error: error.message
    });
  }
};