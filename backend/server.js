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

const path = require("path");

// Serve static frontend files in production if dist exists
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        res.status(404).json({ message: "API Endpoint Not Found" });
      }
    });
  } else {
    res.status(404).json({ message: "API Endpoint Not Found" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});