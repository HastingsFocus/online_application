const express = require("express");
const router = express.Router();

const {
  registerStudent,
  studentLogin,
  adminLogin,
  forgotPassword,
  resetPassword,
  getUserProfile // 🔥 import the new profile controller
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // 🔥 import protect middleware

// ================= STUDENT AUTH =================

// Register student
router.post("/register", registerStudent);

// Student login
router.post("/login", studentLogin);

// ================= ADMIN AUTH =================

// Admin login
router.post("/admin-login", adminLogin);

// ================= PASSWORD RESET =================

// Request password reset link
router.post("/forgot-password", forgotPassword);

// Reset password using token
router.post("/reset-password/:token", resetPassword);

// ================= GET PROFILE =================
// Protected route to get logged-in user's profile
router.get("/profile", protect, getUserProfile); // 🔥 new route

module.exports = router;