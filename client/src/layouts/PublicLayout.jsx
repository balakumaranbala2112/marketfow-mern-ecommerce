import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import routePaths from "../routes/routePaths.js";
import useAuthStore from "../stores/authStore.js";
import { useCart } from "../features/cart/hooks/useCart.js";

import Toast from "../components/common/Toast.jsx";
import BrandMark from "../components/common/BrandMark.jsx";

const navItems = [
  { label: "Home", path: routePaths.home },
  { label: "Products", path: routePaths.products },
  {
    label: "Deals",
    path: `${routePaths.products}?isFeatured=true`,
  },
];

const footerShopLinks = [
  { label: "All products", to: routePaths.products },
  {
    label: "Featured products",
    to: `${routePaths.products}?isFeatured=true`,
  },
  {
    label: "New arrivals",
    to: `${routePaths.products}?sort=-createdAt`,
  },
];

const footerAccountLinks = [
  { label: "Profile", to: routePaths.profile },
  { label: "Orders", to: routePaths.orders },
  { label: "Wishlist", to: routePaths.wishlist },
  { label: "Cart", to: routePaths.cart },
];

function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { data: cart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ) || 0;

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  function handleSearch(event) {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) return;

    navigate(
      `${routePaths.products}?search=${encodeURIComponent(normalizedQuery)}`,
    );

    setSearchQuery("");
    setMobileSearchOpen(false);
  }

  function isLinkActive(item) {
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
  }

  function handleLogout() {
    clearAuth();
    setDropdownOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted text-text">
      <Toast />

      <header className="sticky top-0 z-40">
        <div className="bg-primary-950 text-white">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
            <p className="truncate text-[11px] font-medium text-primary-200 sm:text-xs">
              Browse products, manage orders, and shop through one MarketFlow
              account.
            </p>

            <Link
              to={routePaths.orders}
              className="hidden shrink-0 text-xs font-semibold text-primary-200 hover:text-white hover:underline sm:inline"
            >
              Track orders
            </Link>
          </div>
        </div>

        <div className="border-b border-border bg-white">
          <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <BrandMark />

            <form
              onSubmit={handleSearch}
              className="mx-4 hidden min-w-0 max-w-2xl flex-1 md:block"
              role="search"
            >
              <div className="relative flex min-h-[44px] overflow-hidden rounded-md border border-border-strong bg-white focus-within:border-accent-500 focus-within:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products"
                  className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-text outline-none placeholder:text-text-soft"
                />

                <button
                  type="submit"
                  className="border-l border-accent-600 bg-accent-400 px-5 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
                >
                  Search
                </button>
              </div>
            </form>

            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Primary navigation"
            >
              {navItems.map((item) => {
                const active = isLinkActive(item);

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`min-h-[40px] rounded-md px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-primary-950 text-white"
                        : "text-primary-800 hover:bg-primary-50 hover:text-primary-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileSearchOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-md text-primary-700 transition hover:bg-primary-50 md:hidden"
                aria-label="Toggle search"
                aria-expanded={mobileSearchOpen}
              >
                <Search size={20} aria-hidden="true" />
              </button>

              {user && (
                <Link
                  to={routePaths.wishlist}
                  className="hidden h-10 w-10 items-center justify-center rounded-md text-primary-700 transition hover:bg-primary-50 hover:text-red-600 sm:flex"
                  aria-label="Wishlist"
                >
                  <Heart size={20} aria-hidden="true" />
                </Link>
              )}

              <Link
                to={routePaths.cart}
                className="relative flex h-10 w-10 items-center justify-center rounded-md text-primary-700 transition hover:bg-primary-50 hover:text-primary-950"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingCart size={20} aria-hidden="true" />

                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-accent-500 px-1 text-[10px] font-extrabold text-primary-950">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((current) => !current)}
                    className="flex min-h-[42px] items-center gap-2 rounded-md border border-border bg-white p-1.5 pr-2.5 transition hover:bg-primary-50"
                    aria-label="Open account menu"
                    aria-expanded={dropdownOpen}
                  >
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt=""
                        className="h-7 w-7 rounded-md object-cover"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 text-xs font-extrabold text-primary-700">
                        {getInitial(user.name)}
                      </span>
                    )}

                    <span className="hidden max-w-[100px] truncate text-sm font-semibold text-primary-900 sm:inline">
                      {user.name}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`hidden text-primary-500 transition-transform sm:block ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-white shadow-[0_10px_30px_rgba(15,24,32,0.14)] animate-fade-in">
                      <div className="border-b border-border bg-surface-subtle px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-soft">
                          Signed in as
                        </p>

                        <p className="mt-1 truncate text-sm font-extrabold text-primary-950">
                          {user.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-text-muted">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1.5">
                        {user.role === "admin" && (
                          <AccountMenuLink
                            to={routePaths.adminDashboard}
                            icon={LayoutDashboard}
                            label="Admin panel"
                          />
                        )}

                        <AccountMenuLink
                          to={routePaths.profile}
                          icon={User}
                          label="Profile"
                        />

                        <AccountMenuLink
                          to={routePaths.orders}
                          icon={Package}
                          label="Orders"
                        />

                        <AccountMenuLink
                          to={routePaths.wishlist}
                          icon={Heart}
                          label="Wishlist"
                        />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="mt-1 flex min-h-[42px] w-full items-center gap-2.5 rounded-md border-t border-border px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} aria-hidden="true" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    to={routePaths.login}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
                  >
                    Sign in
                  </Link>

                  <Link
                    to={routePaths.register}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-accent-600 bg-accent-400 px-4 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
                  >
                    Create account
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-md text-primary-700 transition hover:bg-primary-50 lg:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X size={21} aria-hidden="true" />
                ) : (
                  <Menu size={21} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {mobileSearchOpen && (
            <div className="border-t border-border bg-white px-4 py-3 md:hidden">
              <form
                onSubmit={handleSearch}
                className="relative flex min-h-[44px] overflow-hidden rounded-md border border-border-strong"
                role="search"
              >
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                  aria-hidden="true"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products"
                  autoFocus
                  className="min-w-0 flex-1 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-text-soft"
                />

                <button
                  type="submit"
                  className="border-l border-accent-600 bg-accent-400 px-4 text-sm font-bold text-primary-950"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-[108px] z-30 bg-primary-950/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            />

            <div className="relative z-40 border-b border-border bg-white px-4 py-4 shadow-lg lg:hidden">
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  const active = isLinkActive(item);

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`block min-h-[44px] rounded-md px-4 py-3 text-sm font-semibold ${
                        active
                          ? "bg-primary-950 text-white"
                          : "text-primary-800 hover:bg-primary-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {!user && (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <Link
                    to={routePaths.login}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border-strong bg-white text-sm font-semibold text-primary-900"
                  >
                    Sign in
                  </Link>

                  <Link
                    to={routePaths.register}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-accent-600 bg-accent-400 text-sm font-bold text-primary-950"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="mt-auto border-t border-primary-800 bg-primary-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.75fr] lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-400 text-primary-950">
                  <ShoppingBag size={19} strokeWidth={2.2} aria-hidden="true" />
                </span>

                <span className="text-lg font-extrabold tracking-[-0.025em]">
                  MarketFlow
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-7 text-primary-300">
                Browse products, manage saved items, and review orders through
                one consistent shopping account.
              </p>
            </div>

            <FooterColumn title="Shop" links={footerShopLinks} />
            <FooterColumn title="Account" links={footerAccountLinks} />
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-4 text-xs text-primary-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 MarketFlow.</p>
            <p>Account, cart, and order information in one place.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AccountMenuLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex min-h-[42px] items-center gap-2.5 rounded-md px-3 text-sm font-semibold text-primary-800 transition hover:bg-primary-50 hover:text-primary-950"
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-400">
        {title}
      </h2>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-primary-300 transition hover:text-white hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default PublicLayout;
