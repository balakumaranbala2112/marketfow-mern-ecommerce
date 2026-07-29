import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import useToastStore from "../../stores/toastStore.js";

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colors = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
  error: "bg-red-50 text-red-800 border-red-200/60",
  info: "bg-primary-50 text-primary-800 border-primary-200/60",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-primary-500",
};

const progressColors = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-primary-400",
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
            className={`animate-slide-in-right overflow-hidden rounded-xl border shadow-xl shadow-black/8 backdrop-blur-sm ${colors[toast.type] || colors.info}`}
            style={{ minWidth: 320, maxWidth: 440 }}
          >
            <div className="flex items-start gap-3 px-4 py-3.5">
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[toast.type] || iconColors.info}`}
              />
              <p className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-md p-0.5 opacity-50 transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-0.5 w-full bg-black/5">
              <div
                className={`h-full animate-toast-progress rounded-full ${progressColors[toast.type] || progressColors.info}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
