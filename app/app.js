const express = require('express');
require('express-async-errors');

const eventRouter = require('./routes/event')
const errorHandler = require('./middlewares/errorHandler')

const app = express();

app.use(express.json())
app.get('/', (req, res) => {
    return res.json({message: "working!!!"});
})
app.use('/api', eventRouter);
app.use(errorHandler);

module.exports = app;