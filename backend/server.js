require("dotenv").config(); // 🔥 MUST BE FIRST LINE

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const programRoutes = require("./routes/programRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/applications", applicationRoutes); // 🔥 (you forgot to use it)
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Student Application API Running...");
});

console.log("🔥 NEW DEPLOY ACTIVE");

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected successfully 🔥");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({
    message: err.message,
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});