const School = require("../models/School");

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const addSchool = (pool) => async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const school = new School(pool);
    const existing = await school.findByNameAndAddress(name, address);

    if (existing.length > 0) {
      return res.status(400).json({ error: "School already exists" });
    }

    await school.create(name, address, latitude, longitude);
    res.json({ message: "School added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listSchools = (pool) => async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const school = new School(pool);
    const schools = await school.getAll();

    const sorted = schools
      .map((s) => ({
        ...s,
        distance: haversine(parseFloat(latitude), parseFloat(longitude), s.latitude, s.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json({ message: "Schools retrieved successfully", schools: sorted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addSchool, listSchools };
