const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
require('dotenv').config();
const config = require('../config/server.config');

//type is 0 for invoice and 1 for receipts
async function createReceiptPDF(receiptData, outputPath, type) {
  const data = {
      ...receiptData,
      companyName: 'VIP PAVILLION',
      companyAddress: '100 Igando Road, Ikotun, Lagos 102213, Lagos',
      companyPhone: '(+234) 802 343 4848, (+234) 814 788 0481',
    };
  
  const executablePath = process.env.ENV === "development"? config.chromeExecutablePath: await chromium.executablePath;
  const args = process.env.ENV === "development"? [] : chromium.args;
  const headless = process.env.ENV === "development"? false : chromium.headless
  console.log(executablePath);
  const browser = await puppeteer.launch({
        executablePath: executablePath,
        args: args,
        headless: headless,
      });
  const page = await browser.newPage();

  // Generate HTML content dynamically based on receipt data
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: white;
          color: black;
          padding: 20px;
        }
        .receipt-container {
          border: 2px solid gold;
          padding: 20px;
          border-radius: 10px;
        }
        .receipt-title {
          text-align: center;
          font-size: 24px;
          color: gold;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-weight: bold;
          color: gold;
          margin-bottom: 10px;
        }
        .section-content {
          margin-left: 10px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th, .items-table td {
          border: 1px solid gold;
          padding: 10px;
          text-align: left;
        }
        .items-table th {
          background-color: gold;
          color: white;
        }
        .items-table td {
          background-color: #fff8dc; /* Light gold color */
        }
        .total {
          text-align: right;
          font-size: 18px;
          color: black;
          margin-bottom: 20px;
        }
        .thank-you {
          text-align: center;
          font-size: 16px;
          color: gold;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="receipt-title">${type > 0 ? 'Receipt' : 'Invoice'}</div>
        
        <div class="section">
          <div class="section-title">Company Information</div>
          <div class="section-content">
            <strong>Company Name:</strong> ${data.companyName}<br>
            <strong>Address:</strong> ${data.companyAddress}<br>
            <strong>Phone:</strong> ${data.companyPhone}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="section-content">
            <strong>Customer Email:</strong> ${data.customerEmail}<br>
            <strong>Event Date:</strong> ${data.eventDate}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Receipt Details</div>
          <div class="section-content">
            <strong>Receipt ID:</strong> ${data.receiptNumber}<br>
            <strong>Date:</strong> ${data.receiptGenerationDate}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Items</div>
          <table class="items-table">
            <tr>
              <th>Service</th>
              <th>Price (N)</th>
            </tr>
            ${data.items.map(item => `
            <tr>
              <td>${item.category}</td>
              <td>${Number(item.amount).toFixed(2)}</td>
            </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="total">
          <strong>Total Amount: N${data.items.reduce((acc, item) => acc + Number(item.amount), 0).toFixed(2)}</strong><br>
          <strong>Status: ${type > 0 ? 'PAID' : 'Pending Payment'}</strong>
        </div>
        
        <div class="thank-you">
          Thank you for your patronage!
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  return outputPath;
}

module.exports = createReceiptPDF
