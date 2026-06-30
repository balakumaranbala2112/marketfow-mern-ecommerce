import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import useToastStore from "../../stores/toastStore.js";

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colors = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-sky-500",
};

function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${colors[toast.type] || colors.info}`}
            style={{ minWidth: 300, maxWidth: 420 }}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[toast.type] || iconColors.info}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
