const mongoose = require("mongoose");

const officialSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Official", officialSchema);