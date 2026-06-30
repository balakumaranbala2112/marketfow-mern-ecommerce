const variants = {
  // Order statuses
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",

  // Payment statuses
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-slate-50 text-slate-700 border-slate-200",

  // User statuses
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-50 text-slate-600 border-slate-200",
  blocked: "bg-red-50 text-red-700 border-red-200",

  // User roles
  admin: "bg-violet-50 text-violet-700 border-violet-200",
  customer: "bg-sky-50 text-sky-700 border-sky-200",
};

function Badge({ children, variant = "pending" }) {
  // Pick style based on variant.
  // If variant is invalid, fallback to pending style.
  const classes = variants[variant] || variants.pending;

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {children}
    </span>
  );
}

export default Badge;