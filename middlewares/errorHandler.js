const errorHandler = (error, req, res, next) => {
  console.log("Errors: ", error);
  if (error.name == "ValidationError") {
    return res.status(422).send({ error: error.message });
  }
  else if(error.name == "CastError") {
    return res.status(400).send({ error: "Invalid id" });
  }

  next(error);
};

module.exports = errorHandler;
