import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";

import { useForgotPassword } from "../../features/auth/hooks/useAuth.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import FormInput from "../../components/common/FormInput.jsx";

function ForgotPasswordPage() {
  const addToast = useToastStore((s) => s.addToast);
  const forgotMutation = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    forgotMutation.mutate(data, {
      onSuccess: (res) => {
        addToast({ type: "success", message: res.data.message });
      },
      onError: (err) => {
        addToast({ type: "error", message: err.message });
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
            <KeyRound className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forgot password?</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email address"
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            register={register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            error={errors.email?.message}
          />

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {forgotMutation.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to={routePaths.login} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
