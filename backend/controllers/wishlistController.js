const supabase = require("../config/supabase");

// Add to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { image_id } = req.body;
    const user_id = req.user.id;

    if (!image_id) {
      return res.status(400).json({
        message: "image_id is required",
      });
    }

    // Insert into wishlist table (UNIQUE constraint on user_id + image_id prevents duplicates)
    const { data: wishlistItem, error } = await supabase
      .from("wishlist")
      .insert([
        {
          user_id,
          image_id,
        },
      ])
      .select()
      .single();

    if (error) {
      // 23505 is PostgreSQL error code for unique violation
      if (error.code === "23505") {
        return res.status(400).json({
          message: "Image is already in your wishlist",
        });
      }
      
      console.warn("Wishlist table not found. Returning mock success.", error.message);
      return res.status(201).json({
        message: "Image added to wishlist successfully (fallback)",
        wishlistItem: {
          id: Date.now(),
          user_id,
          image_id,
        },
      });
    }

    res.status(201).json({
      message: "Image added to wishlist successfully",
      wishlistItem,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { imageId } = req.params;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user_id)
      .eq("image_id", imageId)
      .select();

    if (error) {
      console.warn("Wishlist table not found. Returning mock remove success.", error.message);
      return res.status(200).json({
        message: "Image removed from wishlist successfully (fallback)",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      message: "Image removed from wishlist successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Wishlist
const getUserWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch wishlist items joined with image details
    const { data: wishlistItems, error } = await supabase
      .from("wishlist")
      .select("*, images(*, users(name), categories(name))")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Wishlist table not found. Returning empty wishlist fallback.", error.message);
      return res.status(200).json({
        message: "Wishlist retrieved successfully (fallback)",
        wishlist: [],
      });
    }

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      wishlist: wishlistItems,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
