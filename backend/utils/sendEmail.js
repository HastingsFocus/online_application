const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // 🔥 IMPORTANT: prevent Render/Gmail hanging
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// 🔥 verify connection once at startup (optional but useful)
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP connection failed:", error.message);
  } else {
    console.log("✅ SMTP server ready");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Admissions Office" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.log("❌ Email send error:", error.message);

    // ❗ IMPORTANT: do NOT crash app
    return;
  }
};

module.exports = sendEmail;