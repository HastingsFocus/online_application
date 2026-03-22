const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema({

    applicationsOpen: {
        type: Boolean,
        default: true
    },

    applicationDeadline: {
        type: Date
    }

});

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);