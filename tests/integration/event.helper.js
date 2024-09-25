const event = {
  _id: "66cdd83cf48f479584c854b6",
  date: "2024-06-11T23:00:00.000Z",
  email: "test@gmail.com",
};

const receipt = {
  _id: "66ec24574355bc11da188741",
  eventId: "66ec22eec7e868d6a8b98484",
  date: "2024-09-19T13:16:44.981Z",
  amountNum: "14000",
  amountStr: "foureen thousand",
  paid: true,
  email: "test@gmail.com",
};

const invoice = {
  _id: "66ec24574355bc11da188741",
  eventId: "66ec22eec7e868d6a8b98484",
  date: "2024-09-19T13:16:44.981Z",
  amountNum: "14000",
  amountStr: "foureen thousand",
  paid: false,
  email: "test@gmail.com",
};

module.exports = {
  event,
  receipt,
  invoice,
};
