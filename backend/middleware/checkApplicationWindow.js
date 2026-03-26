const Settings = require("../models/Settings");

const checkApplicationWindow = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(500).json({ message: "Application period not set" });
    }

    const now = new Date();

    if (now < settings.applicationStart) {
      return res.status(403).json({
        message: "Application has not started yet",
      });
    }

    if (now > settings.applicationEnd) {
      return res.status(403).json({
        message: "Application period is closed",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = checkApplicationWindow;