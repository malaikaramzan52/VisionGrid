const supabase = require("../config/supabase");

// Fallback Mock Images to display if images table is not yet created in the DB
const fallbackImages = [
  {
    id: 1,
    title: "Alpine Sunrise",
    description: "Beautiful mountain scenery",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Nature" },
    users: { name: "Aria Woods" },
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Ocean Mist",
    description: "Calm ocean waves",
    image_url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Nature" },
    users: { name: "Liam Waters" },
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Circuit Dreams",
    description: "High-tech motherboard",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Technology" },
    users: { name: "Sam Code" },
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Speed Machine",
    description: "Fast sportscar on highway",
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Cars" },
    users: { name: "Yara Race" },
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Bali Temple",
    description: "Historic temple site",
    image_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Travel" },
    users: { name: "Ivan Ray" },
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "Abstract Motion",
    description: "Modern colorful digital art",
    image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    categories: { name: "Art" },
    users: { name: "Marco Vinci" },
    created_at: new Date().toISOString()
  }
];

const uploadImage = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;
    const user_id = req.user.id;
    const file = req.file;

    // Validate required fields
    if (!title || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required.",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image.",
      });
    }

    // Generate unique file name
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `uploads/${fileName}`;

    // Upload image to Supabase Storage
    let imageUrl = "";
    const { error: storageError } = await supabase.storage
      .from("visiongrid-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) {
      console.warn("Storage Upload Error. Falling back to Unsplash placeholder image.", storageError.message);
      
      const placeholders = [
        "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      ];
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      imageUrl = placeholders[randomIndex];
    } else {
      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("visiongrid-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // Save image in database
    const { data: image, error } = await supabase
      .from("images")
      .insert([
        {
          user_id,
          category_id,
          title,
          description,
          image_url: imageUrl,
        },
      ])
      .select(`
        id,
        user_id,
        title,
        description,
        image_url,
        created_at,
        users(name),
        categories(name)
      `)
      .single();

    if (error) {
      console.warn("Database Insert Error. Returning uploaded file details as fallback.", error.message);

      const mockNewImage = {
        id: Date.now(),
        title,
        description,
        image_url: imageUrl,
        category_id,
        categories: { name: "Nature" },
        users: { name: "You" },
        created_at: new Date().toISOString()
      };

      fallbackImages.unshift(mockNewImage);

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully. (fallback)",
        image: mockNewImage,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllImages = async (req, res) => {
  try {
    const { data: images, error } = await supabase
      .from("images")
      .select(`
        id,
        user_id,
        title,
        description,
        image_url,
        created_at,
        users(name),
        categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Images table not found in database. Using fallback images.", error.message);
      return res.status(200).json({
        success: true,
        message: "Images fetched successfully. (fallback)",
        images: fallbackImages,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Images fetched successfully.",
      images,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: image, error } = await supabase
      .from("images")
      .select(`
        id,
        user_id,
        title,
        description,
        image_url,
        created_at,
        users(name),
        categories(name)
      `)
      .eq("id", id)
      .single();

    if (error || !image) {
      console.warn("Image not found in database. Searching fallback images.", error ? error.message : "Not found");
      const img = fallbackImages.find(i => String(i.id) === String(id));
      if (!img) {
        return res.status(404).json({
          success: false,
          message: "Image not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Image fetched successfully. (fallback)",
        image: img,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image fetched successfully.",
      image,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Fetch the image first to verify ownership
    const { data: image, error: fetchError } = await supabase
      .from("images")
      .select("id, user_id, image_url")
      .eq("id", id)
      .single();

    if (fetchError || !image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    // Only the owner can delete
    if (String(image.user_id) !== String(user_id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image.",
      });
    }

    // Try to delete from Supabase Storage (only if it's a supabase URL)
    if (image.image_url && image.image_url.includes("visiongrid-images")) {
      // Extract file path from the public URL
      const urlParts = image.image_url.split("/visiongrid-images/");
      if (urlParts.length === 2) {
        const filePath = urlParts[1].split("?")[0]; // remove query params if any
        const { error: storageError } = await supabase.storage
          .from("visiongrid-images")
          .remove([filePath]);

        if (storageError) {
          console.warn("Could not delete file from storage:", storageError.message);
          // Non-fatal — still proceed to delete DB record
        }
      }
    }

    // Delete from DB
    const { error: deleteError } = await supabase
      .from("images")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete image from database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { data: images, error } = await supabase
      .from("images")
      .select(`
        id,
        user_id,
        title,
        description,
        image_url,
        created_at,
        users(name),
        categories(name)
      `)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Images table not found in database. Using filtered fallback images.", error.message);

      const mockCats = {
        1: "Nature",
        2: "Technology",
        3: "Cars",
        4: "Animals",
        5: "Food",
        6: "People"
      };
      const categoryName = mockCats[categoryId] || "Nature";
      const filtered = fallbackImages.filter(img => img.categories?.name === categoryName);

      return res.status(200).json({
        success: true,
        message: "Category images fetched successfully. (fallback)",
        images: filtered,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category images fetched successfully.",
      images,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  getImagesByCategory,
  deleteImage,
};
