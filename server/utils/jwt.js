const jwt = require("jsonwebtoken");

// Function to generate JWT token
const createJWT = function ({ payload }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
    signed: true, // Use signed cookies for added security
  }); // Set cookie expiration to 1 day
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
// This module provides functions to create and validate JWT tokens.
// The `createJWT` function generates a token with a payload and an expiration time defined in
