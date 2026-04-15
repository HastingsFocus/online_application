const Application = require("../models/Application");
const PDFDocument = require("pdfkit");
const sendEmail = require("../utils/sendEmail");

// ============================
// Get All Applications (WITH SEARCH + STATUS FILTER)
// ============================
const getAllApplications = async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const searchRegex = new RegExp(search, "i");

    let matchStage = {
      $or: [
        { "student.fullName": { $regex: searchRegex } },
        { "student.district": { $regex: searchRegex } },
        { "program.name": { $regex: searchRegex } },
      ],
    };

    // 🔥 ADD STATUS FILTER
    if (status) {
      matchStage.status = status;
    }

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "program",
        },
      },
      { $unwind: "$program" },

      {
        $match: matchStage,
      },

      { $sort: { createdAt: -1 } },
    ];

    const applications = await Application.aggregate(pipeline);

    res.json({ applications });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// ============================
// Get Single Application
// ============================
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student")
      .populate("program");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching application" });
  }
};

// ============================
// Update Status (EMAIL DISABLED)
// ============================
const updateApplicationStatus = async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body;

    const application = await Application.findById(appId)
      .populate("student")
      .populate("program");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // 🚫 EMAIL TEMPORARILY DISABLED
    /*
    if (status === "accepted") {
      const email = application.student?.email;
      const name = application.student?.fullName;

      const emailHTML = `...`;

      setImmediate(async () => {
        try {
          await sendEmail(email, "🎓 Admission Offer", emailHTML);
        } catch (err) {
          console.log("❌ Email failed:", err.message);
        }
      });
    }
    */

    // ✅ RESPONSE MUST BE OUTSIDE COMMENT
    res.json({
      message: "Application status updated",
      application,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};

// ============================
// Dashboard Stats
// ============================
const getDashboardStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: "pending" });
    const accepted = await Application.countDocuments({ status: "accepted" });
    const rejected = await Application.countDocuments({ status: "rejected" });

    res.json({
      totalApplications,
      pending,
      accepted,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// ============================
// Download PDF
// ============================
const downloadAcceptedStudents = async (req, res) => {
  try {
    const students = await Application.find({ status: "accepted" })
      .populate("student")
      .populate("program");

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=accepted_students.pdf"
    );

    doc.pipe(res);

    // 🔥 TITLE
    doc.fontSize(20).text("Accepted Students", { align: "center" });
    doc.moveDown(2);

    // 🔥 TABLE SETTINGS
    const startX = 50;
    let currentY = 150;

    const colWidths = [50, 150, 150, 200]; // #, Name, Program, Email

    // 🔥 FUNCTION TO CALCULATE ROW HEIGHT
    const getRowHeight = (row) => {
      let maxHeight = 0;

      row.forEach((cell, i) => {
        const cellHeight = doc.heightOfString(String(cell), {
          width: colWidths[i] - 10,
        });

        if (cellHeight > maxHeight) {
          maxHeight = cellHeight;
        }
      });

      return maxHeight + 10; // padding
    };

    // 🔥 DRAW ROW FUNCTION
    const drawRow = (y, row) => {
      const rowHeight = getRowHeight(row);
      let x = startX;

      row.forEach((cell, i) => {
        const width = colWidths[i];

        // Draw border
        doc.rect(x, y, width, rowHeight).stroke();

        // Draw text
        doc.text(String(cell), x + 5, y + 5, {
          width: width - 10,
        });

        x += width;
      });

      return rowHeight;
    };

    // 🔥 HEADER
    doc.font("Helvetica-Bold");
    const headerHeight = drawRow(currentY, ["#", "Name", "Program", "Email"]);
    currentY += headerHeight;

    // 🔥 BODY
    doc.font("Helvetica");

    students.forEach((app, index) => {
      const row = [
        index + 1,
        app.student?.username || "N/A",
        app.program?.name || "N/A",
        app.student?.email || "N/A",
      ];

      const rowHeight = drawRow(currentY, row);
      currentY += rowHeight;
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// EXPORTS
// ============================
module.exports = {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getDashboardStats,
  downloadAcceptedStudents
};