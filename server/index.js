const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const sosRoutes = require("./routes/sos");
const incidentRoutes = require("./routes/incident_reporting");

app.use("/api/sos", sosRoutes);
app.use("/api/incident_reporting", incidentRoutes);

app.get("/", (req, res) => {
  res.send("Women Safety API running");
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
