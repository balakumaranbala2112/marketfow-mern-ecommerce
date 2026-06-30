import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router";
import { ShoppingCart, Heart, User, LogOut, Menu, X, LayoutDashboard } from "lucide-react";

import routePaths from "../routes/routePaths.js";
import useAuthStore from "../stores/authStore.js";
import { useCart } from "../features/cart/hooks/useCart.js";
import Toast from "../components/common/Toast.jsx";

const navItems = [
  {
    label: "Home",
    path: routePaths.home,
  },
  {
    label: "Products",
    path: routePaths.products,
  },
];

function getNavLinkClass({ isActive }) {
  return isActive ? "text-emerald-600 font-semibold" : "text-slate-600 hover:text-slate-950 transition-colors";
}

function PublicLayout() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: cart } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <Toast />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to={routePaths.home} className="text-xl font-bold tracking-tight">
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

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to={routePaths.cart} className="relative p-1 text-slate-600 hover:text-slate-950 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1.5 pr-3 hover:bg-slate-100 focus:outline-none"
                >
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    {user.role === "admin" && (
                      <Link
                        to={routePaths.adminDashboard}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to={routePaths.profile}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to={routePaths.wishlist}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Heart size={16} /> Wishlist
                    </Link>
                    <Link
                      to={routePaths.orders}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <ShoppingCart size={16} /> My Orders
                    </Link>
                    <button
                      onClick={() => {
                        clearAuth();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to={routePaths.login}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold !text-white hover:bg-slate-800"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-slate-600 hover:text-slate-950 md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 py-1"
              >
                {item.label}
              </NavLink>
            ))}
            {!user && (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Link
                  to={routePaths.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full bg-slate-950 py-2.5 text-center text-sm font-semibold !text-white hover:bg-slate-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MarketFlow. All rights reserved.</p>
          <p>Built with React, Vite, Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
