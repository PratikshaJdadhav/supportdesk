
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTicketSchema,
  type CreateTicketInput,
} from "../../../../packages/shared/ticket.schema";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/context/AuthContext";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import {
  getAllTickets,
  createTicket,
  updateTicketStatus,
} from "../features/tickets/api/ticketApi";

function DashboardPage() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "OPEN" | "IN_PROGRESS" | "CLOSED">("");
  const [priority, setPriority] = useState<"" | "LOW" | "MEDIUM" | "HIGH">("");
  const [page, setPage] = useState(1);

  const {
    data: ticketResponse,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["tickets", token, page, search, status, priority],
    queryFn: async () => {
      if (!token) return null;
      return getAllTickets(token, {
        page,
        limit: 10,
        search,
        status: status || undefined,
        priority: priority || undefined,
      });
    },
    enabled: Boolean(token),
  });

  const tickets = ticketResponse?.data ?? [];
  const pagination = ticketResponse?.meta;
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ticketToClose, setTicketToClose] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
    },
  });

  const isAdmin = user?.role === "ADMIN";

  // Open form when sidebar Create Ticket is clicked
  useEffect(() => {
    if (searchParams.get("createTicket") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);



  async function handleCloseTicket(ticketId: number) {
    if (!token) return;
    try {
      setError("");
      await updateTicketStatus(ticketId, "CLOSED", token);
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close ticket");
    }
  }

  async function handleCreateTicket(data: CreateTicketInput) {
    if (!token) {
      setError("Please login again.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newTicket = await createTicket(data, token);

      reset();
      setShowForm(false);
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      navigate(`/tickets/${newTicket.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ticket creation failed");
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    {
      title: "Total Tickets",
      value: pagination?.total ?? tickets.length,
      detail: "All support requests",
      icon: "▤",
    },
    {
      title: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "OPEN").length,
      detail: "Awaiting resolution",
      icon: "◷",
    },
    {
      title: "In Progress",
      value: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
      detail: "Currently being handled",
      icon: "↻",
    },
    {
      title: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "CLOSED").length,
      detail: "Successfully completed",
      icon: "✓",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back, {user?.name}!
            {isAdmin
              ? " Manage and monitor all support tickets."
              : " Here is your support workspace overview."}
          </p>
        </div>

        {user?.role === "CUSTOMER" && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl px-5 py-3"
          >
            {showForm ? "Close Form" : "+ Create Ticket"}
          </Button>
        )}
      </section>


      {showForm && user?.role === "CUSTOMER" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Create New Ticket
          </h3>

            <form onSubmit={handleSubmit(handleCreateTicket)} className="mt-5 space-y-4">
              <Input
                label="Ticket Title"
                type="text"
                placeholder="Enter ticket title"
                error={errors.title?.message}
                {...register("title")}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Describe the issue..."
                  aria-invalid={Boolean(errors.description)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
                {errors.description && (
                  <p role="alert" className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ticket-priority" className="mb-2 block text-sm font-medium text-slate-700">
                  Priority
                </label>
                <select
                    id="ticket-priority"
                  {...register("priority")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && (
                  <p role="alert" className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>
            <Button
              type="submit"
              loading={saving}
              className="rounded-xl px-6 py-3"
            >
              Create Ticket
            </Button>
          </form>
        </section>

      )}

      {(error || queryError) && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error || (queryError instanceof Error
            ? queryError.message
            : "Failed to load tickets")}
        </p>
      )}

      <section>
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900">
            {isAdmin ? "All Tickets Overview" : "Ticket Overview"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your support tickets
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                  {stat.icon}
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">
          {isAdmin ? "All Tickets" : "Recent Tickets"}
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Search tickets"
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search tickets..."
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="filter-status" className="text-sm font-medium text-slate-700">Status Filter</label>
            <select id="filter-status" value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="filter-priority" className="text-sm font-medium text-slate-700">Priority Filter</label>
            <select id="filter-priority" value={priority} onChange={(event) => { setPriority(event.target.value as typeof priority); setPage(1); }} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm">
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <Table>
            <thead className="border-y border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-4">Ticket</th>
                <th className="py-4">Subject</th>
                <th className="py-4">Priority</th>
                <th className="py-4">Status</th>
                <th className="py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-100">
                    <td className="py-4 font-medium text-slate-700">
                      #{ticket.id}
                    </td>
                    <td className="py-4 text-slate-700">{ticket.title}</td>
                    <td className="py-4"><Badge type="priority" value={ticket.priority} /></td>
                    <td className="py-4"><Badge type="status" value={ticket.status} /></td>
                    <td className="py-4">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="mr-3 font-semibold text-indigo-600 hover:underline"
                      >
                        View Details
                      </Link>
                      {ticket.status === "OPEN" && (
                        <button
                          onClick={() => setTicketToClose(ticket.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Close Ticket
                        </button>
                      )}
                      {ticket.status === "CLOSED" && (
                        <span className="font-medium text-green-600">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </Table>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
            {" · "}
            {pagination?.total ?? tickets.length} total tickets
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              type="button"
              disabled={page >= (pagination?.totalPages ?? 1) || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={ticketToClose !== null}
        title="Close ticket?"
        description="Are you sure you want to close this ticket? This action changes its status to Closed."
        onClose={() => setTicketToClose(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTicketToClose(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (ticketToClose === null) return;
                await handleCloseTicket(ticketToClose);
                setTicketToClose(null);
              }}
            >
              Confirm Close
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">Please confirm before closing this ticket.</p>
      </Modal>
    </div>
  );
}

export default DashboardPage;
