
import { createTicketSchema } from "../../../../packages/shared/ticket.schema.js";
import { Request, Response, NextFunction } from "express";
import { ticketService } from "../services/ticketService";

type AuthUser = {
  userId: number;
  role: "CUSTOMER" | "AGENT" | "ADMIN";
};


const getAuthUser = (res: Response): AuthUser =>
  res.locals.authUser as AuthUser;

export const ticketController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const validation = createTicketSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          data: null,
          error: {
            message: validation.error.issues.map((issue) => issue.message).join(", "),
          },
          meta: null,
        });
        return;
      }

      const ticket = await ticketService.createTicket(
        validation.data,
        user.userId
      );

      res.status(201).json({ data: ticket, error: null, meta: null });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const user = getAuthUser(res);
 const userId =
  user.role === "CUSTOMER" ? user.userId : undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const status = req.query.status as
      | "OPEN"
      | "IN_PROGRESS"
      | "CLOSED"
      | undefined;

    const priority = req.query.priority as
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | undefined;

    const assigneeId = req.query.assigneeId
      ? Number(req.query.assigneeId)
      : undefined;
      const search = req.query.search
  ? String(req.query.search)
  : undefined;

const sortBy = req.query.sortBy as
  | "createdAt"
  | "updatedAt"
  | "priority"
  | "status"
  | undefined;

const sortOrder = req.query.sortOrder as
  | "asc"
  | "desc"
  | undefined;

    if (
      page < 1 ||
      limit < 1 ||
      limit > 100 ||
        (sortBy !== undefined &&
    !["createdAt", "updatedAt", "priority", "status"].includes(sortBy)) ||
  (sortOrder !== undefined &&
    !["asc", "desc"].includes(sortOrder)) ||
      (assigneeId !== undefined &&
        (!Number.isInteger(assigneeId) || assigneeId < 1))
    ) {
      res.status(400).json({
        data: null,
        error: { message: "Invalid page, limit or assigneeId" },
        meta: null,
      });
      return;
    }
const tickets = await ticketService.getAllTickets(userId, {
  page,
  limit,
  status,
  priority,
  assigneeId,
  search,
  sortBy,
  sortOrder,
});
   

    res.status(200).json({
      data: tickets.tickets,
      error: null,
      meta: tickets.pagination,
    });
  } catch (error) {
    next(error);
  }
},


  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const userId = user.role === "CUSTOMER" ? user.userId : undefined;

      const ticket = await ticketService.getTicketById(
        Number(req.params.id),
        userId
      );

      if (!ticket) {
        res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
        return;
      }

      res.status(200).json({ data: ticket, error: null, meta: null });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const userId = user.role === "CUSTOMER" ? user.userId : undefined;

      const ticket = await ticketService.updateTicket(
        Number(req.params.id),
        req.body,
        userId
      );

      if (!ticket) {
        res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
        return;
      }

      res.status(200).json({ data: ticket, error: null, meta: null });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getAuthUser(res);
      const userId = user.role === "CUSTOMER" ? user.userId : undefined;

      const deleted = await ticketService.deleteTicket(
        Number(req.params.id),
        userId
      );

      if (!deleted) {
        res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
        return;
      }

      res.status(200).json({
        data: { message: "Ticket deleted successfully" },
        error: null,
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
