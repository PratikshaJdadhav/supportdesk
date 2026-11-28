

import { ticketRepository } from "../repositories/ticketRepository";

export const ticketService = {
  createTicket(
    data: {
      title: string;
      description: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
    },
    userId: number
  ) {
    return ticketRepository.create({
      title: data.title,
      description: data.description,
      ...(data.priority ? { priority: data.priority } : {}),
      userId,
    });
  },
getAllTickets(
  userId?: number,
  filters?: {
    page?: number;
    limit?: number;
    status?: "OPEN" | "IN_PROGRESS" | "CLOSED";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    assigneeId?: number;
    search?: string;
    sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
    sortOrder?: "asc" | "desc";
  }
) {
  return ticketRepository.findAll(userId, filters);
},
  getTicketById(id: number, userId?: number) {
    return ticketRepository.findById(id, userId);
  },
  updateTicket(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: "OPEN" | "IN_PROGRESS" | "CLOSED";
      priority?: "LOW" | "MEDIUM" | "HIGH";
    },
    userId?: number
  ) {
    const safeData: typeof data = {};

    if (data.title !== undefined) safeData.title = data.title;
    if (data.description !== undefined) safeData.description = data.description;
    if (data.status !== undefined) safeData.status = data.status;
    if (data.priority !== undefined) safeData.priority = data.priority;

    return ticketRepository.update(id, safeData, userId);
  },

  deleteTicket(id: number, userId?: number) {
    return ticketRepository.delete(id, userId);
  },
};
