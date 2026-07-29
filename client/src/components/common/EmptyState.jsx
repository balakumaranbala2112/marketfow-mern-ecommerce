import { PackageOpen } from "lucide-react";
import { Link } from "react-router";

function EmptyState({ icon: Icon = PackageOpen, title, message, actionLabel, actionTo }) {
  return (
    <div className="animate-fade-in flex min-h-[45vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50">
        <Icon className="h-9 w-9 text-primary-400" />
      </div>

      <h3 className="mt-6 text-lg font-bold text-gray-900">{title}</h3>

      {message && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
          {message}
        </p>
      )}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
