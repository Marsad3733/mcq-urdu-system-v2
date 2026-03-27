const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

console.log("Starting server...");

app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas Connection (from .env)
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Atlas Connected"))
.catch(err => console.log("Mongo Error:", err));

// Routes
const questionRoutes = require("./routes/questionRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

app.use("/api/settings", settingsRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/trades", tradeRoutes);



// ✅ IMPORTANT for deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});