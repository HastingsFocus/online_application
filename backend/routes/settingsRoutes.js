const express = require("express");
const router = express.Router();

const {
  setApplicationPeriod,
  getSettings,
} = require("../controllers/settingsController");

router.post("/", setApplicationPeriod);
router.get("/", getSettings);

module.exports = router;