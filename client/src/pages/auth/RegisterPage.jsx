import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { UserPlus, Eye, EyeOff } from "lucide-react";

import { useRegister } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";
import Button from "../../components/common/Button.jsx";
import AuthCard from "../../features/auth/components/AuthCard.jsx";

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
        addToast({
          type: "success",
          message: `Welcome, ${user.name}! Account created.`,
        });
        navigate(routePaths.home, { replace: true });
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message || "Registration failed" });
      },
    });
  };

  return (
    <AuthCard
      icon={UserPlus}
      title="Create account"
      subtitle="Join MarketFlow and start shopping"
      footer={
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to={routePaths.login}
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            className="absolute right-3.5 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;
