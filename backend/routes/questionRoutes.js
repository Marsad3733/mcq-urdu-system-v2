const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const Question = require("../models/Question");
const cloudinary = require("../config/cloudinary");

// ✅ CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mcq-questions",
    allowed_formats: ["jpg", "png", "jpeg"]
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
      correct: cleanCorrect,

      // ✅ Cloudinary URL (NOT filename)
      image: req.file ? req.file.path : ""
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

    // ✅ Update image if new one uploaded
    if (req.file) {
      updateData.image = req.file.path;
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