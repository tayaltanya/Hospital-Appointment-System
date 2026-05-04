const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },

    doctorInfo: {
      type: Object,
      required: true,
    },

    userInfo: {
      type: Object,
      required: true,
    },

    // FIX: single datetime field (MAIN CHANGE)
   date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointments", appointmentSchema);