const sendEmail = async (to, subject, html) => {
  console.log("📧 Email disabled (skipped)");
  console.log("TO:", to);
  console.log("SUBJECT:", subject);
};

module.exports = sendEmail;