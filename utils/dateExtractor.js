const date = "2024-05-07T22:09:24.000Z";

const dateExtractor = (date) => {
  const splitDate = date.split("T")[0].split("-");

  console.log(splitDate);
  const year = Number(splitDate[0]);
  const monthIndex = Number(splitDate[1]) - 1;
  const day = Number(splitDate[2]);

  return { year, monthIndex, day };
};

// console.log(dateExtractor(date));

module.exports = dateExtractor;
