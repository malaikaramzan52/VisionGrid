const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header("Authorization");

  // Check if no token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key_12345"
    );

    // Add user from payload to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token is not valid, authorization denied",
    });
  }
};

module.exports = authMiddleware;
