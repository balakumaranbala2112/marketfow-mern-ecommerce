function AdminDashboardPage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
        Admin
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Admin dashboard
      </h1>

      <p className="mt-4 max-w-2xl text-slate-300">
        Stage 68 will connect this page to backend dashboard analytics and
        Recharts.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Sales</p>
          <h2 className="mt-2 text-3xl font-bold">₹0</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Orders</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Users</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
