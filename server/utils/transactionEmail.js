const sendEmail = require("./sendEmail");

const sendTransactionEmail = async ({
  firstName = "",
  lastName = "",
  email,
  transactionType,
  accountNumber,
  amount,
  reference,
  availableBalance,
  date,
}) => {
  return sendEmail({
    to: email,
    subject: `${transactionType} Alert!`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear ${firstName} ${lastName},</p>
        <p>This is to notify you that a <strong>${transactionType}</strong> transaction just occurred on your account.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Amount:</strong> ₦${Number(amount).toLocaleString()}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Available Balance:</strong> ₦${Number(
            availableBalance
          ).toLocaleString()}</li>
          <li><strong>Time:</strong> ${new Date(date).toLocaleString()}</li>
          <li><strong>Reference:</strong> ${reference}</li>
        </ul>
        <p>Thank you for banking with us.</p>
      </div>
    `,
  });
};

module.exports = sendTransactionEmail;
