function DashboardPage() {
  const stats = [
    { title: "Total Tickets", value: "—", detail: "All support requests", icon: "▤" },
    { title: "Open Tickets", value: "—", detail: "Awaiting resolution", icon: "◷" },
    { title: "In Progress", value: "—", detail: "Currently being handled", icon: "↻" },
    { title: "Resolved", value: "—", detail: "Successfully completed", icon: "✓" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-500">
          Welcome back! Here is your support workspace overview.
        </p>
      </section>

      <section>
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900">Ticket Overview</h3>
          <p className="mt-1 text-sm text-slate-500">
            Summary of your support tickets
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                  {stat.icon}
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Tickets</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your latest support requests
            </p>
          </div>
          <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
            Ticket list
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-4">Ticket</th>
                <th className="py-4">Subject</th>
                <th className="py-4">Status</th>
                <th className="py-4">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400">
                  No ticket data available yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
