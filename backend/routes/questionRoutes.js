const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Question = require("../models/Question");

// 📁 STORAGE CONFIG
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ GET QUESTIONS
router.get("/:tradeId", async (req, res) => {
  try {
    const questions = await Question.find({ tradeId: req.params.tradeId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// ✅ ADD QUESTION
router.post("/", upload.single("image"), async (req, res) => {
  try {

    const cleanCorrect = req.body.correct?.toUpperCase()?.trim();

    const q = new Question({
      tradeId: req.body.tradeId,
      question: req.body.question,
      optionA: req.body.optionA,
      optionB: req.body.optionB,
      optionC: req.body.optionC,
      optionD: req.body.optionD,

      // ✅ FIXED (no mismatch now)
      correct: cleanCorrect,

      image: req.file ? req.file.filename : ""
    });

    const saved = await q.save();
    res.json(saved);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving question" });
  }
});

// ✏️ UPDATE QUESTION
router.put("/:id", upload.single("image"), async (req, res) => {
  try {

    const cleanCorrect = req.body.correct?.toUpperCase()?.trim();

    const updateData = {
      tradeId: req.body.tradeId,
      question: req.body.question,
      optionA: req.body.optionA,
      optionB: req.body.optionB,
      optionC: req.body.optionC,
      optionD: req.body.optionD,
      correct: cleanCorrect
    };

    // ✅ Only update image if new uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating question" });
  }
});

// ❌ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting" });
  }
});

module.exports = router;