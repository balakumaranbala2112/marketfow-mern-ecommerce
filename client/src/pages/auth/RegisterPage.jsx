import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Gift,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useRegister } from "../../features/auth/hooks/useAuth.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

const memberBenefits = [
  {
    icon: Heart,
    title: "Save favourites",
    description: "Build a wishlist across devices",
  },
  {
    icon: PackageCheck,
    title: "Track orders",
    description: "View order and delivery progress",
  },
  {
    icon: Gift,
    title: "Discover offers",
    description: "Access relevant shopping promotions",
  },
];

function RegisterPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useToastStore((state) => state.addToast);

  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data) {
    registerMutation.mutate(data, {
      onSuccess: (response) => {
        const { user, accessToken } = response.data.data;

        setAuth({
          user,
          accessToken,
        });

        addToast({
          type: "success",
          message: `Welcome, ${user.name}! Account created.`,
        });

        navigate(routePaths.home, {
          replace: true,
        });
      },

      onError: (error) => {
        addToast({
          type: "error",
          message: error.message || "Registration failed",
        });
      },
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary-950">
      <div
        className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-primary-500/25 blur-3xl"
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
              Built around your shopping
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white xl:text-6xl">
              Create one account for a smoother buying journey.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-primary-200 xl:text-lg">
              Save products, review orders, and keep your MarketFlow experience
              connected from discovery to delivery.
            </p>

            <div className="mt-10 space-y-4">
              {memberBenefits.map((item) => {
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
            MarketFlow member experience
          </p>
        </section>

        <section className="flex min-h-screen w-full items-center justify-center bg-surface-muted px-4 py-6 sm:px-6 lg:w-[54%] lg:rounded-l-[2.5rem] lg:px-10 xl:px-16">
          <div className="w-full max-w-[540px]">
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
                New member
              </span>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_30px_80px_-50px_rgba(20,34,49,0.7)] sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-700 sm:text-[11px]">
                  <UserRound size={13} aria-hidden="true" />
                  Create your profile
                </span>

                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-primary-950 sm:text-4xl">
                  Join MarketFlow
                </h2>

                <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
                  Create your account and keep your shopping activity in one
                  place.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-5"
                noValidate
              >
                <Field
                  label="Full name"
                  id="register-name"
                  icon={UserRound}
                  error={errors.name?.message}
                >
                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    disabled={registerMutation.isPending}
                    className={getInputClass(Boolean(errors.name))}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must contain at least 2 characters",
                      },
                      maxLength: {
                        value: 80,
                        message: "Name must not exceed 80 characters",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Email address"
                  id="register-email"
                  icon={Mail}
                  error={errors.email?.message}
                >
                  <input
                    id="register-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={registerMutation.isPending}
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
                  id="register-password"
                  icon={LockKeyhole}
                  error={errors.password?.message}
                >
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Use at least 6 characters"
                    disabled={registerMutation.isPending}
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
                    disabled={registerMutation.isPending}
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

                <div className="grid gap-2 sm:grid-cols-2">
                  <Requirement text="At least 6 characters" />
                  <Requirement text="Use a unique password" />
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary-950 px-5 text-sm font-extrabold text-white shadow-[0_18px_40px_-20px_rgba(20,34,49,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-900 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {registerMutation.isPending ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
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
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-accent-700"
                  aria-hidden="true"
                />

                <p className="text-xs leading-5 text-primary-700">
                  By creating an account, you agree to use MarketFlow according
                  to its terms and privacy policy.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6 text-center">
                <p className="text-sm text-text-muted">
                  Already have an account?{" "}
                  <Link
                    to={routePaths.login}
                    className="font-extrabold text-accent-700 transition hover:text-accent-800"
                  >
                    Sign in
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

function Field({ label, id, icon: Icon, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-extrabold text-primary-900"
      >
        {label}
      </label>

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

function Requirement({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50/70 px-3 py-2.5">
      <CheckCircle2
        size={15}
        className="shrink-0 text-accent-700"
        aria-hidden="true"
      />

      <span className="text-[11px] font-semibold text-primary-700">{text}</span>
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

export default RegisterPage;
