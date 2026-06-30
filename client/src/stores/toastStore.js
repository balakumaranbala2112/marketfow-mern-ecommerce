import { create } from "zustand";

let toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = "success", message, duration = 4000 }) => {
    const id = ++toastId;

    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

}));

export default useToastStore;
