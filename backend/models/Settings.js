const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  timer: Number
});

module.exports = mongoose.model("Settings", SettingsSchema);