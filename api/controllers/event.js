const Event = require('../../models/event');
const Receipt = require('../../models/receipt');

const dataExtractor = require('../../utils/dataExtractor');
const dateExtractor = require('../../utils/dateExtractor');

const createEvent = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day); 

    const event = await Event.findOne({date: date});
    if(event)
    {
        return res.status(403).send({message: "Event booked for date already"});
    }
    const eventObject = new Event({date: date});
    const savedEvent = await eventObject.save();
    console.log(savedEvent);
    res.json(savedEvent);
}
//2024-05-11T23:00:00.000+00:00
const generateInvoice = async (req, res) => {
    const { year, monthIndex, day } = dateExtractor(req.body.date);
    const date = new Date (year, monthIndex, day); 
    const data = req.body.data;

    const event = await Event.findOne({date: date});
    if(!event)
    {
        return res.status(403).send({message: "No Event on this date"});
    }
    console.log(data);
    const {keys, values} = dataExtractor(data);
    const categories = [];
    for (i=0; i < keys.length; i++)
    {
        categoryObject = {category: keys[i], amount: values[i]}
        // console.log('whereeee',categoryObject);
        categories.push(categoryObject);
    }
    console.log(categories);
    const receiptObject = new Receipt({eventId: event._id, paid: false, categories: categories});
    const savedReceipt = await receiptObject.save();
    return res.json(savedReceipt);

}

module.exports = {
    generateInvoice,
    createEvent
}