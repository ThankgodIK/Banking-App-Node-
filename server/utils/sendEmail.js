// const nodemailer = require("nodemailer");

// const sendEmail = async () => {
//   let testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 2525,
//     secure: false,
//     auth: {
//       user: "janis51@ethereal.email",
//       pass: "H1RcMcyV3DPCMeM2g2",
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//     to: "bar@example.com, baz@example.com",
//     subject: "Hello ✔",
//     text: "Hello world?", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");
const nodeMailerConfig = require("./nodeMailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: '"Test Bank" <info@testbank.com>',
    to,
    subject,

    html,
  });

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
