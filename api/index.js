const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../backend/routes/authRoutes");
const categoryRoutes = require("../backend/routes/categoryRoutes");
const imageRoutes = require("../backend/routes/imageRoutes");
const wishlistRoutes = require("../backend/routes/wishlistRoutes");

const app = express();

// 1. Configure CORS middleware
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Custom Fail-Safe CORS & Preflight OPTIONS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// 3. Mount Routes under both /api/* and /* for full URL compatibility
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/categories", categoryRoutes);

app.use("/api/images", imageRoutes);
app.use("/images", imageRoutes);

app.use("/api/wishlist", wishlistRoutes);
app.use("/wishlist", wishlistRoutes);

// Health check endpoint
app.get(["/", "/api"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "VisionGrid Backend API is running on Vercel Serverless!",
  });
});

// 4. Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
