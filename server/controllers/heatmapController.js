const Incident = require("../models/incident_reporting");
const SOS = require("../models/sos"); // adjust name if different

exports.getHeatmapData = async (req, res) => {
  try {
    // Fetch incidents
    const incidents = await Incident.find({}, {
      lat: 1,
      lng: 1,
      _id: 0
    });

    // Fetch SOS
    const sosData = await SOS.find({}, {
      lat: 1,
      lng: 1,
      _id: 0
    });

    // Combine them
    const heatmapData = [
      ...incidents.map(i => ({ lat: i.lat, lng: i.lng, weight: 1 })),
      ...sosData.map(s => ({ lat: s.lat, lng: s.lng, weight: 2 })) // SOS = higher priority
    ];

    res.json(heatmapData);

  } catch (error) {
    res.status(500).json({
      message: "Error generating heatmap data",
      error: error.message
    });
  }
};