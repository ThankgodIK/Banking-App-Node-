const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: Number,
  type: { type: String, enum: ["credit", "debit"], required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  reference: String,
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
  balanceAfterTransaction: Number,
});

module.exports = mongoose.model("Transaction", transactionSchema);
