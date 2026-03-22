const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    department: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    requiredSubjects: [
      {
        name: String,
        minPoints: Number
      }
    ],
    allSubjectsMinPoints: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema);