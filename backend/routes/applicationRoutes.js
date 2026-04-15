const express = require("express");
const router = express.Router();
const checkApplicationWindow = require("../middleware/checkApplicationWindow");

const { 
  submitApplication, 
  getUserApplications, 
  getApplicationById 
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { uploadApplicationFiles } = require("../middleware/uploadMiddleware");

// ============================
// All routes are protected
// ============================
router.use(protect);

// ============================
// Submit Application (Student)
// ============================
router.post(
  "/",
  
  // 🔥 DEBUG LOG (FIRST)
  (req, res, next) => {
    console.log("🔥 APPLICATION ROUTE HIT");
    next();
  },

  /*

  // Only students can apply
   checkApplicationWindow,

  // Only students can apply
  (req, res, next) => {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can submit applications"
      });
    }
    next();
  },
*/
  // Upload files
  uploadApplicationFiles,

  // Controller
  submitApplication
);

// ============================
// Get User's Applications
// ============================
router.get("/", getUserApplications);

// ============================
// Get Single Application by ID
// ============================
router.get("/:id", getApplicationById);

module.exports = router;