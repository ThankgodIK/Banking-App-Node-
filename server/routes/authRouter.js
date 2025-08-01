const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  dashboard,
  changePassword,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const { authenticateUser } = require("../middleware/authentication");

// Route to register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);
// Route to log out a user
router.post("/logout", logoutUser); // Uncomment if you want to enable logout functionality
router.get("/dashboard", authenticateUser, dashboard);
router.patch("/change-password", authenticateUser, changePassword);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
