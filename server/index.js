const express = require("express");
const cors = require("cors");
const sosRoutes = require("./routes/sos");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/sos", sosRoutes);

app.get("/", (req, res) => {
  res.send("Women Safety API running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
