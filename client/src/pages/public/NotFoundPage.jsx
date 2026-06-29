import { Link } from "react-router";

import routePaths from "../../routes/routePaths.js";

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
        404
      </p>

      <h1 className="mt-3 text-5xl font-bold tracking-tight">Page not found</h1>

      <p className="mt-4 text-slate-600">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to={routePaths.home}
        className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go Home
      </Link>
    </main>
  );
}

export default NotFoundPage;
