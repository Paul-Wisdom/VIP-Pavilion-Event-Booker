const PDFDocument = require("pdfkit");
const fs = require("fs");

// type is 0 for invoice and 1 for receipts
async function createReceiptPDF(receiptData) {
  const data = {
    ...receiptData,
    companyName: "VIP PAVILLION",
    companyAddress: "100 Igando Road, Ikotun, Lagos 102213, Lagos",
    companyPhone: "(+234) 802 343 4848, (+234) 814 788 0481",
  };
  console.log(data);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);

    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fillColor("whitesmoke")
      .fill();
    doc
      .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
      .lineWidth(2)
      .strokeColor("#000000")
      .stroke();

    doc.fillColor("darkblue");

    doc.fontSize(20).text(`${data.companyName}`, { align: "center" });
    doc.fontSize(12).text(`${data.companyAddress}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`${data.companyPhone}`, { align: "center" });
    doc.moveDown(0).lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    if (data.type === 0) {
      doc.fontSize(18).text("Invoice", { align: "center" });
      doc.moveDown();
    } else {
      doc.fontSize(18).text("Receipt", { align: "center" });
      doc.moveDown();
    }

    doc
      .fontSize(15)
      .text("   ", { continued: true })
      .text("Client Details", { align: "left", underline: true });
    doc.fontSize(15).text(`Email:  ${data.customerEmail}`, { align: "left" });
    doc.fontSize(15).text(`Event Date: ${data.eventDate}`, { align: "left" });
    doc.moveDown();

    doc
      .fontSize(15)
      .text("   ", { continued: true })
      .text("Details", { align: "left", underline: true });
    doc.fontSize(15).text(`ID:  ${data.receiptNumber}`, { align: "left" });
    doc
      .fontSize(15)
      .text(`Generation Date/Time: ${data.receiptGenerationDate}`, {
        align: "left",
      });
    doc.moveDown();

    doc
      .fontSize(15)
      .text("Amount in words:   ", { align: "left", continued: true })
      .fontSize(15)
      .text(`${data.amountStr} Naira Only`, { underline: true });
    doc.moveDown();

    doc
      .fontSize(15)
      .text(`Amount in figures: N${data.amountNum}`, { align: "left" });
    doc.moveDown();
    doc
      .fontSize(15)
      .text(`Payment Status: ${data.type === 0 ? "Pending" : "Paid"}`, {
        align: "left",
      });
    doc.moveDown();
    doc.end();
  });
}

module.exports = createReceiptPDF;
