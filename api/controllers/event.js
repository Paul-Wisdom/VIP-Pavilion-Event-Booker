const Event = require("../../models/event");
const Receipt = require("../../models/receipt");
require("dotenv").config();

// const { Queue } = require('bullmq');

// const createRedisConnection = require('../../utils/createRedisConnection')
const formatEventDate = require("../../utils/formatEventDate");
const formatReceiptDate = require("../../utils/formatReceiptDate");
const dateExtractor = require("../../utils/dateExtractor");
const createReceiptPDF = require("../../utils/createReceipt");
const { sendInvoice, sendReceipt } = require("../../utils/sendEmails");
// const createRedisConnection = require('../../utils/createRedisConnection');

const createEvent = async (req, res) => {
  if (!req.body.date) {
    return res.status(400).send({ message: "Date not provided" });
  }

  const { year, monthIndex, day } = dateExtractor(req.body.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);
  const email = req.body.email;

  if (!email) {
    return res.status(400).send({ message: "Email not provided" });
  }
  const event = await Event.findOne({ date: date });
  if (event) {
    return res.status(403).send({ message: "Event booked for date already" });
  }
  const eventObject = new Event({ date: date, email: email });
  console.log(eventObject);
  const savedEvent = await eventObject.save();
  console.log(savedEvent);
  res.json(savedEvent);
};

const deleteEvent = async (req, res) => {
  if (!req.body.date) {
    return res.status(400).send({ message: "Date not provided" });
  }
  const { year, monthIndex, day } = dateExtractor(req.body.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);

  const eventResponse = await Event.findOneAndDelete({ date: date });
  if (eventResponse) {
    const receiptResponse = await Receipt.findOneAndDelete({
      eventId: eventResponse._id,
    });
    // console.log(receiptResponse);
  }
  // console.log(eventResponse);
  return res.status(204).end();
};
//2024-05-11T23:00:00.000+00:00
const generateInvoice = async (req, res) => {
  if (!req.body.date) {
    return res.status(400).send({ message: "Date not provided" });
  }
  const { year, monthIndex, day } = dateExtractor(req.body.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);
  const amountStr = req.body.amountStr;
  const amountNum = req.body.amountNum;

  if (!amountStr) {
    return res.status(400).send({ message: "Amount in words not provided" });
  }
  if (!amountNum) {
    return res.status(400).send({ message: "Amount in figures not provided" });
  }
  const event = await Event.findOne({ date: date });
  if (!event) {
    return res.status(404).send({ message: "No Event on this date" });
  }
  const receipt = await Receipt.findOne({ eventId: event._id });
  if (receipt) {
    return res
      .status(403)
      .send({ message: "invoice/receipt already generated for this event" });
  }
  console.log(date);
  const receiptObject = new Receipt({
    eventId: event._id,
    paid: false,
    amountStr: amountStr,
    amountNum: amountNum,
    email: event.email,
  });
  const savedReceipt = await receiptObject.save();
  const receiptData = {
    type: 0,
    outputPath: "invoice.pdf",
    customerEmail: savedReceipt.email,
    amountStr: savedReceipt.amountStr,
    amountNum: savedReceipt.amountNum,
    receiptGenerationDate: formatReceiptDate(savedReceipt.date),
    eventDate: formatEventDate(event.date),
    receiptNumber: savedReceipt._id,
  };
  const filePath = await createReceiptPDF(receiptData);
  await sendInvoice(filePath, savedReceipt.email, formatEventDate(event.date));
  return res.json(savedReceipt);
};

const regenerateInvoice = async (req, res) => {
  if (!req.body.date) {
    return res.status(400).send({ message: "Date not provided" });
  }
  const { year, monthIndex, day } = dateExtractor(req.body.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);
  const amountStr = req.body.amountStr;
  const amountNum = req.body.amountNum;
  const data = req.body.data;
  if (!amountStr) {
    return res.status(400).send({ message: "Amount in words not provided" });
  }
  if (!amountNum) {
    return res.status(400).send({ message: "Amount in figures not provided" });
  }
  const event = await Event.findOne({ date: date });
  if (!event) {
    return res.status(404).send({ message: "No Event on this date" });
  }
  const deletedReceipt = await Receipt.findOneAndDelete({ eventId: event._id });
  console.log(date);

  const receiptObject = new Receipt({
    eventId: event._id,
    paid: false,
    amountStr: amountStr,
    amountNum: amountNum,
    email: event.email,
  });
  const savedReceipt = await receiptObject.save();
  console.log("saved receipt",  savedReceipt);
  const receiptData = {
    type: 0,
    outputPath: "invoice.pdf",
    customerEmail: savedReceipt.email,
    amountStr: savedReceipt.amountStr,
    amountNum: savedReceipt.amountNum,
    receiptGenerationDate: formatReceiptDate(savedReceipt.date),
    eventDate: formatEventDate(event.date),
    receiptNumber: savedReceipt._id,
  };

  const filePath = await createReceiptPDF(receiptData);
  await sendInvoice(filePath, savedReceipt.email, formatEventDate(event.date));
  return res.json(receiptData);
};

const generateReceipt = async (req, res) => {
  if (!req.body.date) {
    return res.status(400).send({ message: "Date not provided" });
  }
  const { year, monthIndex, day } = dateExtractor(req.body.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);

  const event = await Event.findOne({ date: date });
  if (!event) {
    return res.status(404).send({ message: "No Event on this date" });
  }
  const receipt = await Receipt.findOneAndUpdate(
    { eventId: event._id },
    { paid: true },
    { new: true, runValidators: true, context: "query" },
  );
  if (!receipt) {
    return res.status(404).send({ message: "No Invoice generated" });
  }
  const receiptData = {
    type: 1,
    outputPath: "receipt.pdf",
    customerEmail: receipt.email,
    amountStr: receipt.amountStr,
    amountNum: receipt.amountNum,
    receiptGenerationDate: formatReceiptDate(receipt.date),
    eventDate: formatEventDate(event.date),
    receiptNumber: receipt._id,
  };
  const filePath = await createReceiptPDF(receiptData);
  await sendReceipt(filePath, receipt.email, formatEventDate(event.date));
  // const receipt = await invoice.updateOne({paid: true}, {new: true, runValidators: true, context: 'query'})
  return res.json(receiptData);
};

const checkForInvoiceGeneration = async (req, res, next) => {
  const { year, monthIndex, day } = dateExtractor(req.params.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);

  const event = await Event.findOne({ date: date });
  if (!event) {
    return res.status(404).send({ message: "No Event on this date" });
  }
  const invoice = await Receipt.findOne({ eventId: event._id });
  if (!invoice) {
    return res.status(404).send({ message: "No Invoice generated" });
  }
  return res.status(200).json({ message: "Invoice generated for this date" });
};

const checkForReceiptGeneration = async (req, res, next) => {
  const { year, monthIndex, day } = dateExtractor(req.params.date);
  const date = new Date(year, monthIndex, day, 10, 0, 0, 0);

  const event = await Event.findOne({ date: date });
  if (!event) {
    return res.status(404).send({ message: "No Event on this date" });
  }
  const receipt = await Receipt.findOne({ eventId: event._id, paid: true });
  if (!receipt) {
    return res.status(404).send({ message: "No Receipt generated" });
  }
  return res.status(200).json({ message: "Receipt generated for this date" });
};
module.exports = {
  generateInvoice,
  regenerateInvoice,
  createEvent,
  deleteEvent,
  generateReceipt,
  checkForInvoiceGeneration,
  checkForReceiptGeneration,
};
