const express = require("express");
const { addSchool, listSchools } = require("../controllers/schoolController");

const router = (pool) => {
  const r = express.Router();
  r.post("/addSchool", addSchool(pool));
  r.get("/listSchools", listSchools(pool));
  return r;
};

module.exports = router;
