const supertest = require("supertest");
const app = require("../../api/app");

const Event = require("../../models/event");
const Receipt = require("../../models/receipt");

const createReceiptPDF = require("../../utils/createReceipt");
const { sendInvoice, sendReceipt } = require("../../utils/sendEmails");

const helper = require("./event.helper");

jest.mock("../../utils/createReceipt", () => {
  const createReceiptPDF = jest.fn();

  return createReceiptPDF;
});

jest.mock("../../utils/sendEmails", () => {
  const sendInvoice = jest.fn();
  const sendReceipt = jest.fn();

  return { sendInvoice, sendReceipt };
});

jest.mock("../../models/event", () => {
  const Event = jest.fn();
  Event.findOne = jest.fn();
  Event.findOneAndDelete = jest.fn();

  return Event;
});
jest.mock("../../models/receipt", () => {
  const Receipt = jest.fn();
  Receipt.findOne = jest.fn();
  Receipt.findOneAndDelete = jest.fn();
  Receipt.findOneAndUpdate = jest.fn();

  return Receipt;
});

describe("Creating Events", () => {
  test("when date is not provided should return 400", async () => {
    const input = { email: "test@gmail.com" };

    const response = await supertest(app).post("/api/create-event").send(input);
    expect(response.status).toBe(400);
  });
  test("when email is not provided should return 400", async () => {
    const input = { date: "2024-09-19" };

    const response = await supertest(app).post("/api/create-event").send(input);
    expect(response.status).toBe(400);
  });
  test("when another exists at the same date should return 403", async () => {
    const input = { date: "2024-09-19", email: "test@gmail.com" };

    Event.findOne.mockImplementation(() => helper.event);

    const response = await supertest(app).post("/api/create-event").send(input);
    expect(response.status).toBe(403);
  });
  test("when no event at the same date should return 200", async () => {
    const input = { date: "2024-09-19", email: "test@gmail.com" };
    const mockEvent = { save: jest.fn().mockResolvedValue(helper.event) };

    Event.findOne.mockResolvedValue(null);
    Event.mockImplementation(() => mockEvent);
    const eventObject = Event(input);
    // console.log(eventObject)

    const response = await supertest(app).post("/api/create-event").send(input);
    expect(response.status).toBe(200);
  });
});

describe("Deleting Events", () => {
  test("when date is not provided should return 400", async () => {
    const input = { email: "test@gmail.com" };

    const response = await supertest(app)
      .delete("/api/delete-event")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("if the event does not exist return 204", async () => {
    const input = { date: "2024-09-19" };

    Event.findOneAndDelete.mockResolvedValue(null);

    const response = await supertest(app)
      .delete("/api/delete-event")
      .send(input);
    expect(response.status).toBe(204);
  });
  test("if the event exists but no invoice/receipts should return 204", async () => {
    const input = { date: "2024-09-19" };

    Event.findOneAndDelete.mockResolvedValue(helper.event);
    Receipt.findOneAndDelete.mockResolvedValue(null);

    const response = await supertest(app)
      .delete("/api/delete-event")
      .send(input);
    expect(response.status).toBe(204);
  });
  test("if the event exists with invoice should return 204", async () => {
    const input = { date: "2024-09-19" };

    Event.findOneAndDelete.mockResolvedValue(helper.event);
    Receipt.findOneAndDelete.mockResolvedValue(helper.invoice);

    const response = await supertest(app)
      .delete("/api/delete-event")
      .send(input);
    expect(response.status).toBe(204);
  });
  test("if the event exists with receipt should return 204", async () => {
    const input = { date: "2024-09-19" };

    Event.findOneAndDelete.mockResolvedValue(helper.event);
    Receipt.findOneAndDelete.mockResolvedValue(helper.receipt);

    const response = await supertest(app)
      .delete("/api/delete-event")
      .send(input);
    expect(response.status).toBe(204);
  });
});

describe("Generating invoices", () => {
  test("when date is not provided should return 400", async () => {
    const input = { amountNum: "500", amountStr: "Five Hundred" };

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when amountStr is not provided should return 400", async () => {
    const input = { date: "2024-09-19", amountNum: "500" };

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when amountNum is not provided should return 400", async () => {
    const input = { date: "2024-09-19", amountStr: "Five Hundred" };

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when no event exists on that date should return 404", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };

    Event.findOne.mockResolvedValue(null);
    // Receipt.findOneAndDelete.mockResolvedValue(helper.receipt);

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(404);
  });
  test("when an invoice already exists on that date should return 403", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(helper.invoice);

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(403);
  });
  test("when no invoice exists on the date should return 200", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };
    const mockReceipt = { save: jest.fn().mockResolvedValue(helper.invoice) };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(null);
    Receipt.mockImplementation(() => mockReceipt);

    createReceiptPDF.mockResolvedValue("invoice.pdf");
    sendInvoice.mockResolvedValue("email");

    const response = await supertest(app)
      .post("/api/generate-invoice")
      .send(input);
    expect(response.status).toBe(200);
  });
});

