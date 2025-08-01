const User = require("../models/User");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils");
const crypto = require("crypto");

// Function to register a new user
// This function handles the registration of a new user by checking if the user already exists,
const registerUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const verificationToken = crypto.randomBytes(40).toString("hex"); // Replace with actual token generation logic if needed
    const newUser = await User.create({ ...req.body, verificationToken });

    const origin = "http://localhost:3000";

    await sendVerificationEmail({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      verificationToken: newUser.verificationToken,
      origin,
    });
    //only send verification token while testing in development
    res.status(201).json({
      message: "Success! Please check your email to verify your account",
    });

    // const token = createJWT({ payload: tokenUser });
    //   user: {
    //     id: newUser._id,
    //     name: newUser.name,
    //     email: newUser.email,
    //   }, token
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//logging the user registration function
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password"); // Ensure password is included for comparison
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user is verified
    if (!user.isEmailVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before Logging in!" });
    }
    // Generate JWT token
    const tokenUser = createTokenUser(user);

    // const token = createJWT({ payload: tokenUser });
    attachCookiesToResponse({ res, user: tokenUser });
    // const token = user.createJWT();
    console.log(req.signedCookies.token);

    res.status(200).json({
      message: `${user.firstName} logged in successfully`,
      //   token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const dashboard = (req, res) => {
  // const { user } = req;
  // if (!user) {
  //   return res.status(401).json({ message: "Unauthorized access" });
  // }
  res.status(200).json({
    message: `Welcome Back to the dashboard, ${req.user.firstName}!`,
    // user: req.user, // Assuming req.user is set by authentication middleware
  });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password"); // Ensure password is included for comparison
  //   const user = req.user; // Assuming user is set by authentication middleware
  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Fields must not be empty!" });
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    user.password = newPassword; // Update the password
    await user.save(); // Save the updated user document
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  try {
    if (!email || !verificationToken) {
      return res.status(400).json({ message: "Provide email and token" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "No user found!" });
    }

    // console.log("hello. got here-ln 138");
    if (verificationToken !== user.verificationToken) {
      return res.status(401).json({ message: "Invalid verification token!" });
    }

    user.isEmailVerified = true;
    user.verified = Date.now();
    user.verificationToken = "";
    await user.save();

    res.status(201).json({
      message: `Your email:${email} has successfully been verified`,
    });
  } catch (error) {
    console.log("an error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    //send email
    const origin = "http://localhost:3000";
    await sendResetPasswordEmail({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res.status(201).json({
    message: `Please check your email for your reset password link`,
  });
};

const resetPassword = async (req, res) => {
  // const { email } = req.body;
  try {
    res.status(201).json({
      message: `Reset password`,
    });
  } catch (error) {
    console.log("an error occurred", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  dashboard,
  changePassword,
  logoutUser,
  verifyEmail,
  resetPassword,
  forgotPassword, // Exporting the registerUser function
};
