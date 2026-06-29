import { Link } from "react-router";

import routePaths from "../../routes/routePaths.js";

function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            MarketFlow E-Commerce
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Shop smarter with a full-stack MERN store.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            MarketFlow connects a production-style backend with a clean React
            frontend for products, cart, orders, payments, and admin control.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={routePaths.products}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Browse Products
            </Link>

            <Link
              to={routePaths.login}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-slate-950 p-8 text-white">
            <p className="text-sm text-emerald-300">Frontend Phase</p>
            <h2 className="mt-3 text-3xl font-bold">Stage 52 Ready</h2>
            <p className="mt-4 text-slate-300">
              Routing, layouts, pages, protected routes, and providers are now
              prepared.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
