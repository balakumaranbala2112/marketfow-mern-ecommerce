import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { UserPlus, Eye, EyeOff } from "lucide-react";

import { useRegister } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    registerMutation.mutate(data, {
      onSuccess: (res) => {
        const { user, accessToken } = res.data.data;
        setAuth({ user, accessToken });
        addToast({ type: "success", message: `Welcome, ${user.name}! Account created.` });
        navigate(routePaths.home, { replace: true });
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Registration failed" });
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <UserPlus className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Join MarketFlow and start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Full name"
            id="register-name"
            placeholder="John Doe"
            register={register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
            error={errors.name?.message}
          />

          <FormInput
            label="Email address"
            id="register-email"
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
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
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

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to={routePaths.login} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
