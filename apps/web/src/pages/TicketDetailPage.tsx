import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../features/auth/context/AuthContext";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  getTicketById,
  getTicketComments,
  createTicketComment,
  updateTicketStatus,
} from "../features/tickets/api/ticketApi";

function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const id = Number(ticketId);

  const ticketQuery = useQuery({
    queryKey: ["ticket", id, token],
    queryFn: () => getTicketById(id, token!),
    enabled: Boolean(token) && Number.isInteger(id) && id > 0,
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", id, token],
    queryFn: () => getTicketComments(id, token!),
    enabled: Boolean(token) && Number.isInteger(id) && id > 0,
  });

  const commentMutation = useMutation({
    mutationFn: () => createTicketComment(id, message.trim(), token!),
    onSuccess: async () => {
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: "OPEN" | "IN_PROGRESS" | "CLOSED") =>
      updateTicketStatus(id, status, token!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  if (!Number.isInteger(id) || id < 1) {
    return <p className="p-6 text-red-600">Invalid ticket ID.</p>;
  }

  if (ticketQuery.isLoading) {
    return <p className="p-6">Loading ticket details...</p>;
  }

  if (ticketQuery.isError || !ticketQuery.data?.data) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {ticketQuery.error instanceof Error
            ? ticketQuery.error.message
            : "Ticket not found."}
        </p>
          <Button onClick={() => navigate("/")} variant="secondary" className="mt-4">
            Back to Dashboard
          </Button>
      </div>
    );
  }

  const ticket = ticketQuery.data.data;
  const canUpdateStatus = user?.role === "AGENT" || user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
        <Button onClick={() => navigate("/")} variant="secondary" className="text-sm">
          ← Back to Dashboard
        </Button>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Ticket #{ticket.id}</p>
            <h2 className="mt-2 text-2xl font-bold">{ticket.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge type="priority" value={ticket.priority} />
            <Badge type="status" value={ticket.status} />
          </div>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-slate-700">
          {ticket.description}
        </p>

        <p className="mt-5 text-xs text-slate-400">
          Created: {new Date(ticket.createdAt).toLocaleString()}
        </p>

        {canUpdateStatus && (
          <div className="mt-5">
              <label htmlFor="ticket-status" className="mb-2 block text-sm font-medium">Update Status</label>
            <select
                id="ticket-status"
              value={ticket.status}
              disabled={statusMutation.isPending}
              onChange={(event) =>
                statusMutation.mutate(
                  event.target.value as "OPEN" | "IN_PROGRESS" | "CLOSED",
                )
              }
              className="rounded-lg border px-3 py-2"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
            {statusMutation.isError && (
              <p className="mt-2 text-sm text-red-600">Status update failed.</p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold">Comments</h3>

        {commentsQuery.isLoading && (
          <p className="mt-4 text-slate-500">Loading comments...</p>
        )}

        {commentsQuery.isError && (
          <p className="mt-4 text-red-600">Failed to load comments.</p>
        )}

        {commentsQuery.isSuccess && commentsQuery.data.data.length === 0 && (
          <p className="mt-4 text-slate-500">No comments yet.</p>
        )}

        <div className="mt-4 space-y-4">
          {commentsQuery.data?.data.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-slate-50 p-4">
              <p className="font-semibold">{comment.user.name}</p>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">
                {comment.message}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

          {user?.role === "ADMIN" && (
            <form
              className="mt-6 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (message.trim()) commentMutation.mutate();
              }}
            >
              <label htmlFor="ticket-comment" className="block text-sm font-medium">Add Comment</label>
              <textarea
                id="ticket-comment"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                placeholder="Write your comment..."
                className="w-full rounded-xl border p-3"
              />
          {commentMutation.isError && (
            <p className="text-sm text-red-600">Failed to add comment.</p>
          )}
          <Button
            type="submit"
            disabled={!message.trim()}
            loading={commentMutation.isPending}
            className="rounded-xl px-5 py-3"
          >
            Send Comment
          </Button>
        </form>
        )}
      </section>
    </div>
  );
}

export default TicketDetailPage;
