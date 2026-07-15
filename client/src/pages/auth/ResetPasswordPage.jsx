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
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset password</h1>
          <p className="mt-1.5 text-sm text-slate-500">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
