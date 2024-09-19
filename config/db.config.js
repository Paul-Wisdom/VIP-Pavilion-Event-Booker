require("dotenv").config();

let mongodb_uri;
if (process.env.ENV === "development") {
  mongodb_uri = process.env.DEV_MONGODB_URI;
} else {
  mongodb_uri = process.env.PRODS_MONGODB_URI;
}

module.exports = {
  mongodb_uri,
};
