require("dotenv").config(); // 🔥 MUST BE FIRST LINE

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const programRoutes = require("./routes/programRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 DEBUG + APPLICATION ROUTES
app.use(
  "/api/applications",
  (req, res, next) => {
    console.log("🔥 APPLICATION ROUTES HIT");
    next();
  },
  applicationRoutes
);

app.use("/api/admin", adminRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Student Application API Running...");
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// ================= GLOBAL ERROR HANDLER 🔥 =================
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(400).json({
    message: err.message
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});