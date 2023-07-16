const express = require("express");
const turf = require("@turf/turf");

const app = express();
const port = 8080;

app.use(express.json());

app.post("/intersections", (req, res) => {
  // To check the authorization
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(400).json({ error: "Missing authentication header" });
  }

  const { linestring } = req.body;
  if (!linestring || !Array.isArray(linestring) || linestring.length < 2) {
    return res.status(400).json({ error: "Invalid linestring" });
  }
  const intersections = findIntersectingLines(linestring);
  res.json(intersections);
});

function findIntersectingLines(lineString) {
  const intersections = [];

  // Define the set of 50 randomly spread lines
  const lines = [
    { id: "L01", start: [0, 0], end: [1, 1] },
    // Add other lines here...
    { id: "L50", start: [2, 2], end: [3, 3] },
  ];

  // Check for intersection with each line
  for (const line of lines) {
    const lineGeoJSON = turf.lineString([line.start, line.end]);
    const lineStringGeoJSON = turf.lineString(lineString);
    if (turf.booleanIntersects(lineGeoJSON, lineStringGeoJSON)) {
      const intersection = turf.lineIntersect(lineGeoJSON, lineStringGeoJSON);
      intersection.features.forEach((feature) => {
        const intersectionPoint = feature.geometry.coordinates;
        intersections.push({
          line_id: line.id,
          intersection_point: intersectionPoint,
        });
      });
    }
  }

  return intersections;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
