const express = require("express");
const router = express.Router();
const { Equipment } = require("../models/mongodb");
const mongoose = require("mongoose");

router.get("/dashboard", async (req, res) => {
  try {
    const equipments = await Equipment.find({});
    res.render("dashboard.ejs", { equipments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
