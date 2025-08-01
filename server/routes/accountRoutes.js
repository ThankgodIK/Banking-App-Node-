const express = require("express");
const router = express.Router();

const {
  createAccount,
  getAccountDetails,
  deleteAccount,
  getSingleAccount,
  getAllAccounts,
} = require("../controller/Account");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post("/create-account", authenticateUser, createAccount);
router.get(
  "/",
  authenticateUser,
  authorizePermissions("admin", "owner"),
  getAllAccounts
);

router.get("/account-details", authenticateUser, getAccountDetails);
router.get("/account-details/:accountId", authenticateUser, getSingleAccount);
router.delete("/delete-account/:accountId", authenticateUser, deleteAccount);

module.exports = router;
