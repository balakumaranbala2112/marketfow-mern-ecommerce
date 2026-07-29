import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";

import { useLogin } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";
import Button from "../../components/common/Button.jsx";
import AuthCard from "../../features/auth/components/AuthCard.jsx";

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
    <AuthCard
      icon={LogIn}
      title="Welcome back"
      subtitle="Sign in to your MarketFlow account"
      footer={
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to={routePaths.register}
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            className="absolute right-3.5 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link
            to={routePaths.forgotPassword}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default LoginPage;