describe("Regenerating Invoices", () => {
  test("when date is not provided should return 400", async () => {
    const input = { amountNum: "500", amountStr: "Five Hundred" };

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when amountStr is not provided should return 400", async () => {
    const input = { date: "2024-09-19", amountNum: "500" };

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when amountNum is not provided should return 400", async () => {
    const input = { date: "2024-09-19", amountStr: "Five Hundred" };

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when no event exists on that date should return 404", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };

    Event.findOne.mockResolvedValue(null);
    // Receipt.findOneAndDelete.mockResolvedValue(helper.receipt);

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(404);
  });
  test("when an invoice already exists on that date should return 200", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };
    const mockInvoice = { save: jest.fn().mockResolvedValue(helper.invoice) };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOneAndDelete.mockResolvedValue(helper.invoice);
    Receipt.mockImplementation(() => mockInvoice)

    createReceiptPDF.mockResolvedValue("invoice.pdf");
    sendInvoice.mockResolvedValue("email");

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(200);
  });
  test("when no invoice exists on the date should return 200", async () => {
    const input = {
      date: "2024-09-19",
      amountNum: "500",
      amountStr: "Five Hundred",
    };
    const mockReceipt = { save: jest.fn().mockResolvedValue(helper.invoice) };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(null);
    Receipt.mockImplementation(() => mockReceipt);

    createReceiptPDF.mockResolvedValue("invoice.pdf");
    sendInvoice.mockResolvedValue("email");

    const response = await supertest(app)
      .post("/api/regenerate-invoice")
      .send(input);
    expect(response.status).toBe(200);
  });
})

describe("Generating Receipts", () => {
  test("when date is not provided should return 400", async () => {
    const input = {};

    const response = await supertest(app)
      .post("/api/generate-receipt")
      .send(input);
    expect(response.status).toBe(400);
  });
  test("when no event exists on that date should return 404", async () => {
    const input = {
      date: "2024-09-19"
    };

    Event.findOne.mockResolvedValue(null);

    const response = await supertest(app)
      .post("/api/generate-receipt")
      .send(input);
    expect(response.status).toBe(404);
  });
  test("when no invoice exists on the date should return 404", async () => {
    const input = {
      date: "2024-09-19"
    };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOneAndUpdate.mockResolvedValue(null);

    createReceiptPDF.mockResolvedValue("invoice.pdf");
    sendReceipt.mockResolvedValue("email");

    const response = await supertest(app)
      .post("/api/generate-receipt")
      .send(input);
    expect(response.status).toBe(404);
  });
  test("when an invoice exists on that date should return 200", async () => {
    const input = {
      date: "2024-09-19"
    };

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOneAndUpdate.mockResolvedValue(helper.receipt);

    const response = await supertest(app)
      .post("/api/generate-receipt")
      .send(input);
    expect(response.status).toBe(200);
  });
})

describe("Checking for invoice generation", () => {
  test("when date is not provided should return 404", async () => {
    const response = await supertest(app)
      .get("/api/invoice")
    expect(response.status).toBe(404);
  });
  test("when no event exists on that date should return 404", async () => {
    const date = '2024-9-25'
    
    Event.findOne.mockResolvedValue(null);

    const response = await supertest(app)
      .get(`/api/invoice/${date}`)
    expect(response.status).toBe(404);
  });
  test("when no invoice exists on the date should return 404", async () => {
    const date = '2024-9-25'

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(null);

    const response = await supertest(app)
      .get(`/api/invoice/${date}`)
    expect(response.status).toBe(404);
  });
  test("when an invoice exists on that date should return 200", async () => {
    const date = '2024-9-25'
    
    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(helper.invoice);

    const response = await supertest(app)
      .get(`/api/invoice/${date}`)
    expect(response.status).toBe(200);
  });
})

describe("Checking for Receipt generation", () => {
  test("when date is not provided should return 404", async () => {
    const response = await supertest(app)
      .get("/api/receipt")
    expect(response.status).toBe(404);
  });
  test("when no event exists on that date should return 404", async () => {
    const date = '2024-9-25'
    
    Event.findOne.mockResolvedValue(null);

    const response = await supertest(app)
      .get(`/api/receipt/${date}`)
    expect(response.status).toBe(404);
  });
  test("when no receipt exists on the date should return 404", async () => {
    const date = '2024-9-25'

    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(null);

    const response = await supertest(app)
      .get(`/api/receipt/${date}`)
    expect(response.status).toBe(404);
  });
  test("when a receipt exists on that date should return 200", async () => {
    const date = '2024-9-25'
    
    Event.findOne.mockResolvedValue(helper.event);
    Receipt.findOne.mockResolvedValue(helper.invoice);

    const response = await supertest(app)
      .get(`/api/receipt/${date}`)
    expect(response.status).toBe(200);
  });
})