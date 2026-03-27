const mongoose = require("mongoose");

console.log("Trade model file loaded");

const tradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Trade", tradeSchema);