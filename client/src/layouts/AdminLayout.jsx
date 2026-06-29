import { NavLink, Outlet } from "react-router";

import routePaths from "../routes/routePaths.js";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-slate-950 p-6 md:block">
        <NavLink to={routePaths.adminDashboard} className="text-xl font-bold">
          MarketFlow Admin
        </NavLink>

        <nav className="mt-10 flex flex-col gap-3 text-sm">
          <NavLink
            to={routePaths.adminDashboard}
            className="rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </NavLink>
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="border-b border-white/10 bg-slate-950 px-6 py-4">
          <p className="text-sm text-slate-300">Admin Panel</p>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
