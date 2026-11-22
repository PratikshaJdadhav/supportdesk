import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = (path: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
      location.pathname === path
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-6 md:block">
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            SD
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">SupportDesk</h1>
            <p className="text-xs text-slate-500">Support workspace</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-2">
          <Link to="/" className={navClass("/")}>
            <span>▦</span>
            Overview
          </Link>

          {user?.role === "ADMIN" && (
            <>
              <Link to="/customers" className={navClass("/customers")}>
                <span>♙</span>
                Customers
              </Link>

              <Link to="/tickets" className={navClass("/tickets")}>
                <span>▤</span>
                Tickets
              </Link>

              <Link to="/agents" className={navClass("/agents")}>
                <span>♧</span>
                Agents
              </Link>
            </>
          )}

          {user?.role === "CUSTOMER" && (
            <Link
              to="/?createTicket=true"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <span>＋</span>
              Create Ticket
            </Link>
          )}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="mt-1 font-semibold text-slate-800">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </aside>

      <div className="md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-violet-600 px-5 py-4 text-white shadow-md md:px-8">
          <div>
            <p className="text-sm font-semibold">Support workspace</p>
            <p className="text-xs text-indigo-100">
              Manage your support activity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-indigo-100">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;