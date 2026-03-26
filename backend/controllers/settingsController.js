const Settings = require("../models/Settings");

// SET or UPDATE deadline
const setApplicationPeriod = async (req, res) => {
  try {
    const { applicationStart, applicationEnd } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {}, // only one record
      { applicationStart, applicationEnd },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET deadline
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { setApplicationPeriod, getSettings };