const express = require("express");
const router = express.Router();

const Settings = require("../models/Settings");

// Get timer
router.get("/", async (req, res) => {
  let s = await Settings.findOne();

  if (!s) {
    s = await Settings.create({ timer: 30 });
  }

  res.json(s);
});

// Update timer
router.post("/", async (req, res) => {
  let s = await Settings.findOne();

  if (!s) {
    s = await Settings.create({ timer: req.body.timer });
  } else {
    s.timer = req.body.timer;
    await s.save();
  }

  res.json(s);
});

module.exports = router;