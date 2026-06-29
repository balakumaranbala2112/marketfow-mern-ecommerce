import config from "./lib/config.js";

function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          MarketFlow Frontend
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          React + Vite + Tailwind setup completed
        </h1>

        <p className="mt-4 text-slate-600">
          API URL: <span className="font-semibold">{config.apiUrl}</span>
        </p>
      </section>
    </main>
  );
}

export default App;
