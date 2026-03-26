const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  applicationStart: Date,
  applicationEnd: Date,
});

module.exports = mongoose.model("Settings", settingsSchema);