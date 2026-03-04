const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    mobileNumber: {
        type: String,
        required: true,
        match:[/^\d{10}$/,"Please enter a valid 10-digit emergency contact number"]
    },

    emergencyName: {
        type: String,
        required: true
    },

    emergencyContact: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit emergency contact number"],
        validate: {
            validator: function(value) {
                return value !== this.mobileNumber;
            },
            message: "Emergency contact number cannot be the same as mobile number"
        }
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);