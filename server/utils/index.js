const createTokenUser = require("./createTokenUser");
const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const sendResetPasswordEmail = require("./sendResetPassword");

const sendVerificationEmail = require("./sendVerificationemail");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
// This module exports functions for creating and validating JWT tokens.
// The `createJWT` function generates a token with a payload and an expiration time defined in
