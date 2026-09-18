import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

import useToastStore from "../../stores/toastStore.js";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-green-200 bg-green-50",
    icon: "text-green-700",
    progress: "bg-green-600",
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-red-200 bg-red-50",
    icon: "text-red-600",
    progress: "bg-red-600",
  },
  info: {
    icon: Info,
    wrapper: "border-blue-200 bg-blue-50",
    icon: "text-blue-700",
    progress: "bg-blue-600",
  },
};

function Toast() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed inset-x-4 top-4 z-[100] flex flex-col gap-3 sm:left-auto sm:right-5 sm:w-[390px]"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const config = toastConfig[toast.type] || toastConfig.info;
        const Icon = config.icon;

        return (
          <article
            key={toast.id}
            className={`animate-slide-in-right overflow-hidden rounded-lg border bg-white shadow-[0_8px_24px_rgba(15,24,32,0.12)] ${config.wrapper}`}
            role="status"
          >
            <div className="flex items-start gap-3 px-4 py-3.5">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ${config.icon}`}
              >
                <Icon size={17} strokeWidth={2.3} />
              </span>

              <p className="flex-1 pt-1 text-sm font-semibold leading-5 text-primary-950">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-primary-500 transition hover:bg-black/5 hover:text-primary-950"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>

            <div className="h-1 bg-black/5">
              <div
                className={`h-full animate-toast-progress rounded-r-full ${config.progress}`}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default Toast;
