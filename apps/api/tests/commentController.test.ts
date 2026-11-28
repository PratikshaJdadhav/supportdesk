import { Request, Response, NextFunction } from "express";
import { commentController } from "../src/controllers/commentController";
import { commentService } from "../src/services/commentService";
import { ticketService } from "../src/services/ticketService";

jest.mock("../src/services/commentService", () => ({
  commentService: {
    createComment: jest.fn(),
    getCommentsByTicketId: jest.fn(),
  },
}));

jest.mock("../src/services/ticketService", () => ({
  ticketService: {
    getTicketById: jest.fn(),
  },
}));

describe("Comment Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { ticketId: "1" },
      body: { message: "Test comment" },
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

  describe("create", () => {
    test("should create comment successfully", async () => {
      (ticketService.getTicketById as jest.Mock).mockResolvedValue({ id: 1 });
      (commentService.createComment as jest.Mock).mockResolvedValue({
        id: 1,
        message: "Test comment",
      });

      await commentController.create(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(commentService.createComment).toHaveBeenCalledWith(
        "Test comment",
        1,
        1
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("should return 400 for invalid message", async () => {
      req.body = { message: "   " };

      await commentController.create(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(commentService.createComment).not.toHaveBeenCalled();
    });

    test("should return 404 when ticket is not found", async () => {
      (ticketService.getTicketById as jest.Mock).mockResolvedValue(null);

      await commentController.create(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(commentService.createComment).not.toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    test("should return all comments successfully", async () => {
      (ticketService.getTicketById as jest.Mock).mockResolvedValue({ id: 1 });
      (commentService.getCommentsByTicketId as jest.Mock).mockResolvedValue([
        { id: 1, message: "Test comment" },
      ]);

      await commentController.getAll(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(commentService.getCommentsByTicketId).toHaveBeenCalledWith(1);
    });

    test("should return 400 for invalid ticket ID", async () => {
      req.params = { ticketId: "abc" };

      await commentController.getAll(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should return 404 when ticket is not found", async () => {
      (ticketService.getTicketById as jest.Mock).mockResolvedValue(null);

      await commentController.getAll(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});