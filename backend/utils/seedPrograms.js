const mongoose = require("mongoose");
const Program = require("../models/Program");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const programs = [
  {
    name: "Diploma in Public Health",
    code: "DIP-PH",
    department: "Health Sciences",
    description: "Minimum of 6 in all subjects including English, Mathematics, and Physics",
    requiredSubjects: [
      { name: "English", minPoints: 6 },
      { name: "Mathematics", minPoints: 6 },
      { name: "Physics", minPoints: 6 }
    ],
    allSubjectsMinPoints: 6 // Minimum points required for all subjects
  },
  {
    name: "Diploma in Midwifery",
    code: "DIP-MID",
    department: "Health Sciences",
    description: "Minimum of 5 in all subjects including English, Mathematics, Physics, Chemistry, and Biology",
    requiredSubjects: [
      { name: "English", minPoints: 5 },
      { name: "Mathematics", minPoints: 5 },
      { name: "Physics", minPoints: 5 },
      { name: "Chemistry", minPoints: 5 },
      { name: "Biology", minPoints: 5 }
    ],
    allSubjectsMinPoints: 5 // Minimum points required for all subjects
  },
  {
    name: "Diploma in Pharmacy",
    code: "DIP-PHARM",
    department: "Pharmacy",
    description: "Minimum of 5 in all subjects including English, Mathematics, Physics, Chemistry, and Biology",
    requiredSubjects: [
      { name: "English", minPoints: 5 },
      { name: "Mathematics", minPoints: 5 },
      { name: "Physics", minPoints: 5 },
      { name: "Chemistry", minPoints: 5 },
      { name: "Biology", minPoints: 5 }
    ],
    allSubjectsMinPoints: 5 // Minimum points required for all subjects
  }
];

const seedPrograms = async () => {
  try {
    await Program.deleteMany();
    await Program.insertMany(programs);
    console.log("Programs inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedPrograms();