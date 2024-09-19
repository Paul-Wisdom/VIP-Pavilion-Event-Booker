const mongoose = require("mongoose");

const dbConfig = require("../config/db.config");

const connectToDB = async () => {
  try {
    console.log("conecting to db uri ", dbConfig.mongodb_uri);
    await mongoose.connect(dbConfig.mongodb_uri);
    console.log("successfully connected to db");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDB;
