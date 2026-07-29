import { Link } from "react-router";
import { Home } from "lucide-react";

import routePaths from "../../routes/routePaths.js";

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-7xl font-extrabold text-primary-600">404</p>

      <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
        Page not found
      </h1>

      <p className="mt-3 text-gray-500 leading-relaxed max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to={routePaths.home}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
      >
        <Home size={16} />
        Go Home
      </Link>
    </main>
  );
}

export default NotFoundPage;
