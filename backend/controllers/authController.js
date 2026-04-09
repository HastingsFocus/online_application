const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 🔥 DEBUG ENV VARIABLES
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// ================= EMAIL TRANSPORT =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.log("Transporter Error:", error);
  else console.log("Transporter Ready to Send Emails");
});

// ================= STUDENT REGISTER =================
const registerStudent = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("🔍 Checking if user already exists...");
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("💾 Saving user to database...");
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "student",
    });

    console.log("✅ User saved successfully:", newUser);

    res.status(201).json({ message: "Student registered successfully" });

  } catch (error) {
    console.error("🔥 ERROR in registerStudent:", error.message);

    res.status(500).json({
      message: "Error registering student",
      error: error.message,
    });
  }
};

// ================= STUDENT LOGIN =================
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.role !== "student")
      return res.status(403).json({ message: "Not a student account" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.role !== "admin")
      return res.status(403).json({ message: "Not an admin account" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Error logging in admin",
      error: error.message,
    });
  }
};

// ================= GET PROFILE (🔥 NEW FIX) =================
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message
    });
  }
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000;

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Password reset link sent to email",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error sending reset email",
      error: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

module.exports = {
  registerStudent,
  studentLogin,
  adminLogin,
  getUserProfile, // 🔥 EXPORT THIS
  forgotPassword,
  resetPassword,
};