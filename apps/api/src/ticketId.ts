export function generateTicketId(number: number): string {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("Ticket number must be a positive integer.");
  }

  return `TICKET-${String(number).padStart(4, "0")}`;
}