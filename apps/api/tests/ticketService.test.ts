import { ticketService } from "../src/services/ticketService";
import { ticketRepository } from "../src/repositories/ticketRepository";

jest.mock("../src/repositories/ticketRepository", () => ({
  ticketRepository: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const repo = ticketRepository as jest.Mocked<typeof ticketRepository>;

describe("Ticket Service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createTicket calls repository", async () => {
    repo.create.mockResolvedValue({ id: 1 } as any);
    await ticketService.createTicket(
      { title: "Test", description: "Description" },
      10
    );
    expect(repo.create).toHaveBeenCalledWith({
      title: "Test",
      description: "Description",
      userId: 10,
    });
  });

  test("getAllTickets calls repository", async () => {
    repo.findAll.mockResolvedValue({ tickets: [], pagination: {} } as any);
    await ticketService.getAllTickets(10, { page: 1, limit: 5 });
    expect(repo.findAll).toHaveBeenCalledWith(10, { page: 1, limit: 5 });
  });

  test("getTicketById calls repository", async () => {
    repo.findById.mockResolvedValue({ id: 1 } as any);
    await ticketService.getTicketById(1, 10);
    expect(repo.findById).toHaveBeenCalledWith(1, 10);
  });

  test("updateTicket calls repository with provided fields", async () => {
    repo.update.mockResolvedValue({ id: 1 } as any);
    await ticketService.updateTicket(1, { title: "Updated" }, 10);
    expect(repo.update).toHaveBeenCalledWith(1, { title: "Updated" }, 10);
  });

  test("deleteTicket calls repository", async () => {
    repo.delete.mockResolvedValue({ id: 1 } as any);
    await ticketService.deleteTicket(1, 10);
    expect(repo.delete).toHaveBeenCalledWith(1, 10);
  });
    test("getTicketById returns null when ticket does not exist", async () => {
    repo.findById.mockResolvedValue(null as any);

    const result = await ticketService.getTicketById(999, 10);

    expect(result).toBeNull();
    expect(repo.findById).toHaveBeenCalledWith(999, 10);
  });
});
