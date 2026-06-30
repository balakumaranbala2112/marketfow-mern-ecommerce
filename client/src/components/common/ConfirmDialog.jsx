import { AlertTriangle, X } from "lucide-react";

function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel, variant = "danger" }) {
  if (!open) return null;

  const btnColor = variant === "danger"
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-slate-950 hover:bg-slate-800 text-white";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button onClick={onCancel} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-2.5">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${btnColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
