
import { Request, Response, NextFunction } from "express";
import { ticketController } from "../src/controllers/ticketController";
import { ticketService } from "../src/services/ticketService";

jest.mock("../src/services/ticketService", () => ({
  ticketService: {
    createTicket: jest.fn(),
    getAllTickets: jest.fn(),
    getTicketById: jest.fn(),
    updateTicket: jest.fn(),
    deleteTicket: jest.fn(),
  },
}));

describe("Ticket Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        title: "Test ticket",
        description: "Test description",
        priority: "MEDIUM",
      },
      params: { id: "1" },
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        authUser: { userId: 1, role: "CUSTOMER" },
      },
    };

    next = jest.fn();
  });

  test("should create ticket successfully", async () => {
    (ticketService.createTicket as jest.Mock).mockResolvedValue({ id: 1 });

    await ticketController.create(req as Request, res as Response, next);

    expect(ticketService.createTicket).toHaveBeenCalledWith(req.body, 1);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should get all tickets successfully", async () => {
    (ticketService.getAllTickets as jest.Mock).mockResolvedValue({
      tickets: [{ id: 1 }],
      pagination: { page: 1, limit: 10 },
    });

    await ticketController.getAll(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for invalid pagination", async () => {
    req.query = { limit: "101" };

    await ticketController.getAll(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(ticketService.getAllTickets).not.toHaveBeenCalled();
  });

  test("should get ticket by ID", async () => {
    (ticketService.getTicketById as jest.Mock).mockResolvedValue({ id: 1 });

    await ticketController.getById(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(ticketService.getTicketById).toHaveBeenCalledWith(1, 1);
  });

  test("should return 404 when ticket is not found", async () => {
    (ticketService.getTicketById as jest.Mock).mockResolvedValue(null);

    await ticketController.getById(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should update ticket successfully", async () => {
    (ticketService.updateTicket as jest.Mock).mockResolvedValue({ id: 1 });

    await ticketController.update(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should delete ticket successfully", async () => {
    (ticketService.deleteTicket as jest.Mock).mockResolvedValue(true);

    await ticketController.delete(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 404 when deleting missing ticket", async () => {
    (ticketService.deleteTicket as jest.Mock).mockResolvedValue(false);

    await ticketController.delete(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
