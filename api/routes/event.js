const eventRouter = require('express').Router();
const eventController = require('../controllers/event');

eventRouter.post('/create-event', eventController.createEvent);
eventRouter.delete('/delete-event', eventController.deleteEvent);
eventRouter.post('/generate-invoice', eventController.generateInvoice);
eventRouter.post('/regenerate-invoice', eventController.regenerateInvoice);
eventRouter.post('/generate-receipt', eventController.generateReceipt);
eventRouter.get('/invoice/:date', eventController.checkForInvoiceGeneration);
eventRouter.get('/receipt/:date', eventController.checkForReceiptGeneration)

module.exports = eventRouter;