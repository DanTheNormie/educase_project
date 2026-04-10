require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("express-async-handler");
const db = require("./config/db");
const { calculateDistance } = require("./utils");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
app.use(morgan("combined"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use("/addSchool", limiter);

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("School API is running...");
});

app.post(
  "/addSchool",
  asyncHandler(async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const errors = [];
    if (typeof name !== "string" || !name.trim()) errors.push("name");
    if (typeof address !== "string" || !address.trim()) errors.push("address");
    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      Math.abs(latitude) > 90
    )
      errors.push("latitude (-90 to 90)");
    if (
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      Math.abs(longitude) > 180
    )
      errors.push("longitude (-180 to 180)");

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid or missing: ${errors.join(", ")}` });
    }

    const query =
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [name, address, latitude, longitude]);

    res.status(201).json({
      message: "School added successfully",
      id: result.insertId,
    });
  })
);

app.get(
  "/listSchools",
  asyncHandler(async (req, res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        error: "Invalid or missing latitude/longitude",
      });
    }

    const [results] = await db.query("SELECT * FROM schools");

    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  })
);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});