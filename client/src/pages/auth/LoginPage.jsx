import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { LogIn, Eye, EyeOff } from "lucide-react";

import { useLogin } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || routePaths.home;

  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);
  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        const { user, accessToken } = res.data.data;
        setAuth({ user, accessToken });
        addToast({ type: "success", message: `Welcome back, ${user.name}!` });
        navigate(from, { replace: true });
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Login failed" });
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <LogIn className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to your MarketFlow account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email address"
            id="login-email"
            type="email"
            placeholder="you@example.com"
            register={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            error={errors.email?.message}
          />

          <div className="relative">
            <FormInput
              label="Password"
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link to={routePaths.forgotPassword} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to={routePaths.register} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
