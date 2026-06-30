import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Search,
  Package,
} from "lucide-react";

import routePaths from "../routes/routePaths.js";
import useAuthStore from "../stores/authStore.js";
import { useCart } from "../features/cart/hooks/useCart.js";
import Toast from "../components/common/Toast.jsx";

const navItems = [
  { label: "Home", path: routePaths.home },
  { label: "Products", path: routePaths.products },
  { label: "Deals", path: `${routePaths.products}?isFeatured=true` },
];

const footerShopLinks = [
  { label: "All Products", to: routePaths.products },
  { label: "Featured Deals", to: `${routePaths.products}?isFeatured=true` },
  { label: "New Arrivals", to: `${routePaths.products}?sort=-createdAt` },
  { label: "Best Sellers", to: routePaths.products },
];

const footerSupportLinks = [
  { label: "Help Center", to: "#" },
  { label: "Shipping Info", to: "#" },
  { label: "Returns & Exchanges", to: "#" },
  { label: "Contact Us", to: "#" },
];

const footerAccountLinks = [
  { label: "My Profile", to: routePaths.profile },
  { label: "My Orders", to: routePaths.orders },
  { label: "Wishlist", to: routePaths.wishlist },
  { label: "Cart", to: routePaths.cart },
];

function PublicLayout() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`${routePaths.products}?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  // Resolves the overlapping active navigation styles
  const isLinkActive = (item) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (item.label === "Home") {
      return currentPath === routePaths.home;
    }
    if (item.label === "Products") {
      // Active only when on `/products` and not viewing Featured Deals
      return (
        currentPath === routePaths.products &&
        !currentSearch.includes("isFeatured=true")
      );
    }
    if (item.label === "Deals") {
      // Active when on `/products` and the search query contains `isFeatured=true`
      return (
        currentPath === routePaths.products &&
        currentSearch.includes("isFeatured=true")
      );
    }
    return currentPath === item.path;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Toast />

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
        {/* Row 1: Main navbar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">
          {/* Logo */}
          <NavLink
            to={routePaths.home}
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900 hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-600/20">
              M
            </span>
            <span className="hidden sm:inline">MarketFlow</span>
          </NavLink>

          {/* Desktop search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1 transition-colors ${
                    active
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-indigo-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all md:hidden"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            {user && (
              <Link
                to={routePaths.wishlist}
                className="hidden sm:flex p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link
              to={routePaths.cart}
              className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-md border-2 border-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 pr-3 hover:bg-slate-100 hover:border-slate-300 focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline truncate max-w-[80px]">
                    {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl z-40 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-medium text-slate-400">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.name}
                        </p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to={routePaths.adminDashboard}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link
                        to={routePaths.profile}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to={routePaths.wishlist}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Heart size={16} /> Wishlist
                      </Link>
                      <Link
                        to={routePaths.orders}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            clearAuth();
                            setDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={routePaths.login}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold !text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/15"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 lg:hidden"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar — expandable */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/80 bg-white px-4 py-4 lg:hidden space-y-1 shadow-inner animate-fade-in">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-semibold py-2.5 px-3 rounded-xl transition-all ${
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!user && (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Link
                  to={routePaths.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-full bg-indigo-600 py-2.5 text-center text-sm font-bold !text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-black">
                  M
                </span>
                <span className="font-extrabold text-lg text-slate-900">
                  MarketFlow
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your one-stop destination for quality products at the best
                prices. Shop with confidence — fast delivery, secure payments,
                easy returns.
              </p>
            </div>

            {/* Shop links */}
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                Shop
              </h4>
              <ul className="space-y-2">
                {footerShopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                Customer Support
              </h4>
              <ul className="space-y-2">
                {footerSupportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account links */}
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                My Account
              </h4>
              <ul className="space-y-2">
                {footerAccountLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 MarketFlow. All rights reserved.</p>
            <p>Built with React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
