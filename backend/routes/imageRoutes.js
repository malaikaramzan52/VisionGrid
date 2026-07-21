const express = require("express");
const multer = require("multer");
const { 
  uploadImage, 
  getAllImages, 
  getImageById, 
  getImagesByCategory,
  deleteImage,
} = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer memory storage configuration (keeps file as a buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept image mimetypes
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// GET /api/images - Retrieve all images (newest first)
router.get("/", getAllImages);

// GET /api/images/:id - Retrieve a specific image by its ID
router.get("/:id", getImageById);

// GET /api/images/category/:categoryId - Retrieve images matching a specific category (newest first)
router.get("/category/:categoryId", getImagesByCategory);

// POST /api/images/upload - Authenticated route to upload file and record details
router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      next();
    });
  },
  uploadImage
);

// DELETE /api/images/:id - Authenticated route to delete own image
router.delete("/:id", authMiddleware, deleteImage);


module.exports = router;
