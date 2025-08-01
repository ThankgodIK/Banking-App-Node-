require("dotenv").config();

module.exports = {
  host: process.env.NODEMAILER_HOST || "smtp.ethereal.email",
  port: process.env.NODEMAILER_PORT || 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
};
