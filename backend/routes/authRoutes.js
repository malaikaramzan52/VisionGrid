const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Test Route
router.get("/", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Protected Test Route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

module.exports = router;