// models/GeoData.js
const mongoose = require("mongoose");

// a stored event
const geoDataSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
    },
    source: {
      type: String,
      default: "NASA EONET",
    },
  },
  { timestamps: true }, // gives me createdAt and updatedAt
);

module.exports = mongoose.model("GeoData", geoDataSchema);
