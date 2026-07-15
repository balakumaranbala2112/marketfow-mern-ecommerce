import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import useAuthStore from "./stores/authStore.js";
import { getMe } from "./features/auth/authApi.js";

function App() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    async function bootstrapAuth() {
      if (accessToken) {
        try {
          const res = await getMe();
          setAuth({ user: res.data.data.user, accessToken });
        } catch (err) {
          console.error("Auth bootstrap failed:", err);
          clearAuth();
        }
      }
      setHydrated(true);
    }

    bootstrapAuth();
  }, [accessToken, setAuth, clearAuth, setHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
