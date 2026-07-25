// controllers/geoDataController.js
const GeoData = require("../models/GeoData");

// NASA events no key
const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";

// GET - fetch events from NASA EONET
const fetchGeoData = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const response = await fetch(`${EONET_URL}?limit=${limit}`);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: `NASA API returned status ${response.status}`,
      });
    }

    const data = await response.json();

    // pull out just id, title, category and coordinates from each event
    const events = data.events.map((event) => ({
      eventId: event.id,
      title: event.title,
      category: event.categories[0]?.title || "Unknown",
      longitude: event.geometry[0]?.coordinates[0],
      latitude: event.geometry[0]?.coordinates[1],
    }));

    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST - save one event to mongo and hand back its new id
const createGeoData = async (req, res) => {
  try {
    const newEntry = await GeoData.create(req.body);
    res.status(201).json({
      success: true,
      message: "Geo data saved",
      id: newEntry._id,
      data: newEntry,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET - all stored events
const getAllGeoData = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const entries = await GeoData.find(filter).select("-__v");
    res
      .status(200)
      .json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - one stored event by id
const getGeoDataById = async (req, res) => {
  try {
    const entry = await GeoData.findById(req.params.id).select("-__v");
    if (!entry) {
      return res
        .status(404)
        .json({ success: false, message: "Geo data not found" });
    }
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  fetchGeoData,
  createGeoData,
  getAllGeoData,
  getGeoDataById,
};
