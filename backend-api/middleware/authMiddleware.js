require("dotenv").config();
const jwt = require("jsonwebtoken");

// JWT Middleware to protect routes
const authMiddleware = (req, res, next) => {
  // Get token from the "Authorization" header (e.g., "Bearer <token>")
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied! No token provided." });
  }

  // If the token comes with a "Bearer " prefix, remove it
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // Verify token with the secret key from environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the verified user data to the request object
    req.user = verified;
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token!" });
  }
};

module.exports = authMiddleware;
