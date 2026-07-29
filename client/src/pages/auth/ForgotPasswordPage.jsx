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
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="animate-fade-in w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl shadow-gray-900/5">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <KeyRound className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email and we&apos;ll send a reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {forgotMutation.isPending ? "Sending…" : "Send reset link"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            <Link
              to={routePaths.login}
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
