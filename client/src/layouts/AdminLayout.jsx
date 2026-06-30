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
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import Toast from "../components/common/Toast.jsx";

const adminNavItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Tag },
  { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Coupons", path: "/admin/coupons", icon: Percent },
];

function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Toast />
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-slate-950 p-6 md:flex flex-col justify-between">
        <div className="space-y-8">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight">
            MarketFlow Admin
          </Link>

          <nav className="flex flex-col gap-1 text-sm">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white text-sm"
          >
            <ArrowLeft size={18} />
            Back to Store
          </Link>
          <button
            onClick={clearAuth}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="border-b border-white/10 bg-slate-950 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">Admin Panel</p>
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">{user.name}</span>
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-slate-300">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </header>

        <main className="p-6 flex-1 bg-slate-900/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
