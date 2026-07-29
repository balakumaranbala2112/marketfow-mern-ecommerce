import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Percent,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import Toast from "../components/common/Toast.jsx";
import routePaths from "../routes/routePaths.js";

const adminNavItems = [
  { label: "Dashboard", path: routePaths.adminDashboard, icon: LayoutDashboard },
  { label: "Products", path: routePaths.adminProducts, icon: Package },
  { label: "Categories", path: routePaths.adminCategories, icon: Tag },
  { label: "Orders", path: routePaths.adminOrders, icon: ShoppingBag },
  { label: "Users", path: routePaths.adminUsers, icon: Users },
  { label: "Coupons", path: routePaths.adminCoupons, icon: Percent },
];

function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = (
    <>
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary-500/10 font-bold text-primary-400 border-l-2 border-primary-500 pl-3.5 rounded-l-none"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`
            }
          >
            <Icon size={16} />
            {item.label}
          </NavLink>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0b1329] text-gray-100 flex font-sans">
      <Toast />

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-gray-800/60 bg-[#070d1e] p-6 transition-transform duration-300 md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          <Link
            to={routePaths.adminDashboard}
            className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-white hover:opacity-90"
            onClick={() => setMobileNavOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-black text-white shadow-md shadow-primary-600/30">
              M
            </span>
            <span>
              MarketFlow{" "}
              <span className="ml-1 rounded-md border border-primary-500/15 bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-400">
                Admin
              </span>
            </span>
          </Link>

          <nav className="flex flex-col gap-1">{navLinks}</nav>
        </div>

        <div className="space-y-2">
          <Link
            to={routePaths.home}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition-all hover:bg-white/5 hover:text-gray-200"
            onClick={() => setMobileNavOpen(false)}
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
          <button
            type="button"
            onClick={clearAuth}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="z-20 flex items-center justify-between border-b border-gray-800/60 bg-[#070d1e]/80 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Admin Control Center
            </p>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-semibold text-gray-400 sm:inline">
                {user.name}
              </span>
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt=""
                  className="h-8 w-8 rounded-lg border border-gray-700 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-xs font-bold text-gray-300">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          ) : null}
        </header>

        <main className="flex-1 bg-[#0b1329] p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed right-4 top-4 z-[60] rounded-lg bg-gray-800 p-2 text-white md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      ) : null}
    </div>
  );
}

export default AdminLayout;
