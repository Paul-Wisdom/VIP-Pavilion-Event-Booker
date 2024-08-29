const Event = require('../../models/event');
const Receipt = require('../../models/receipt');

const dataExtractor = require('../../utils/dataExtractor');
const dateExtractor = require('../../utils/dateExtractor');

const createEvent = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day);
    const email = req.body.email;

    const event = await Event.findOne({date: date});
    if(event)
    {
        return res.status(403).send({message: "Event booked for date already"});
    }
    const eventObject = new Event({date: date, email: email});
    const savedEvent = await eventObject.save();
    console.log(savedEvent);
    res.json(savedEvent);
}

const deleteEvent = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day);

    const eventResponse = await Event.findOneAndDelete({date: date});
    if(eventResponse)
    {
        const receiptResponse = await Receipt.findOneAndDelete({eventId: event._id});
        console.log(receiptResponse);
    }
    console.log(response);
    return res.status(204).end();
}
//2024-05-11T23:00:00.000+00:00
const generateInvoice = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day); 
    const data = req.body.data;

    const event = await Event.findOne({date: date});
    if(!event)
    {
        return res.status(404).send({message: "No Event on this date"});
    }
    const receipt = await Receipt.findOne({eventId: event._id});
    if(receipt)
    {
        return res.status(403).send({message: "invoice/receipt already generated for this event"});
    }
    console.log(date);
    const {keys, values} = dataExtractor(data);
    const categories = [];
    for (i=0; i < keys.length; i++)
    {
        categoryObject = {category: keys[i], amount: values[i]}
        // console.log('whereeee',categoryObject);
        categories.push(categoryObject);
    }
    console.log(categories);
    const receiptObject = new Receipt({eventId: event._id, paid: false, categories: categories, email: event.email});
    const savedReceipt = await receiptObject.save();
    return res.json(savedReceipt);

}

const regenerateInvoice = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day); 
    const data = req.body.data;

    const event = await Event.findOne({date: date});
    if(!event)
    {
        return res.status(404).send({message: "No Event on this date"});
    }
    const deletedReceipt = await Receipt.findOneAndDelete({eventId: event._id});
    console.log(date);
    const {keys, values} = dataExtractor(data);
    const categories = [];
    for (i=0; i < keys.length; i++)
    {
        categoryObject = {category: keys[i], amount: values[i]}
        // console.log('whereeee',categoryObject);
        categories.push(categoryObject);
    }
    console.log(categories);
    const receiptObject = new Receipt({eventId: event._id, paid: false, categories: categories, email: event.email});
    const savedReceipt = await receiptObject.save();
    return res.json(savedReceipt);
}

const generateReceipt = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day);

    const event = await Event.findOne({date: date});
    if(!event)
    {
        return res.status(404).send({message: "No Event on this date"});
    }
    const receipt = await Receipt.findOneAndUpdate({eventId: event._id}, {paid: true}, {new: true, runValidators: true, context: 'query'});
    if(!receipt)
    {
        return res.status(404).send({message: "No Invoice generated"});
    }
    // const receipt = await invoice.updateOne({paid: true}, {new: true, runValidators: true, context: 'query'})
    return res.json(receipt);
}

module.exports = {
    generateInvoice,
    regenerateInvoice,
    createEvent,
    deleteEvent,
    generateReceipt
}