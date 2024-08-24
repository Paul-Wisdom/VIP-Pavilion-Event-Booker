const eventRouter = require('express').Router();
const eventController = require('../controllers/event');

eventRouter.post('/create-event', eventController.createEvent);
eventRouter.post('/generate-invoice', eventController.generateInvoice);

module.exports = eventRouter;