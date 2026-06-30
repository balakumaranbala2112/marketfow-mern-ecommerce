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
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex font-sans">
      <Toast />
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-[#070d1e] p-6 md:flex flex-col justify-between z-30">
        <div className="space-y-8">
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-white hover:opacity-90 transition-opacity">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-black shadow-md shadow-emerald-500/20">
              M
            </span>
            <span>MarketFlow <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md ml-1 border border-emerald-500/10">Admin</span></span>
          </Link>

          <nav className="flex flex-col gap-1.5 text-sm">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-500 pl-3.5 rounded-l-none"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-slate-200 text-sm transition-all"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
          <button
            onClick={clearAuth}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="border-b border-slate-800 bg-[#070d1e] px-6 py-4 flex items-center justify-between z-20">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Control Center</p>
          {user && (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-350">{user.name}</span>
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-black text-slate-300">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </header>

        <main className="p-6 flex-1 bg-[#0b1329]">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
