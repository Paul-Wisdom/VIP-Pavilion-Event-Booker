const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  amountNum: {
    type: String,
    required: true,
  },
  amountStr: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("receipt", receiptSchema);

module.exports = Review;
