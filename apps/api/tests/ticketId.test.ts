
import { generateTicketId } from "../src/ticketId";

describe("generateTicketId", () => {
  test("generates an ID for number 1", () => {
    expect(generateTicketId(1)).toBe("TICKET-0001");
  });

  test("pads a two-digit number", () => {
    expect(generateTicketId(12)).toBe("TICKET-0012");
  });

  test("supports a four-digit number", () => {
    expect(generateTicketId(1234)).toBe("TICKET-1234");
  });

  test("throws an error for zero", () => {
    expect(() => generateTicketId(0)).toThrow(
      "Ticket number must be a positive integer."
    );
  });

  test("throws an error for a negative number", () => {
    expect(() => generateTicketId(-1)).toThrow(
      "Ticket number must be a positive integer."
    );
  });

  test("throws an error for a decimal number", () => {
    expect(() => generateTicketId(1.5)).toThrow(
      "Ticket number must be a positive integer."
    );
  });
});
