const supabase = require("../config/supabase");

// ======================================
// Get Categories
// ======================================
const getCategories = async (req, res) => {
  try {
    // Fetch categories from the database
    let { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    // Handle database error - Fallback to mock default categories if table does not exist
    if (error) {
      console.warn("Categories table not found in database. Using default fallback categories.", error.message);
      
      const fallbackCategories = [
        { id: 1, name: "Nature" },
        { id: 2, name: "Technology" },
        { id: 3, name: "Cars" },
        { id: 4, name: "Animals" },
        { id: 5, name: "Food" },
        { id: 6, name: "People" }
      ];

      return res.status(200).json({
        success: true,
        message: "Categories retrieved successfully (fallback)",
        categories: fallbackCategories,
      });
    }

    // Seed default categories if none exist in the database
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        { name: "Nature" },
        { name: "Technology" },
        { name: "Cars" },
        { name: "Animals" },
        { name: "Food" },
        { name: "People" }
      ];

      const { data: seededCategories, error: seedError } = await supabase
        .from("categories")
        .insert(defaultCategories)
        .select();

      if (seedError) {
        return res.status(500).json({
          success: false,
          message: `Failed to seed categories: ${seedError.message}`,
        });
      }

      categories = seededCategories;
    }

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
};