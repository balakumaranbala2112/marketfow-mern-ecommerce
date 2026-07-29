import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import useAuthStore from "./stores/authStore.js";
import { getMe } from "./features/auth/authApi.js";

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        if (!accessToken) {
          return;
        }

        const response = await getMe();

        setAuth({
          user: response.data.data.user,
          accessToken,
        });
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
        clearAuth();
      } finally {
        setHydrated(true);
      }
    }

    bootstrapAuth();
  }, [accessToken, setAuth, clearAuth, setHydrated]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;