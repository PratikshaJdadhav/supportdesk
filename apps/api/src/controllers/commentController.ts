import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/commentService";
import { ticketService } from "../services/ticketService";

type AuthUser = {
  userId: number;
  role: "CUSTOMER" | "AGENT" | "ADMIN";
};

const getAuthUser = (res: Response): AuthUser =>
  res.locals.authUser as AuthUser;

export const commentController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const ticketId = Number(req.params.ticketId);
      const { message } = req.body;

      if (!Number.isInteger(ticketId) || ticketId < 1 || typeof message !== "string" || !message.trim()) {
        res.status(400).json({
          data: null,
          error: { message: "Valid ticketId and message are required" },
          meta: null,
        });
        return;
      }

      const userId = user.role === "AGENT" || user.role === "ADMIN" ? undefined : user.userId;
      const ticket = await ticketService.getTicketById(ticketId, userId);

      if (!ticket) {
        res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
        return;
      }

      const comment = await commentService.createComment(
        message.trim(),
        ticketId,
        user.userId
      );

      res.status(201).json({ data: comment, error: null, meta: null });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const ticketId = Number(req.params.ticketId);

      if (!Number.isInteger(ticketId) || ticketId < 1) {
        res.status(400).json({
          data: null,
          error: { message: "Invalid ticketId" },
          meta: null,
        });
        return;
      }

      const userId = user.role === "AGENT" || user.role === "ADMIN" ? undefined : user.userId;
      const ticket = await ticketService.getTicketById(ticketId, userId);

      if (!ticket) {
        res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
        return;
      }

      const comments = await commentService.getCommentsByTicketId(ticketId);

      res.status(200).json({ data: comments, error: null, meta: null });
    } catch (error) {
      next(error);
    }
  },
};