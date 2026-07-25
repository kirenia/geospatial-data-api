# Geospatial Data API

A Node.js REST API that pulls natural event data from NASA's EONET feed, stores it in MongoDB, and lets you read it back. Built with Express and Mongoose.

## What it does

Fetches live natural events (wildfires, storms, volcanoes, etc.) from NASA, each tagged with real coordinates. You can save events to the database and query them back out.

## API used

**NASA EONET** (Earth Observatory Natural Event Tracker)
`https://eonet.gsfc.nasa.gov/api/v3/events`

No API key required. Returns JSON with an array of events, each holding a title, category, and geometry with latitude/longitude coordinates. (NASA also offers keyed APIs at https://api.nasa.gov if you want to swap one in.)

## Setup

### Prerequisites

- Node.js
- MongoDB running locally

### Install

\`\`\`bash
npm install
\`\`\`

### Environment

Create a \`.env\` file in the root:
\`\`\`
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/geodata
\`\`\`

### Run

\`\`\`bash
npm run dev # nodemon, auto restart
npm start # plain node
\`\`\`
On startup you should see \`Server running on http://localhost:4000\` and \`MongoDB Connected\`.

## Routes

Base URL: \`http://localhost:4000\`

| Method | Endpoint            | What it does                                                                             |
| ------ | ------------------- | ---------------------------------------------------------------------------------------- |
| GET    | /api/geo-data/fetch | Fetches live events from NASA (does not save). ?limit= optional. Rate limited to 10/min. |
| POST   | /api/geo-data       | Saves an event to MongoDB, returns its id                                                |
| GET    | /api/geo-data       | Gets all stored events. ?category= optional filter                                       |
| GET    | /api/geo-data/:id   | Gets one stored event by its MongoDB id                                                  |

Note: the assignment listed \`GET /api/geo-data\` for both fetching from NASA and reading stored data. Since two GETs can't share one path, the NASA fetch lives at \`/api/geo-data/fetch\` and \`/api/geo-data\` returns stored data.

## Example

**Fetch from NASA**
\`\`\`
GET /api/geo-data/fetch?limit=5
\`\`\`

**Save an event**
\`\`\`json
POST /api/geo-data
{
"eventId": "EONET_21575",
"title": "Wildfire West Blue Crab, Cameron, Louisiana",
"category": "Wildfires",
"longitude": -93.42765,
"latitude": 29.880643
}
\`\`\`
Returns \`201\` with the saved document's \`id\`.

## Status codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK                                   |
| 201  | Created                              |
| 400  | Bad request (invalid id or bad body) |
| 404  | Not found                            |
| 429  | Too many requests (rate limit hit)   |
| 500  | Server error                         |
| 502  | NASA API returned an error           |

## Rate limiting (bonus)

The \`/fetch\` route is capped at 10 requests per minute per IP using \`express-rate-limit\`, so the external NASA API doesn't get hammered. Going over returns a \`429\` with a friendly message.

## Structure

\`\`\`
server.js entry point
config/db.js mongo connection
models/GeoData.js mongoose schema
controllers/geoDataController.js route logic
routes/geoDataRoutes.js route definitions
\`\`\`

## Tech

Node.js · Express · MongoDB · Mongoose · express-rate-limit · dotenv

---

## AI Disclosure

This README was drafted by Claude (Anthropic) based on the project's structure and code, which I shared for reference. The API code is my own work.
