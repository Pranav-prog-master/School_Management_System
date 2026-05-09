require("dotenv").config({ quiet: true });
const express = require("express");
const connectDB = require("./config/db");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
app.use(express.json());

(async () => {
  const pool = await connectDB();
  app.use("/", schoolRoutes(pool));

  const PORT = 5000;
  app.listen(PORT, () => console.log(`School Management API running on http://localhost:${PORT}`));
})();
