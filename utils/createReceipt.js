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
        .fillColor("#F5F5F5")
        .fill();
      doc
        .rect(45, 45, doc.page.width - 90, doc.page.height - 90)
        .lineWidth(3)
        .strokeColor("navy")
        .stroke();
  
      
        doc.fillColor("navy");
      doc.fontSize(20).text(`${data.companyName}`, { align: "center" });
    //   doc.fillColor("#000000");
      doc.fontSize(12).text(`${data.companyAddress}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`${data.companyPhone}`, { align: "center" });
      doc.moveDown(0).lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fillColor("navy");
      if (data.type === 0) {
        doc.fontSize(15).text("Invoice", { align: "left" });
      } else {
        doc.fontSize(15).text("Receipt", { align: "left" });
      }
      doc.fillColor("#000000");
    doc.fontSize(13).text(`ID:  ${data.receiptNumber}`, { align: "left" });
    doc
      .fontSize(13)
      .text(`Generated at : ${data.receiptGenerationDate}`, {
        align: "left",
      });
    doc.moveDown(3);
    doc.fillColor("navy");
      doc
        .fontSize(15)
        .text("Client Information", { align: "left"});
        doc.fillColor("#000000");
      doc.fontSize(13).text(`Email:  ${data.customerEmail}`, { align: "left" });
      doc.fontSize(13).text(`Event Date: ${data.eventDate}`, { align: "left" });
      doc.moveDown(2);
      doc.fillColor("navy");
      if(data.type === 0)
      {
        doc.fontSize(15).text('Amount Due:')
        doc.fillColor("#000000");
      doc
        .fontSize(15)
        .text("In words:   ", { align: "left", continued: true })
        .fontSize(15)
        .text(`${data.amountStr} Naira Only`, { underline: true });

      doc
        .fontSize(15)
        .text(`In figures: N${data.amountNum}`, { align: "left" });
      doc.moveDown();
      }
      else{
        doc.fontSize(15).text('Amount Received:')
        doc.fillColor("#000000");
      doc
        .fontSize(15)
        .text("In words:   ", { align: "left", continued: true })
        .fontSize(15)
        .text(`${data.amountStr} Naira Only`, { underline: true });
  
      doc
        .fontSize(15)
        .text(`In figures: N${data.amountNum}`, { align: "left" });
      doc.moveDown();
      }
      doc.fillColor("#000000");
      doc.fontSize(13).text(`Payment ${data.type === 0? 'due': 'made'} for renting our hall at ${data.companyAddress} including Decorations, Security and Post-event clean up services.`)
      doc.moveDown(2);
      doc.fillColor("navy");
      doc.fontSize(15).text(`Thank You For Your ${data.type === 0? 'Patronage': 'Payment'}`, {align: 'center'})
      doc.end();
  });
}

module.exports = createReceiptPDF;
