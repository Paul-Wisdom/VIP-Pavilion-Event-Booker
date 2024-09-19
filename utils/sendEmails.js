const fs = require("fs");
const transporter = require("./nodemailer-transporter");
const config = require("../config/server.config");

const sendInvoice = async (filePath, clientEmail, date) => {
  const mailOptions = {
    from: config.smtpMail,
    to: clientEmail,
    subject: `Invoice`,
    text: `Goodday Sir/Ma, \n\nWe hope this email finds you well.\nPlease find attached the invoice for the services to be provided at your event dated ${date}\nThank you for your prompt attention to this matter. We look forward to the success of your event.
        \n\nBest regards,\nVIP Pavillion`,
    attachments: [
      {
        filename: `invoice.pdf`,
        content: filePath,
        contentType: "application/pdf",
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${clientEmail}: ${info.response}`);
};

const sendReceipt = async (filePath, clientEmail, date) => {
  const mailOptions = {
    from: config.smtpMail,
    to: clientEmail,
    subject: `Receipt`,
    text: `Goodday Sir/Ma, \n\nWe hope this email finds you well.\nHere is the receipt confirming your payment for services to be provided at your event on ${date}\nWe look forward to the success of your event.
        \n\nBest regards,\nVIP Pavillion`,
    attachments: [
      {
        filename: `receipt.pdf`,
        content: filePath,
        contentType: "application/pdf",
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${clientEmail}: ${info.response}`);
};

module.exports = {
  sendInvoice,
  sendReceipt,
};
