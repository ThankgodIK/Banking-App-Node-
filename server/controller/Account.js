const Account = require("../models/account");

// Function to create a new account
const Counter = require("../models/Counter");

// This function handles the creation of a new account for the authenticated user
// It generates a unique account number using a counter and saves the account details in the database
const createAccount = async (req, res) => {
  const { firstName, lastName, email, _id } = req.user;
  const { accountType } = req.body;

  try {
    // const existingUser = await Account.findOne({ userId: _id });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already has an account" });
    // }

    // Generate a safe, atomic account number
    const counter = await Counter.findOneAndUpdate(
      { name: "accountNumber" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const newAccountNumber = counter.value;

    const newAccount = await Account.create({
      userId: _id,
      firstName,
      lastName,
      email,
      accountType,
      accountNumber: newAccountNumber,
    });

    res.status(201).json({
      message: `Hello ${firstName} ${lastName}, your ${accountType} account has been created successfully!`,
      accountNumber: newAccountNumber,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a single account by ID
// This function retrieves a single account based on the provided accountId and userId
const getSingleAccount = async (req, res) => {
  const { _id } = req.user;
  const { accountId } = req.params;

  try {
    // Find and delete the account by userId
    const account = await Account.findOne({ _id: accountId, userId: _id });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found or unauthorized" });
    }

    res.status(200).json({
      account: account,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get account details for the authenticated user
// This function retrieves all accounts associated with the authenticated user
const getAccountDetails = async (req, res) => {
  const { _id } = req.user;
  try {
    res.status(200).json({
      message: "Account details fetched successfully",
      account: await Account.find({ userId: _id }).select("-__v"),
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAccounts = async (req, res) => {
  const accounts = await Account.find({}).select("-__v");
  if (!accounts || accounts.length === 0) {
    return res.status(404).json({ message: "No accounts found" });
  }
  res.status(200).json({
    message: "All accounts fetched successfully",
    accounts,
  });
};

// Function to delete an account by ID
// This function deletes an account based on the provided accountId and userId
const deleteAccount = async (req, res) => {
  const { _id } = req.user;
  const { accountId } = req.params;
  //   if (accountId !== _id) {
  //     return res.status(403).json({ message: "Invalid Account!" });
  //   }
  try {
    // Find and delete the account by userId
    const account = await Account.findOne({ _id: accountId, userId: _id });
    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found or unauthorized" });
    }
    await Account.findOneAndDelete({ _id: accountId });
    res.status(200).json({
      message: `Account:${account.accountNumber} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAccount,
  getAccountDetails,
  deleteAccount,
  getSingleAccount,
  getAllAccounts,
};
