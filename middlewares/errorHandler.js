const errorHandler = (error, req, res, next) => {
    console.log("mmmm", error);
    if(error.name == 'ValidationError')
    {
       return res.status(422).send({error: error.message})
    }

    next(error)
}

module.exports = errorHandler;
