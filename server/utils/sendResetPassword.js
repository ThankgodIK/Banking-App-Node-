const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  firstName,
  lastName,
  email,
  token,
  origin,
}) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link: <a href="${resetURL}">Reset Password</a></p>`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${firstName} ${lastName}</h4> ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
