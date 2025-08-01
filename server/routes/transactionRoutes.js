const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  transferFunds,
  getMyTransactions,
} = require("../controller/transaction");

router.post("/send-money", authenticateUser, transferFunds);
router.get("/", authenticateUser, getMyTransactions);

module.exports = router;
