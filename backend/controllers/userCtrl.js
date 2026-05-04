const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");


// ================= REGISTER =================
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });

    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "Register Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= LOGIN =================
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Success",
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= AUTH =================
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Auth error",
    });
  }
};


// ================= APPLY DOCTOR =================
const applyDoctorController = async (req, res) => {
  try {
    const { aadhar, degree, photo, license } = req.files;

    let timings = [];
    if (req.body.timings) {
      timings = JSON.parse(req.body.timings);
    }

    const newDoctor = new doctorModel({
      ...req.body,
      timings,
      aadhar: aadhar?.[0]?.filename,
      degree: degree?.[0]?.filename,
      photo: photo?.[0]?.filename,
      license: license?.[0]?.filename,
      status: "pending",
      userId: req.user.id,
    });

    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });

    if (adminUser) {
      adminUser.notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} applied`,
        data: {
          doctorId: newDoctor._id,
        },
        onClickPath: "/admin/doctors",
      });

      await adminUser.save();
    }

    res.status(201).send({
      success: true,
      message: "Doctor Applied Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
//notificationctrl
// ================= GET ALL NOTIFICATIONS =================
const getAllnotificationController = async (req, res) => {
  try {
    // find logged-in user
    const user = await userModel.findById(req.user.id);

    // move notifications to seen notifications
    user.seennotification.push(...user.notification);

    // clear unread notifications
    user.notification = [];

    // save updated user
    const updatedUser = await user.save();

    // hide password
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in notification",
      error,
    });
  }
};

// ================= DELETE ALL NOTIFICATIONS =================
const deleteAllNotificationController = async (req, res) => {
  try {
    // find logged-in user
    const user = await userModel.findById(req.user.id);

    // clear both arrays
    user.notification = [];
    user.seennotification = [];

    // save changes
    const updatedUser = await user.save();

    // hide password
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "All notifications deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting notifications",
      error,
    });
  }
};


// ================= GET DOCTORS =================
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
    });
  }
};


// ================= BOOK APPOINTMENT =================
const bookeAppointmnetController = async (req, res) => {
  try {
    const newAppointment = new appointmentModel({
      ...req.body,
      date: moment(req.body.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
      time: moment(req.body.time, "HH:mm").format("HH:mm"),
      status: "pending",
    });

    await newAppointment.save();

    const doctorUser = await userModel.findById(req.body.doctorInfo.userId);

    if (doctorUser) {
      doctorUser.notification.push({
        type: "New-appointment-request",
        message: `New appointment from ${req.body.userInfo.name}`,
        onClickPath: "/user/appointments",
      });

      await doctorUser.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= AVAILABILITY CHECK =================
const bookingAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const fromTime = moment(time, "HH:mm").subtract(1, "hours").format("HH:mm");
    const toTime = moment(time, "HH:mm").add(1, "hours").format("HH:mm");

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Not Available at this time",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Available",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= USER APPOINTMENTS =================
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.user.id,
    });

    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= NEW: ADD REVIEW =================
const addReviewController = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    const doctor = await doctorModel.findById(doctorId);

    doctor.reviews.push({
      userName: req.user?.name || "User",
      rating,
      comment,
    });

    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Review Added",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= NEW: ADD ACHIEVEMENT =================
const addAchievementController = async (req, res) => {
  try {
    const { doctorId, achievement } = req.body;

    const doctor = await doctorModel.findById(doctorId);

    doctor.achievements.push(achievement);

    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Achievement Added",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
//google 
const googleLoginController = async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: googleId,
      });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


// ================= EXPORT =================
module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllnotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  addReviewController,
  addAchievementController,
  googleLoginController,
};