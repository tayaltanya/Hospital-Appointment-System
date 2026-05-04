const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },

    firstName: {
      type: String,
      required: [true, "first name is required"],
    },

    lastName: {
      type: String,
      required: [true, "last name is required"],
    },

    phone: {
      type: String,
      required: [true, "phone no is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
    },

    website: {
      type: String,
    },

    address: {
      type: String,
      required: [true, "address is required"],
    },

    specialization: {
      type: String,
      required: [true, "specialization is require"],
    },

    experience: {
      type: String,
      required: [true, "experience is required"],
    },

    feesPerCunsaltation: {
      type: Number,
      required: [true, "fee is required"],
    },

    timings: {
      type: Object,
      required: [true, "work timing is required"],
    },

    // ================= NEW VERIFICATION FIELDS =================

    registrationNumber: {
      type: String,
      required: [true, "registration number is required"],
    },

    hospital: {
      type: String,
      required: [true, "hospital/clinic is required"],
    },

    referenceDoctor: {
      type: String,
      required: [true, "reference doctor is required"],
    },

    referenceContact: {
      type: String,
      required: [true, "reference contact is required"],
    },

    referenceNumber: {
      type: String,
      required: [true, "reference number is required"],
    },

    // ================= FILES =================

    aadhar: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },

    license: {
      type: String,
      required: true,
    },

    // ================= NEW FEATURES =================

    //  Achievements
    achievements: {
      type: [String],
      default: [],
    },

    // Reviews
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        userName: {
          type: String,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    //  Optional: store average rating (optimization)
    averageRating: {
      type: Number,
      default: 0,
    },

    // ================= STATUS =================

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;