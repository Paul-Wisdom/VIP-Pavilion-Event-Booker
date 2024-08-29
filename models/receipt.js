const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    categories: [
        {
            category: {
                type: String,
                required: true
            },
            amount: {
                type: String,
                required: true
            }
        }],
    paid: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    }
})

const Review = mongoose.model('receipt', receiptSchema);

module.exports = Review;