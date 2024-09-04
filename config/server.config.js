require('dotenv').config();

const env = process.env.ENV || 'development';
const serverPort = process.env.SERVER_PORT;
const serverURL = process.env.SERVER_URL;
const smtpMail = process.env.SMTP_MAIL;
const smtpPass = process.env.SMTP_PASS;
const chromeExecutablePath = process.env.executablePath
module.exports = {
    env,
    serverPort,
    serverURL,
    smtpMail,
    smtpPass,
    chromeExecutablePath
}