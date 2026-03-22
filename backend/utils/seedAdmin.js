const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  const existing = await User.findOne({ role: "admin" });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin1234!", 10);
    await User.create({
      username: "collegeAdmin",
      email: "admin@college.com",
      password: hashed,
      role: "admin",
    });
    console.log("Admin account created!");
  } else {
    console.log("Admin already exists");
  }
  process.exit();
};

seedAdmin();