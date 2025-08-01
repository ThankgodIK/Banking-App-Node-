const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const User = require("../models/User");

const generateReference = require("../utils/generateReference");
const Account = require("../models/account");
const sendTransactionEmail = require("../utils/transactionEmail");

// exports.transferFunds = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { toAccount, amount } = req.body || {};
//     const fromUser = req.user;

//     if (!toAccount || !amount) {
//       await session.abortTransaction();
//       session.endSession();
//       return res
//         .status(400)
//         .json({ message: "Account number and amount are required." });
//     }

//     const toUser = await Account.findOne({ accountNumber: toAccount }).session(
//       session
//     );
//     console.log(toUser);

//     if (!toUser) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Recipient not found" });
//     }

//     const from = await Account.findOne({ userId: fromUser._id }).session(
//       session
//     );
//     if (!from) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Sender not found" });
//     }

//     if (from.balance < amount) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Insufficient funds" });
//     }

//     // Update balances
//     from.balance -= amount;
//     toUser.balance += amount;

//     await from.save({ session });
//     await toUser.save({ session });

//     const tx = await Transaction.create(
//       [
//         {
//           amount,
//           type: "debit",
//           from: from._id,
//           to: toUser._id,
//           reference: generateReference(),
//           status: "success",
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return res.json({ message: "Transfer successful", transaction: tx[0] });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Transaction error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's account
    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const transactions = await Transaction.find({
      // Find transactions related to the user's account using $or operator
      $or: [{ from: account._id }, { to: account._id }],
    })
      .sort({ createdAt: -1 })
      .populate("from to", "accountNumber") // You can add more fields as needed
      .lean();

    // Format the transactions to include direction(sent or received)
    const formatted = transactions.map((tx) => ({
      ...tx,
      direction:
        tx.from && tx.from._id?.toString() === account._id.toString()
          ? "sent"
          : tx.to && tx.to._id?.toString() === account._id.toString()
          ? "received"
          : "unknown",
    }));

    res.json({ transactions: formatted });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// Transfer funds between accounts
exports.transferFunds = async (req, res) => {
  // Start a session for transaction management
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { toAccount, amount, password } = req.body || {};
    const fromUser = req.user;

    if (!toAccount || !amount) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Account number and amount are required." });
    }

    const toUser = await Account.findOne({ accountNumber: toAccount })
      .populate("userId")
      .session(session);

    if (!toUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if the sender's account exists and is populated
    const from = await Account.findOne({ userId: fromUser._id })
      .populate("userId")
      .session(session);
    if (!from) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender not found" });
    }

    // Check if the amount is enough
    if (from.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Verify the password
    const passwordUser = await User.findById(fromUser._id).select("+password");
    const isPasswordCorrect = await passwordUser.comparePassword(password);

    if (!isPasswordCorrect) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Wrong Password" });
    }

    // Update balances
    from.balance -= amount;
    toUser.balance += amount;

    await from.save({ session });
    await toUser.save({ session });

    // Create transactions for both sender and receiver
    const reference = generateReference();

    const [debitTx, creditTx] = await Transaction.create(
      [
        {
          amount,
          type: "debit",
          from: from._id,
          to: toUser._id,
          reference,
          status: "success",
          balanceAfterTransaction: from.balance,
        },
        {
          amount,
          type: "credit",
          from: from._id,
          to: toUser._id,
          reference,
          status: "success",
          balanceAfterTransaction: toUser.balance,
        },
      ],
      { session, ordered: true }
    );
    // Commit the transaction
    await session.commitTransaction();
    // End the session
    session.endSession();

    //send transaction emails
    await sendTransactionEmail({
      firstName: from.userId.firstName,
      lastName: from.userId.lastName,
      email: from.userId.email,
      transactionType: "Debit",
      accountNumber: from.accountNumber,
      amount,
      reference,
      availableBalance: from.balance,
      date: new Date().toLocaleString(),
    });

    await sendTransactionEmail({
      firstName: toUser.userId.firstName,
      lastName: toUser.userId.lastName,
      email: toUser.userId.email,
      transactionType: "Credit",
      accountNumber: toUser.accountNumber,
      amount,
      reference,
      availableBalance: toUser.balance,
      date: new Date().toLocaleString(),
    });

    return res.json({
      message: "Transfer successful",
      transaction: {
        debit: debitTx,
        credit: creditTx,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
