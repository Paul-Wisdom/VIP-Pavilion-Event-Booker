const serverConfig = require('../config/server.config'); 

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: serverConfig.smtpMail,
      pass: serverConfig.smtpPass
    }
  });

module.exports = transporter;