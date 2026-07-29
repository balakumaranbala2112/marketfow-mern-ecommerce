import { Link } from "react-router";
import { ArrowRight, Home, Search, ShoppingBag } from "lucide-react";

import routePaths from "../../routes/routePaths.js";

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="border-b border-primary-800 bg-primary-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            to={routePaths.home}
            className="inline-flex items-center gap-2.5 rounded-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-400 text-primary-950">
              <ShoppingBag size={19} strokeWidth={2.2} aria-hidden="true" />
            </span>

            <span className="text-lg font-extrabold tracking-[-0.025em] text-white">
              MarketFlow
            </span>
          </Link>
        </div>
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_2px_8px_rgba(15,24,32,0.08)]">
            <div className="border-b border-border bg-surface-subtle px-5 py-4 sm:px-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
                Navigation error
              </p>
            </div>

            <div className="px-5 py-8 text-center sm:px-8 sm:py-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-primary-50 text-primary-700">
                <Search size={28} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <p className="mt-6 text-6xl font-extrabold tracking-[-0.06em] text-primary-950 sm:text-7xl">
                404
              </p>

              <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-text sm:text-3xl">
                We couldn&apos;t find that page
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-muted sm:text-base">
                The address may be incorrect, or the page may have been moved or
                removed.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to={routePaths.home}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-6 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
                >
                  <Home size={17} aria-hidden="true" />
                  Go to homepage
                </Link>

                <Link
                  to={routePaths.products}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-6 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
                >
                  Browse products
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="border-t border-border bg-surface-subtle px-5 py-4 text-center sm:px-7">
              <p className="text-xs leading-5 text-text-soft">
                Return to the homepage or continue browsing the MarketFlow
                catalog.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
