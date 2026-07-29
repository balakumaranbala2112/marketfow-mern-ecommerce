import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Mail,
  ShoppingBag,
} from "lucide-react";

import { useForgotPassword } from "../../features/auth/hooks/useAuth.js";

import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

function ForgotPasswordPage() {
  const addToast = useToastStore((state) => state.addToast);
  const forgotMutation = useForgotPassword();

  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data) {
    const normalizedEmail = data.email.trim().toLowerCase();

    forgotMutation.mutate(
      {
        email: normalizedEmail,
      },
      {
        onSuccess: (response) => {
          addToast({
            type: "success",
            message: response.data.message,
          });

          setSubmittedEmail(normalizedEmail);
          reset();
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

  function requestAnotherLink() {
    setSubmittedEmail("");
  }

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
          {submittedEmail ? (
            <SuccessState email={submittedEmail} onReset={requestAnotherLink} />
          ) : (
            <>
              <div className="border-b border-border pb-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-950 text-accent-300">
                  <KeyRound size={23} aria-hidden="true" />
                </span>

                <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-primary-950 sm:text-3xl">
                  Forgot your password?
                </h1>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Enter the email address connected to your MarketFlow account.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="mb-1.5 block text-sm font-semibold text-primary-950"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                      aria-hidden="true"
                    />

                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      className={`min-h-[46px] w-full rounded-md border bg-white py-2.5 pl-10 pr-3 text-sm text-text outline-none placeholder:text-text-soft ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                          : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                      }`}
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                  </div>

                  {errors.email && (
                    <p
                      className="mt-1.5 text-xs font-medium text-red-600"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="rounded-md border border-border bg-surface-subtle px-3.5 py-3">
                  <p className="text-xs leading-5 text-text-muted">
                    For account security, the response may not confirm whether
                    an email address is registered.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forgotMutation.isPending ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Sending reset link
                    </>
                  ) : (
                    <>
                      <Mail size={17} aria-hidden="true" />
                      Send reset link
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
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function SuccessState({ email, onReset }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
        <CheckCircle2 size={26} aria-hidden="true" />
      </span>

      <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-primary-950">
        Check your email
      </h1>

      <p className="mt-2 text-sm leading-6 text-text-muted">
        A password-reset request was submitted for{" "}
        <strong className="font-bold text-primary-950">{email}</strong>.
      </p>

      <p className="mt-3 text-xs leading-5 text-text-soft">
        Open the message and follow the link to create a new password.
      </p>

      <Link
        to={routePaths.login}
        className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300"
      >
        Return to sign in
      </Link>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 inline-flex min-h-[42px] items-center justify-center text-sm font-bold text-blue-700 transition hover:text-blue-800 hover:underline"
      >
        Use a different email
      </button>
    </div>
  );
}

export default ForgotPasswordPage;
