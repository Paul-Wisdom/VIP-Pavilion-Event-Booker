const { DateTime } = require("luxon");

function formatEventDate(date) {
  const dateUtc = DateTime.fromJSDate(date, { zone: "utc" });
  const dateLagos = dateUtc.setZone("Africa/Lagos");

  const formattedDate = dateLagos.toLocaleString(DateTime.DATE_FULL);

  console.log(formattedDate);
  return formattedDate;
}

module.exports = formatEventDate;
