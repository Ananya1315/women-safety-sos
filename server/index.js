require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const sosRoutes = require("./routes/sos");
const incidentRoutes = require("./routes/incident_reporting");
const authRoutes=require("./routes/authRoutes");
const heatmapRoutes = require("./routes/heatmap");

app.use("/api/sos", sosRoutes);
app.use("/api/incident_reporting", incidentRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/heatmap", heatmapRoutes);

app.get("/", (req, res) => {
  res.send("Women Safety API running");
});
// app.get("/test", (req, res) => {
//   res.send("Test route working");
// });

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
