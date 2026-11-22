import { apiRequest } from "../../../lib/api";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  userId: number;
  assigneeId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketData = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export type TicketFilters = {
  page?: number;
  limit?: number;
  status?: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  search?: string;
  assigneeId?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
  sortOrder?: "asc" | "desc";
};

export type TicketPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getAllTickets(
  token: string,
  filters: TicketFilters = {},
) {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));

  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.assigneeId !== undefined) {
    params.set("assigneeId", String(filters.assigneeId));
  }
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  return apiRequest<Ticket[], TicketPagination>(`api/tickets?${params.toString()}`, {
    method: "GET",
    token,
  });
}

export async function createTicket(
  data: CreateTicketData,
  token: string,
) {
  return apiRequest<Ticket>("api/tickets", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}
export async function updateTicketStatus(
  ticketId: number,
  status: "OPEN" | "IN_PROGRESS" | "CLOSED",
  token: string,
) {
  return apiRequest<Ticket>(`api/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    token,
  });
}

export type TicketComment = {
  id: number;
  message: string;
  ticketId: number;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export async function getTicketById(ticketId: number, token: string) {
  return apiRequest<Ticket>(`api/tickets/${ticketId}`, {
    method: "GET",
    token,
  });
}

export async function getTicketComments(ticketId: number, token: string) {
  return apiRequest<TicketComment[]>(`api/tickets/${ticketId}/comments`, {
    method: "GET",
    token,
  });
}

export async function createTicketComment(
  ticketId: number,
  message: string,
  token: string,
) {
  return apiRequest<TicketComment>(`api/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({ message }),
    token,
  });
}
