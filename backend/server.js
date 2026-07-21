const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  res.json({
    data,
    error,
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Category Routes
app.use("/api/categories", categoryRoutes);

// Image Routes
app.use("/api/images", imageRoutes);

// Wishlist Routes
app.use("/api/wishlist", wishlistRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});