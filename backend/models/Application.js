const mongoose = require("mongoose");

// Schema for student subjects + grades
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gradePoints: { type: Number, required: true, min: 1, max: 9 }
});

// Main Application Schema
const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Personal info
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },

    // Program selection
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    programCode: { type: String },

    // Grades
    subjects: [subjectSchema],

    // ⭐ MSCE Merit Calculation
    totalPoints: {
      type: Number,
      default: 0
    },
    
    averagePoints: {
      type: Number,
      default: 0
    },

    // Program-specific eligibility results
    eligiblePrograms: [{
      programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
      programName: String,
      programCode: String,
      eligible: Boolean,
      reasons: [String]
    }],

    eligibilityStatus: {
      type: String,
      enum: ["eligible", "not_eligible", "pending"],
      default: "pending"
    },

    // Uploaded files
    passportPhoto: { type: String },
    msceCertificate: { type: String },
    bankSlip: { type: String },

    // Progress tracking
    progress: { type: Number, default: 0, min: 0, max: 100 },

    // Application status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ==============================
// PRE-SAVE HOOK (FIXED)
// ==============================
applicationSchema.pre("save", function () {
  if (this.subjects && this.subjects.length > 0) {
    const total = this.subjects.reduce(
      (sum, subject) => sum + subject.gradePoints,
      0
    );

    this.totalPoints = total;
    this.averagePoints = total / this.subjects.length;
  }
});

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);