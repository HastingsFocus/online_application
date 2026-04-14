const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============================
// Ensure uploads directory exists
// ============================
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created");
}
  console.log("TOKEN RECEIVED:", req.headers.authorization);
// ============================
// Storage Configuration
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fieldname = file.fieldname;

    const filename = `${fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// ============================
// File Filter (UPDATED ✅)
// ============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ✅ accept file
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG) and PDF files are allowed")); // ❌ reject properly
  }
};

// ============================
// Multer Upload Instance with Limits
// ============================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
});

// ============================
// Upload Fields for Application
// ============================
const uploadApplicationFiles = upload.fields([
  { name: "passportPhoto", maxCount: 1 },
  { name: "msceCertificate", maxCount: 1 },
  { name: "bankSlip", maxCount: 1 }
]);

// ============================
// Error Handler for Multer
// ============================
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB" });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// ============================
// Export Middleware
// ============================
module.exports = {
  uploadApplicationFiles,
  handleMulterError
};