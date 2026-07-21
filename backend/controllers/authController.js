const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

// ===============================
// SIGNUP
// ===============================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        success: false,
        message: checkError.message,
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
        },
      ])
      .select("id,name,email,created_at")
      .single();

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: insertError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// LOGIN
// ===============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find User
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        joinedAt: user.created_at,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};