import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";

import { useResetPassword } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";

function ResetPasswordPage() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useToastStore((s) => s.addToast);
  const resetMutation = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    resetMutation.mutate(
      { resetToken, password: data.password, confirmPassword: data.confirmPassword },
      {
        onSuccess: (res) => {
          const { user, accessToken } = res.data.data;
          setAuth({ user, accessToken });
          addToast({ type: "success", message: "Password reset successful!" });
          navigate(routePaths.home, { replace: true });
        },
        onError: (err) => {
          addToast({ type: "error", message: err.message });
        },
      },
    );
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="animate-fade-in w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl shadow-gray-900/5">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="New password"
              id="reset-password"
              type="password"
              placeholder="At least 8 characters"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
              error={errors.password?.message}
            />

            <FormInput
              label="Confirm password"
              id="reset-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              register={register("confirmPassword", {
                required: "Confirm password is required",
              })}
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resetMutation.isPending ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
