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
  ChevronDown,
} from "lucide-react";

import routePaths from "../routes/routePaths.js";
import useAuthStore from "../stores/authStore.js";
import { useCart } from "../features/cart/hooks/useCart.js";
import Toast from "../components/common/Toast.jsx";
import BrandMark from "../components/common/BrandMark.jsx";

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
  { label: "Help Center", to: routePaths.products },
  { label: "Shipping Info", to: routePaths.products },
  { label: "Returns & Exchanges", to: routePaths.products },
  { label: "Contact Us", to: routePaths.products },
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

  const isLinkActive = (item) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (item.label === "Home") {
      return currentPath === routePaths.home;
    }
    if (item.label === "Products") {
      return (
        currentPath === routePaths.products &&
        !currentSearch.includes("isFeatured=true")
      );
    }
    if (item.label === "Deals") {
      return (
        currentPath === routePaths.products &&
        currentSearch.includes("isFeatured=true")
      );
    }
    return currentPath === item.path;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Toast />

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          <BrandMark />

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more…"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15"
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${active
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 md:hidden"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            {user && (
              <Link
                to={routePaths.wishlist}
                className="hidden sm:flex p-2.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link
              to={routePaths.cart}
              className="relative p-2.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm border-2 border-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User menu / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1.5 pr-3 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="h-7 w-7 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 text-xs font-bold text-primary-700">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 hidden sm:inline truncate max-w-[80px]">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="animate-fade-in absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-black/8 z-40">
                      <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-0.5">
                          {user.name}
                        </p>
                      </div>
                      {user.role === "admin" && (
                        <Link
                          to={routePaths.adminDashboard}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      <Link
                        to={routePaths.profile}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to={routePaths.wishlist}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <Heart size={16} /> Wishlist
                      </Link>
                      <Link
                        to={routePaths.orders}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            clearAuth();
                            setDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold !text-white hover:bg-primary-700 transition-all duration-200 shadow-sm shadow-primary-600/25"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden transition-all"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="animate-fade-in border-t border-gray-100 bg-white px-4 sm:px-6 py-3 md:hidden">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  autoFocus
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="animate-fade-in border-t border-gray-200 bg-white px-4 sm:px-6 py-4 lg:hidden space-y-1">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-semibold py-3 px-4 rounded-lg transition-all ${active
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!user && (
              <div className="pt-4 mt-2 border-t border-gray-100 flex gap-3">
                <Link
                  to={routePaths.login}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to={routePaths.register}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-lg bg-primary-600 py-2.5 text-center text-sm font-semibold !text-white hover:bg-primary-700"
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
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-black shadow-sm shadow-primary-600/25">
                  M
                </span>
                <span className="font-extrabold text-lg text-gray-900">
                  MarketFlow
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your one-stop destination for quality products at the best
                prices. Shop with confidence — fast delivery, secure payments,
                easy returns.
              </p>
            </div>

            {/* Shop links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Shop
              </h4>
              <ul className="space-y-3">
                {footerShopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Customer Support
              </h4>
              <ul className="space-y-3">
                {footerSupportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                My Account
              </h4>
              <ul className="space-y-3">
                {footerAccountLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
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
        <div className="border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <p>© 2026 MarketFlow. All rights reserved.</p>
            <p className="text-gray-400">Secure checkout · Fast delivery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
