const formatEventDate = require('../../utils/formatEventDate');
const formatReceiptDate = require('../../utils/formatReceiptDate');
const dateExtractor = require('../../utils/dateExtractor');


test("Extracting date from yy-mm-dd format works as expected", () => {
    const date = "2024-9-25";

    const result = dateExtractor(date);
    console.log(result);
    expect(result).toEqual({year: 2024, monthIndex: 8, day: 25})
})
test("Formatting Event Date works as required", () => {
    const date = new Date(2024, 8, 25);

    const result = formatEventDate(date);
    expect(result).toBe("September 25, 2024")
});
test("Formatting Receipt Date works as required", () => {
    const date = new Date(2024, 8, 25);

    const result = formatReceiptDate(date);
    expect(result).toBe("2024-09-25 00:00:00")
})