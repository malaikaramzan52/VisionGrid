const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes under this router
router.use(authMiddleware);

// POST /api/wishlist - Add image to wishlist
router.post("/", addToWishlist);

// GET /api/wishlist - Get current user's wishlist
router.get("/", getUserWishlist);

// DELETE /api/wishlist/:imageId - Remove image from wishlist
router.delete("/:imageId", removeFromWishlist);

module.exports = router;
