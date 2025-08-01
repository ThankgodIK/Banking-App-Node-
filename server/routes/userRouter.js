const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  showCurrentUser,
  updateUser,
} = require("../controller/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

// console.log("DEBUG - getAllUsers is:", getAllUsers);

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin", "owner"), getAllUsers); // Get all users

router.route("/current-user").get(authenticateUser, showCurrentUser); // Get current user details

router.route("/update-user").patch(authenticateUser, updateUser); // Update user details (e.g., profile information, password)

router
  .route("/:userId")
  .get(authenticateUser, getSingleUser) // Get a single user by ID
  .delete(authenticateUser, deleteUser); // Delete a user by ID

module.exports = router;
