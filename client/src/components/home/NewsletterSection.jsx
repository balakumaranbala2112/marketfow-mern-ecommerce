import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Gift,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const successTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      return;
    }

    setSubmitted(true);
    setEmail("");

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }

    successTimerRef.current = window.setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  }

  return (
    <section
      className="home-section relative overflow-hidden"
      aria-labelledby="newsletter-section-title"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-primary-800 bg-primary-950 shadow-[0_32px_85px_-45px_rgba(20,34,49,0.95)] sm:rounded-[2rem]">
          {/* Decorative atmosphere */}
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary-500/25 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(to_right,black,transparent)]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-6 top-5 hidden text-white/[0.055] lg:block xl:right-10 xl:top-8"
            aria-hidden="true"
          >
            <Gift size={150} strokeWidth={0.8} />
          </div>

          <div className="relative z-10 grid gap-9 px-6 py-9 sm:px-9 sm:py-11 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14 xl:px-16">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-300/25 bg-accent-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-accent-200 sm:text-[11px]">
                <Sparkles size={13} aria-hidden="true" />
                Member-only benefits
              </div>

              <h2
                id="newsletter-section-title"
                className="mt-5 max-w-xl text-2xl font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-4xl"
              >
                Join the MarketFlow Club
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-200 sm:text-base sm:leading-7">
                Receive selected offers, product updates, and early access to
                new collections directly in your inbox.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-primary-200 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-accent-300"
                    aria-hidden="true"
                  />
                  No spam
                </span>

                <span className="inline-flex items-center gap-2">
                  <Mail
                    size={16}
                    className="text-accent-300"
                    aria-hidden="true"
                  />
                  Unsubscribe anytime
                </span>
              </div>
            </div>

            {/* Form / success state */}
            <div className="w-full lg:justify-self-end">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-5">
                {submitted ? (
                  <div
                    className="flex min-h-[76px] items-center gap-3 rounded-xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-4 text-white animate-fade-in sm:px-5"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-300">
                      <CheckCircle size={21} aria-hidden="true" />
                    </span>

                    <div>
                      <p className="text-sm font-extrabold sm:text-base">
                        Welcome to MarketFlow Club
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-primary-200 sm:text-sm">
                        Your email has been added successfully.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label
                      htmlFor="marketflow-newsletter-email"
                      className="text-xs font-bold text-primary-100 sm:text-sm"
                    >
                      Email address
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative min-w-0 flex-1">
                        <Mail
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-400"
                          aria-hidden="true"
                        />

                        <input
                          id="marketflow-newsletter-email"
                          type="email"
                          name="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          inputMode="email"
                          required
                          className="min-h-12 w-full min-w-0 rounded-xl border border-white/15 bg-white/95 py-3 pl-11 pr-4 text-sm font-medium text-primary-950 placeholder:text-primary-400 transition duration-200 focus:border-accent-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(53,196,172,0.15)]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 text-sm font-extrabold text-primary-950 shadow-[0_14px_35px_-16px_rgba(53,196,172,0.95)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent-300 hover:shadow-[0_18px_42px_-16px_rgba(53,196,172,0.95)] active:translate-y-0 sm:px-7"
                      >
                        Join now
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <p className="text-[11px] leading-5 text-primary-300 sm:text-xs">
                      By joining, you agree to receive MarketFlow promotional
                      emails.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
