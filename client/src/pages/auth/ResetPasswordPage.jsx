import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { useResetPassword } from "../../features/auth/hooks/useAuth.js";

import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";

import routePaths from "../../routes/routePaths.js";

function ResetPasswordPage() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useToastStore((state) => state.addToast);

  const resetMutation = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  function onSubmit(data) {
    if (!resetToken) {
      addToast({
        type: "error",
        message: "The password reset link is invalid",
      });

      return;
    }

    resetMutation.mutate(
      {
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: (response) => {
          const { user, accessToken } = response.data.data;

          setAuth({
            user,
            accessToken,
          });

          addToast({
            type: "success",
            message: "Password reset successfully",
          });

          navigate(routePaths.home, {
            replace: true,
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      },
    );
  }

  if (!resetToken) {
    return (
      <AuthShell>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <KeyRound size={25} aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-primary-950">
            Invalid reset link
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            This password-reset link is missing its security token.
          </p>

          <Link
            to={routePaths.forgotPassword}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300"
          >
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="border-b border-border pb-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-950 text-accent-300">
          <ShieldCheck size={23} aria-hidden="true" />
        </span>

        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          Choose a password you have not used for another account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
        <PasswordField
          id="reset-password"
          label="New password"
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          error={errors.password?.message}
          autoComplete="new-password"
          register={register("password", {
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must contain at least 8 characters",
            },
          })}
        />

        <PasswordField
          id="reset-confirm-password"
          label="Confirm new password"
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          register={register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <Requirement text="At least 8 characters" />
          <Requirement text="Use a unique password" />
        </div>

        <button
          type="submit"
          disabled={resetMutation.isPending}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resetMutation.isPending ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
              Resetting password
            </>
          ) : (
            <>
              <ShieldCheck size={17} aria-hidden="true" />
              Reset password
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5">
        <Link
          to={routePaths.login}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}

function PasswordField({
  id,
  label,
  visible,
  onToggle,
  error,
  autoComplete,
  register,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-primary-950"
      >
        {label}
      </label>

      <div className="relative">
        <KeyRound
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
          aria-hidden="true"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="At least 8 characters"
          className={`min-h-[46px] w-full rounded-md border bg-white py-2.5 pl-10 pr-12 text-sm text-text outline-none placeholder:text-text-soft ${
            error
              ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
              : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
          }`}
          {...register}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-primary-500 transition hover:bg-primary-50 hover:text-primary-900"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff size={17} aria-hidden="true" />
          ) : (
            <Eye size={17} aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Requirement({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-2.5">
      <CheckCircle2
        size={15}
        className="shrink-0 text-green-700"
        aria-hidden="true"
      />

      <span className="text-xs font-medium text-text-muted">{text}</span>
    </div>
  );
}

function AuthShell({ children }) {
  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="border-b border-primary-800 bg-primary-950">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <Link
            to={routePaths.home}
            className="inline-flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-400 text-primary-950">
              <ShoppingBag size={19} strokeWidth={2.2} aria-hidden="true" />
            </span>

            <span className="text-lg font-extrabold tracking-[-0.025em] text-white">
              MarketFlow
            </span>
          </Link>
        </div>
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-[0_3px_12px_rgba(15,24,32,0.09)] sm:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
