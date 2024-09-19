const { DateTime } = require("luxon");

function formatReceiptDate(date) {
  console.log(date);
  // console.log(DateTime.fromJSDate(date, {zone: 'utc'}));
  const dateUtc = DateTime.fromJSDate(date, { zone: "utc" });
  const dateLagos = dateUtc.setZone("Africa/Lagos");

  const formattedDate = dateLagos.toFormat("yyyy-MM-dd HH:mm:ss");
  console.log(formattedDate);
  return formattedDate;
}

module.exports = formatReceiptDate;
