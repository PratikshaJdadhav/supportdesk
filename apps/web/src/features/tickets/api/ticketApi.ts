import { apiRequest } from "../../../lib/api";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category?: string | null;
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

export type TicketClassification = {
  category: "General" | "Account Access" | "Billing" | "Technical Issue";
  priority: "LOW" | "MEDIUM" | "HIGH";
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

  return apiRequest<Ticket[], TicketPagination>(
    `api/tickets?${params.toString()}`,
    { method: "GET", token },
  );
}

export async function createTicket(data: CreateTicketData, token: string) {
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

export async function classifyTicket(
  ticketId: number,
  token: string,
) {
  return apiRequest<TicketClassification>(
    `api/ai/tickets/${ticketId}/classify`,
    {
      method: "POST",
      token,
    },
  );
}

export async function streamSuggestedReply(
  ticketId: number,
  token: string,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/api/ai/tickets/${ticketId}/suggest-reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(
      result?.error?.message || `Request failed (${response.status})`,
    );
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });

    let separator = buffer.indexOf("\n\n");

    while (separator !== -1) {
      const frame = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);

      const data = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n");

      if (data === "[DONE]") {
        await reader.cancel();
        return;
      }

      if (data) {
        const event = JSON.parse(data) as {
          chunk?: string;
          error?: string;
        };

        if (event.error) {
          throw new Error(event.error);
        }

        if (event.chunk) {
          onChunk(event.chunk);
        }
      }

      separator = buffer.indexOf("\n\n");
    }

    if (done) break;
  }
}
