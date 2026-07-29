import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Percent,
  ShoppingBag,
  Tag,
  Users,
  X,
} from "lucide-react";

import useAuthStore from "../stores/authStore.js";
import Toast from "../components/common/Toast.jsx";
import routePaths from "../routes/routePaths.js";

const adminNavItems = [
  {
    label: "Dashboard",
    path: routePaths.adminDashboard,
    icon: LayoutDashboard,
  },
  { label: "Products", path: routePaths.adminProducts, icon: Package },
  { label: "Categories", path: routePaths.adminCategories, icon: Tag },
  { label: "Orders", path: routePaths.adminOrders, icon: ShoppingBag },
  { label: "Users", path: routePaths.adminUsers, icon: Users },
  { label: "Coupons", path: routePaths.adminCoupons, icon: Percent },
];

function AdminLayout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  const activeItem =
    adminNavItems.find((item) => location.pathname.startsWith(item.path)) ||
    adminNavItems[0];

  return (
    <div className="min-h-screen bg-surface-muted text-text">
      <Toast />

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary-950/60 md:hidden"
          aria-label="Close admin navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[276px] flex-col border-r border-primary-800 bg-primary-950 text-white transition-transform duration-200 md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link
            to={routePaths.adminDashboard}
            className="inline-flex items-center gap-3 rounded-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-400 text-sm font-black text-primary-950">
              M
            </span>

            <span className="min-w-0">
              <span className="block text-base font-extrabold tracking-[-0.025em]">
                MarketFlow
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300">
                Administration
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-primary-300 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-400">
            Operations
          </p>

          <nav className="mt-3 space-y-1" aria-label="Admin navigation">
            {adminNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-accent-400 text-primary-950"
                        : "text-primary-200 hover:bg-white/[0.07] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          isActive
                            ? "bg-primary-950/10 text-primary-950"
                            : "bg-white/[0.06] text-primary-300 group-hover:text-white"
                        }`}
                      >
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-3 rounded-md bg-white/[0.055] px-3 py-3">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt=""
                className="h-9 w-9 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-800 text-xs font-extrabold text-primary-100">
                {getInitial(user?.name)}
              </span>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="truncate text-xs text-primary-400">
                {user?.email || "Admin account"}
              </p>
            </div>
          </div>

          <Link
            to={routePaths.home}
            className="flex min-h-[42px] items-center gap-3 rounded-md px-3 text-sm font-semibold text-primary-300 transition hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to store
          </Link>

          <button
            type="button"
            onClick={clearAuth}
            className="mt-1 flex min-h-[42px] w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-[276px]">
        <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-white text-primary-800 transition hover:bg-primary-50 md:hidden"
                aria-label="Open admin navigation"
              >
                <Menu size={20} aria-hidden="true" />
              </button>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-text-soft">
                  Admin control center
                </p>
                <h1 className="truncate text-lg font-extrabold tracking-[-0.02em] text-primary-950">
                  {activeItem.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-md border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 sm:inline-flex">
                Admin session
              </span>

              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt=""
                  className="h-9 w-9 rounded-md border border-border object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-primary-100 text-xs font-extrabold text-primary-700">
                  {getInitial(user?.name)}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "A";
}

export default AdminLayout;
