const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const user = require("./User");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    accountType: {
      type: String,
      enum: ["savings", "current", "checking", "investment"],
      required: true,
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },
  },
  { timestamps: true }
);
accountSchema.methods.deposit = function (amount) {
  if (amount <= 0) {
    throw new Error("Deposit amount must be positive");
  }
  this.balance += amount;
  return this.balance;
};

accountSchema.methods.withdraw = function (amount) {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be positive");
  }
  if (amount > this.balance) {
    throw new Error("Insufficient funds");
  }
  this.balance -= amount;
  return this.balance;
};

module.exports = mongoose.model("Account", accountSchema);
