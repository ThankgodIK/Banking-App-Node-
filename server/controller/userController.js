const User = require("../models/User");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const getAllUsers = async (req, res) => {
  console.log("DEBUG - getAllUsers function is being called");

  try {
    console.log("DEBUG - getAllUsers is being called");
    const users = await User.find({ role: "user" }).select("-password -__v");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId }).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const showCurrentUser = async (req, res) => {
  const { _id } = req.user; // Assuming req.user is set by authentication middleware

  try {
    const user = await User.findById(_id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Current user fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const updateUser = async (req, res) => {
//   const { firstName, lastName, email } = req.body;
//   if (!firstName || !lastName || !email) {
//     return res.status(400).json({ message: "Name and email are required" });
//   }
//   try {
//     console.log("req.user:", req.user);

//     // Check if email is actually different
//     if (req.user.email === email) {
//       // Only update name
//       const user = await User.findByIdAndUpdate(
//         req.user._id,
//         { firstName, lastName },
//         { new: true, runValidators: true }
//       ).select("-password -__v");

//       const tokenUser = createTokenUser(user);
//       attachCookiesToResponse({ res, user: tokenUser });

//       return res.status(200).json({
//         message: "User updated successfully",
//         user: tokenUser,
//       });
//     }

//     // If email is different, update all fields
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { email, firstName, lastName },
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-password -__v");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const tokenUser = createTokenUser(user);
//     // Attach updated user information to the response
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(200).json({
//       message: "User updated successfully",
//       user: tokenUser,
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // Check if email is being changed
    if (req.user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(409).json({ message: "Email is already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, firstName, lastName },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(200).json({
      message: "User updated successfully",
      user: tokenUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  showCurrentUser,
  updateUser,
};
