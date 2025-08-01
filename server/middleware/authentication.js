const user = require("../models/User");
const jwt = require("jsonwebtoken");
const { isTokenValid } = require("../utils/jwt");

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  //   const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  const token = req.signedCookies.token; // Extract token from signed cookies
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = isTokenValid({ token }); // Validate the token using utility function
    // console.log("Decoded token:", decoded);

    req.user = await user.findById(decoded._id).select("-password"); // Exclude password from user object
    if (!req.user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("Authenticated user:", req.user);

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorizePermissions = (...role) => {
  // Allow access to the next middleware or route handler

  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
