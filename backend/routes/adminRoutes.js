const express = require("express");
const router = express.Router();

// Import controllers (destructure directly)
const {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats,
  downloadAcceptedStudents
} = require("../controllers/adminController");

// Import middlewares
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ============================
// Admin routes
// ============================

// Get all applications with search & pagination
router.get("/applications", protect, adminOnly, getAllApplications);

// Get single application by ID
router.get("/applications/:id", protect, adminOnly, getApplicationById);

// Update application status (accept/reject)
router.put("/applications/:id/status", protect, adminOnly, updateApplicationStatus);

// Admin Dashboard Analytics
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Download accepted students PDF
router.get(
  "/accepted-students/pdf",
  protect,
  adminOnly,
  downloadAcceptedStudents
);

module.exports = router;