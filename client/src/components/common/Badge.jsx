const variants = {
  // Order statuses
  pending: "bg-amber-50 text-amber-700 before:bg-amber-500",
  confirmed: "bg-sky-50 text-sky-700 before:bg-sky-500",
  processing: "bg-primary-50 text-primary-700 before:bg-primary-500",
  shipped: "bg-violet-50 text-violet-700 before:bg-violet-500",
  delivered: "bg-emerald-50 text-emerald-700 before:bg-emerald-500",
  cancelled: "bg-red-50 text-red-700 before:bg-red-500",

  // Payment statuses
  paid: "bg-emerald-50 text-emerald-700 before:bg-emerald-500",
  failed: "bg-red-50 text-red-700 before:bg-red-500",
  refunded: "bg-gray-100 text-gray-600 before:bg-gray-400",

  // User statuses
  active: "bg-emerald-50 text-emerald-700 before:bg-emerald-500",
  inactive: "bg-gray-100 text-gray-600 before:bg-gray-400",
  blocked: "bg-red-50 text-red-700 before:bg-red-500",

  // User roles
  admin: "bg-primary-50 text-primary-700 before:bg-primary-500",
  customer: "bg-sky-50 text-sky-700 before:bg-sky-500",
};

function Badge({ children, variant = "pending" }) {
  const classes = variants[variant] || variants.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize before:h-1.5 before:w-1.5 before:rounded-full before:content-[''] ${classes}`}
    >
      {children}
    </span>
  );
}

export default Badge;