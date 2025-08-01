const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  firstName,
  lastName,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-user?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">verify</a></p>`;
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${firstName} ${lastName}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
