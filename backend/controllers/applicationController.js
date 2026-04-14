const Application = require("../models/Application");
const Program = require("../models/Program");
const Settings = require("../models/Settings");
const fs = require("fs");
const path = require("path");

// ==============================
// Submit Application
// ==============================
const submitApplication = async (req, res, next) => {
  console.log("BODY:", req.body);

  try {
    const studentId = req.user.id;

    // ==============================
    // APPLICATION WINDOW CHECK
    // ==============================
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(400).json({
        message: "Application period not set",
      });
    }

    const now = new Date();
    const start = new Date(settings.applicationStart);
    const end = new Date(settings.applicationEnd);

    if (now < start) {
      return res.status(403).json({
        message: "Applications not yet open",
      });
    }

    if (now > end) {
      return res.status(403).json({
        message: "Application deadline passed",
      });
    }

    // ==============================
    // EXTRACT DATA
    // ==============================
    let {
      fullName,
      gender,
      dateOfBirth,
      email,
      phone,
      district,
      address,
      program,
      subjects,
    } = req.body;

    // ==============================
    // FIX SUBJECTS
    // ==============================
    if (typeof subjects === "string") {
      subjects = JSON.parse(subjects);
    }

    subjects = subjects.map((s) => ({
      ...s,
      gradePoints: Number(s.gradePoints),
    }));

    // ==============================
    // VALIDATION
    // ==============================
    if (
      !fullName ||
      !gender ||
      !dateOfBirth ||
      !email ||
      !phone ||
      !district ||
      !address ||
      !program ||
      !subjects
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "Subjects are required" });
    }

    // ==============================
    // FILES
    // ==============================
    const passportPhoto = req.files?.passportPhoto?.[0]?.filename || null;
    const msceCertificate = req.files?.msceCertificate?.[0]?.filename || null;
    const bankSlip = req.files?.bankSlip?.[0]?.filename || null;

    if (!passportPhoto || !msceCertificate || !bankSlip) {
      return res.status(400).json({
        message: "All documents are required",
      });
    }

    // ==============================
    // FIND PROGRAM
    // ==============================
    const selectedProgram = await Program.findOne({ code: program });

    if (!selectedProgram) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    // ==============================
    // ELIGIBILITY CHECK
    // ==============================
    let eligibilityStatus = "eligible";
    const eligibilityReasons = [];

    if (selectedProgram.allSubjectsMinPoints) {
      subjects.forEach((subject) => {
        if (subject.gradePoints > selectedProgram.allSubjectsMinPoints) {
          eligibilityStatus = "not_eligible";
          eligibilityReasons.push(
            `${subject.name} exceeds allowed points`
          );
        }
      });
    }

    selectedProgram.requiredSubjects.forEach((required) => {
      const subject = subjects.find((s) => s.name === required.name);

      if (!subject) {
        eligibilityStatus = "not_eligible";
        eligibilityReasons.push(`Missing ${required.name}`);
      } else if (subject.gradePoints > required.minPoints) {
        eligibilityStatus = "not_eligible";
        eligibilityReasons.push(
          `${required.name} exceeds required points`
        );
      }
    });

    // ==============================
    // SAVE APPLICATION
    // ==============================
    const application = await Application.create({
      student: studentId,
      fullName,
      gender,
      dateOfBirth,
      email,
      phone,
      district,
      address,
      program: selectedProgram._id,
      programCode: selectedProgram.code,
      subjects,
      passportPhoto,
      msceCertificate,
      bankSlip,
      eligibilityStatus,
      status: "pending",
      submittedAt: new Date(),
    });

    await application.populate("program", "name code department");

    // ==============================
    // SUCCESS RESPONSE
    // ==============================
    const responsePayload = {
  message: "Application submitted successfully",
  application,
};

// ==============================
// SEND EMAIL (SAFE - NON BLOCKING)
// ==============================
setTimeout(() => {
  setImmediate(async () => {
    try {
      // OPTIONAL: import sendEmail here if not already in file
      const sendEmail = require("../utils/sendEmail");

      const email = email; // or application.email if stored
      const name = fullName;

      if (email) {
        const emailHTML = `
          <h2>🎉 Application Submitted Successfully</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your application has been received successfully.</p>
          <p>We will notify you once it is reviewed.</p>
        `;

        await sendEmail(email, "Application Received", emailHTML);
        console.log("📧 Application email sent");
      }
    } catch (err) {
      console.log("❌ Email failed:", err.message);
    }
  });

  console.log("📬 Email job queued in background");
}, 0);

// ==============================
// SEND RESPONSE IMMEDIATELY
// ==============================
return res.status(201).json(responsePayload);

  } catch (error) {
    console.error("❌ Application submission error:", error);

    // ==============================
    // CLEANUP FILES IF ERROR
    // ==============================
    if (req.files) {
      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          const filePath = path.join(
            __dirname,
            "../uploads",
            file.filename
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }

    return res.status(500).json({
      message: "Failed to submit application",
    });
  }
};

// ==============================
// Get user's applications
// ==============================
const getUserApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({ student: studentId })
      .populate("program", "name code department")
      .sort("-submittedAt");

    res.status(200).json(applications);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

// ==============================
// Get single application
// ==============================
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("program", "name code department description")
      .populate("student", "name email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.student._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json(application);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching application",
      error: error.message,
    });
  }
};

module.exports = {
  submitApplication,
  getUserApplications,
  getApplicationById,
};