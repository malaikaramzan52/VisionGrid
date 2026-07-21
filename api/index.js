const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../backend/routes/authRoutes");
const categoryRoutes = require("../backend/routes/categoryRoutes");
const imageRoutes = require("../backend/routes/imageRoutes");
const wishlistRoutes = require("../backend/routes/wishlistRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Support both /api/* and /* routes for maximum compatibility
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/categories", categoryRoutes);

app.use("/api/images", imageRoutes);
app.use("/images", imageRoutes);

app.use("/api/wishlist", wishlistRoutes);
app.use("/wishlist", wishlistRoutes);

app.get("/api", (req, res) => {
  res.json({ success: true, message: "VisionGrid API running on Vercel Serverless!" });
});

module.exports = app;
