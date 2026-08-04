const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files/workspace", fileRoutes);

const PORT = process.env.PORT || 5000;

// Test Database Connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      success: true,
      message: "Database connected successfully!",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
