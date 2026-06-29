import { NavLink, Outlet } from "react-router";

import routePaths from "../routes/routePaths.js";

const navItems = [
  {
    label: "Home",
    path: routePaths.home,
  },
  {
    label: "Products",
    path: routePaths.products,
  },
  {
    label: "Cart",
    path: routePaths.cart,
  },
];

function getNavLinkClass({ isActive }) {
  return isActive ? "text-emerald-600" : "text-slate-600 hover:text-slate-950";
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to={routePaths.home} className="text-xl font-bold">
            MarketFlow
          </NavLink>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={getNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink
              to={routePaths.login}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </NavLink>

            <NavLink
              to={routePaths.register}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold !text-white hover:bg-slate-800"
            >
              Register
            </NavLink>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MarketFlow. All rights reserved.</p>
          <p>Built with React, Vite, Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
