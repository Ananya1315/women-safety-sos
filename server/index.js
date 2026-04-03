require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
const fetch = require("node-fetch"); // if not already

const SOS = require("./models/sos");

const sosRoutes = require("./routes/sos");
const incidentRoutes = require("./routes/incident_reporting");
const authRoutes = require("./routes/authRoutes");

app.use("/api/sos", sosRoutes);
app.use("/api/incident_reporting", incidentRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Women Safety API running");
});


app.get("/get-sos", async (req, res) => {
  try {
    const data = await SOS.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching SOS");
  }
});
function distance(a, b) {
  const R = 6371;

  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;

  const lat1 = a[0] * Math.PI / 180;
  const lat2 = b[0] * Math.PI / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 *
    Math.cos(lat1) * Math.cos(lat2);

  const d = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * d;
}
function calculateRouteRisk(routeCoords, sosPoints) {
  let totalRisk = 0;

  for (let point of routeCoords) {
    for (let sos of sosPoints) {

      const d = distance(point, [sos.lat, sos.lng]);

      if (d < 0.5) {
        totalRisk += (1 / (d + 0.05)) * 100;
      }
    }
  }

  return totalRisk;
}
app.post("/safe-route", async (req, res) => {
  try {
    const { start, end } = req.body;

    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true&overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(500).json({ error: "No routes found" });
    }

    let bestRoute = null;
    let minRisk = Infinity;

    const allRoutes = [];
    const risks = [];
    const routeDetails = [];
    const sosPoints = await SOS.find();
    data.routes.forEach((route, index) => {
      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
      const risk = calculateRouteRisk(coords, sosPoints);

      const distanceKm = (route.distance / 1000).toFixed(2);
      const durationMin = (route.duration / 60).toFixed(1);

      allRoutes.push(coords);
      risks.push(risk);

      routeDetails.push({
        distance: distanceKm,
        duration: durationMin,
        risk: Math.round(risk)
      });

      console.log(`Route ${index} → Risk: ${risk}, Distance: ${distanceKm} km, Time: ${durationMin} min`);

      if (risk < minRisk) {
        minRisk = risk;
        bestRoute = coords;
      }
    });

    res.json({
      bestRoute,
      allRoutes,
      risks,
      routeDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});