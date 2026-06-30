import { PackageOpen } from "lucide-react";
import { Link } from "react-router";

function EmptyState({ icon: Icon = PackageOpen, title, message, actionLabel, actionTo }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-2xl bg-slate-100 p-5">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      {message && <p className="mt-2 max-w-sm text-sm text-slate-500">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
