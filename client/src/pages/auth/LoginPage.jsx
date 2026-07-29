import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { useLogin } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Protected access",
    description: "Secure account authentication",
  },
  {
    icon: Truck,
    title: "Order tracking",
    description: "Follow every delivery step",
  },
  {
    icon: PackageCheck,
    title: "Saved shopping",
    description: "Keep carts and wishlists synced",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || routePaths.home;

  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useToastStore((state) => state.addToast);

  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data) {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const { user, accessToken } = response.data.data;

        setAuth({
          user,
          accessToken,
        });

        addToast({
          type: "success",
          message: `Welcome back, ${user.name}!`,
        });

        navigate(from, {
          replace: true,
        });
      },

      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Login failed",
        });
      },
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary-950">
      <div
        className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] items-stretch">
        <section className="hidden w-[46%] flex-col justify-between px-10 py-10 lg:flex xl:px-16 xl:py-14">
          <Link
            to={routePaths.home}
            className="inline-flex w-fit items-center gap-3 rounded-xl focus-visible:outline-offset-4"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-400 text-primary-950 shadow-[0_16px_38px_-18px_rgba(53,196,172,0.95)]">
              <ShoppingBag size={22} strokeWidth={2.2} aria-hidden="true" />
            </span>

            <span className="text-xl font-extrabold tracking-[-0.03em] text-white">
              MarketFlow
            </span>
          </Link>

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/25 bg-accent-400/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-accent-200">
              <Sparkles size={13} aria-hidden="true" />
              Shopping made effortless
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white xl:text-6xl">
              Your account keeps every purchase moving.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-primary-200 xl:text-lg">
              Sign in to manage orders, revisit saved products, and continue
              shopping across devices.
            </p>

            <div className="mt-10 space-y-4">
              {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4 backdrop-blur-sm"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-300/20 bg-accent-400/10 text-accent-200">
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    <div>
                      <h2 className="text-sm font-extrabold text-white">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-primary-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs leading-5 text-primary-400">
            MarketFlow commerce experience
          </p>
        </section>

        <section className="flex min-h-screen w-full items-center justify-center bg-surface-muted px-4 py-6 sm:px-6 lg:w-[54%] lg:rounded-l-[2.5rem] lg:px-10 xl:px-16">
          <div className="w-full max-w-[520px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                to={routePaths.home}
                className="inline-flex items-center gap-2.5 rounded-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-950 text-accent-300">
                  <ShoppingBag size={20} aria-hidden="true" />
                </span>

                <span className="text-lg font-extrabold tracking-[-0.03em] text-primary-950">
                  MarketFlow
                </span>
              </Link>

              <span className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-accent-700">
                Secure login
              </span>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_30px_80px_-50px_rgba(20,34,49,0.7)] sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-700 sm:text-[11px]">
                  <LockKeyhole size={13} aria-hidden="true" />
                  Account access
                </span>

                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-primary-950 sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
                  Enter your details to continue to your MarketFlow account.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-5"
                noValidate
              >
                <Field
                  label="Email address"
                  id="login-email"
                  icon={Mail}
                  error={errors.email?.message}
                >
                  <input
                    id="login-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={loginMutation.isPending}
                    className={getInputClass(Boolean(errors.email))}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Password"
                  id="login-password"
                  icon={LockKeyhole}
                  error={errors.password?.message}
                  action={
                    <Link
                      to={routePaths.forgotPassword}
                      className="text-xs font-bold text-accent-700 transition hover:text-accent-800 sm:text-sm"
                    >
                      Forgot password?
                    </Link>
                  }
                >
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={loginMutation.isPending}
                    className={`${getInputClass(
                      Boolean(errors.password),
                    )} pr-12`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must contain at least 6 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loginMutation.isPending}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-primary-400 transition hover:bg-primary-50 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </Field>

                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary-950 px-5 text-sm font-extrabold text-white shadow-[0_18px_40px_-20px_rgba(20,34,49,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {loginMutation.isPending ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-accent-100 bg-accent-50/70 px-4 py-3.5">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-accent-700"
                  aria-hidden="true"
                />

                <p className="text-xs leading-5 text-primary-700">
                  Your sign-in details are used only to access your MarketFlow
                  account.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6 text-center">
                <p className="text-sm text-text-muted">
                  New to MarketFlow?{" "}
                  <Link
                    to={routePaths.register}
                    className="font-extrabold text-accent-700 transition hover:text-accent-800"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, id, icon: Icon, error, action, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-extrabold text-primary-900">
          {label}
        </label>

        {action}
      </div>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-primary-400"
          aria-hidden="true"
        />

        {children}
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function getInputClass(hasError) {
  return `min-h-13 w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm font-semibold text-primary-950 outline-none transition placeholder:font-medium placeholder:text-primary-300 disabled:cursor-not-allowed disabled:bg-primary-50 ${
    hasError
      ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
      : "border-border focus:border-accent-400 focus:shadow-[0_0_0_4px_rgba(53,196,172,0.13)]"
  }`;
}

export default LoginPage;
