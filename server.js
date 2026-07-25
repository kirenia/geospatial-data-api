// server.js
require("dotenv").config(); // load .env before anything reads it
const express = require("express");
const connectDB = require("./config/db");
const geoDataRoutes = require("./routes/geoDataRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());

// sanity check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Geospatial Data API is running" });
});

app.use("/api/geo-data", geoDataRoutes);

// anything that didn't match above
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
