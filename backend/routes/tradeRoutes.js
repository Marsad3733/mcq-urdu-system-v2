const express = require("express");
const router = express.Router();

const path = require("path");

const Trade = require(path.join(__dirname, "../models/Trade.js"));
const Question = require(path.join(__dirname, "../models/Question.js"));

console.log("DEBUG Trade:", Trade);

// Get all trades WITH question count
router.get("/", async (req, res) => {
  try {
    const trades = await Trade.find();

    const tradesWithCount = await Promise.all(
      trades.map(async (t) => {
        const count = await Question.countDocuments({
          tradeId: t._id
        });

        return {
          ...t._doc,
          questionCount: count
        };
      })
    );

    res.json(tradesWithCount);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add new trade
router.post("/", async (req, res) => {
  try {
    const trade = new Trade({
      name: req.body.name
    });

    const saved = await trade.save();
    res.json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving trade" });
  }
});

// Delete trade
router.delete("/:id", async (req, res) => {
  try {
    await Trade.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;