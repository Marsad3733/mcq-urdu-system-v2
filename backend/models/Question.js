const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({

  tradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trade"
  },

  question: String,

  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,

  // ✅ FIXED FIELD NAME
  correct: String,

  image: String

});

module.exports = mongoose.model("Question", QuestionSchema);