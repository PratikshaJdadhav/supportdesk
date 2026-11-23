type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

type BadgeProps =
  | {
      type: "status";
      value: TicketStatus;
    }
  | {
      type: "priority";
      value: TicketPriority;
    };

const badgeStyles: Record<TicketStatus | TicketPriority, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  CLOSED: "bg-green-50 text-green-700",
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-indigo-50 text-indigo-700",
  HIGH: "bg-red-50 text-red-700",
};

export function Badge({ type, value }: BadgeProps) {
  const label = value.replace("_", " ");

  return (
    <span
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold ${badgeStyles[value]}`}
      aria-label={`${type}: ${label}`}
    >
      {label}
    </span>
  );
}
