const express = require("express");
const {
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

  //  NEW IMPORTS (IMPORTANT)
  addReviewController,
  addAchievementController,
  googleLoginController,

} = require("../controllers/userCtrl");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// router object
const router = express.Router();

// ================= AUTH =================

// LOGIN
router.post("/login", loginController);

// REGISTER
router.post("/register", registerController);
router.post("/google-login", googleLoginController);

// GET USER DATA
router.post("/getUserData", authMiddleware, authController);

// ================= DOCTOR APPLY =================

router.post(
  "/apply-doctor",
  authMiddleware,
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "license", maxCount: 1 },
  ]),
  applyDoctorController
);

// ================= NOTIFICATIONS =================

router.post(
  "/get-all-notification",
  authMiddleware,
  getAllnotificationController
);

router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// ================= DOCTORS =================

// GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDocotrsController);

// ================= APPOINTMENTS =================

// BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

// CHECK AVAILABILITY
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

// USER APPOINTMENTS
router.get(
  "/user-appointments",
  authMiddleware,
  userAppointmentsController
);

// ================= NEW FEATURES =================

//  ADD REVIEW
router.post("/add-review", authMiddleware, addReviewController);

//  ADD ACHIEVEMENT (optional: restrict to doctor/admin later)
router.post("/add-achievement", authMiddleware, addAchievementController);

module.exports = router;