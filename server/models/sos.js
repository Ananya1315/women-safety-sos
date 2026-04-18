const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  utcTime: {
    type: String,
    required: true,
  },
  istTime: {
    type: String,
    required: true,
  },
  triggerType: {
    type: String,
    default: "normal",
  },
  method: {
    type: String,
    default: "button",
  },
  status: {
    type: String,
    default: "pending",
  },
  notified: {
  type: Boolean,
  default: false
}
});

module.exports = mongoose.model("SOS", sosSchema);
