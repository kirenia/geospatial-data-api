// routes/geoDataRoutes.js
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  fetchGeoData,
  createGeoData,
  getAllGeoData,
  getGeoDataById,
} = require("../controllers/geoDataController");

// cap NASA calls at 10 per min
const fetchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message:
      "Too many requests to the NASA fetch endpoint. Try again in a minute.",
  },
});

// /fetch has to come before /:id or express reads "fetch" as an id
router.get("/fetch", fetchLimiter, fetchGeoData);
router.get("/", getAllGeoData);
router.post("/", createGeoData);
router.get("/:id", getGeoDataById);

module.exports = router;
