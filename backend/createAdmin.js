const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();



const createAdmin = async () => {
  try {
    // 🔥 CONNECT TO MONGODB FIRST
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully 🚀");

    process.exit();

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();