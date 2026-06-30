import { create } from "zustand";

function loadFromStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

const useAuthStore = create((set) => ({

  user: loadFromStorage("user"),

  accessToken: localStorage.getItem("accessToken") || null,

  isHydrated: false,

  setAuth: ({ user, accessToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null });
  },

  setHydrated: (value) => set({ isHydrated: value }),
}));

export default useAuthStore;
