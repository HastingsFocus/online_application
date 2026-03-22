const express = require("express");
const router = express.Router();

const { 
  getPrograms, 
  getProgramById, 
  checkEligibility 
} = require("../controllers/programController");
const { protect } = require("../middleware/authMiddleware");

// ============================
// Public Routes
// ============================

// GET all programs
router.get("/", getPrograms);

// GET program by ID
router.get("/:id", getProgramById);

// ============================
// Protected Routes
// ============================

// Check eligibility for programs based on grades
router.post("/check-eligibility", protect, checkEligibility);

module.exports = router;