function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Login
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">Welcome back</h1>

        <p className="mt-3 text-sm text-slate-600">
          Stage 54 will build the real login form and connect it to the backend.
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
