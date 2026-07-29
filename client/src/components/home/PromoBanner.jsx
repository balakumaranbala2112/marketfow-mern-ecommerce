import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Clock3, Sparkles, Truck, Zap } from "lucide-react";

import { getFlashSaleEndTime, promoBanners } from "../../data/homeData.js";

function PromoBanner() {
  const endTimeRef = useRef(getFlashSaleEndTime());

  const [timeLeft, setTimeLeft] = useState(() =>
    getRemaining(endTimeRef.current),
  );

  const flashSale = promoBanners[0];
  const shippingOffer = promoBanners[1];
  const newArrivals = promoBanners[2];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(getRemaining(endTimeRef.current));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section
      className="home-section relative overflow-hidden"
      aria-labelledby="promotion-section-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/35 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-700 sm:text-[11px]">
            <Sparkles size={13} aria-hidden="true" />
            Limited-time benefits
          </span>

          <h2
            id="promotion-section-title"
            className="mt-3 text-xl font-extrabold tracking-[-0.025em] text-primary-950 sm:text-2xl lg:text-3xl"
          >
            More value on every order
          </h2>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-muted sm:text-base">
            Explore current offers, delivery benefits, and newly added
            collections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_0.85fr] lg:gap-5">
          {/* Flash sale */}
          <Link
            to={flashSale.ctaLink}
            className="group relative isolate min-h-[320px] overflow-hidden rounded-[1.5rem] border border-primary-800 bg-primary-950 p-6 shadow-[0_28px_70px_-40px_rgba(20,34,49,0.95)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_80px_-38px_rgba(20,34,49,0.95)] sm:min-h-[350px] sm:p-8 lg:min-h-[420px] lg:p-10"
            aria-label={`${flashSale.title}. ${flashSale.subtitle}`}
          >
            {/* Decorative lighting */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl transition-transform duration-700 group-hover:scale-110"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-200 sm:text-xs">
                  <Zap
                    size={14}
                    className="fill-amber-300/40"
                    aria-hidden="true"
                  />
                  Flash sale
                </div>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-accent-200 backdrop-blur-sm transition duration-300 group-hover:border-accent-300/30 group-hover:bg-accent-400/15">
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="mt-8 max-w-xl sm:mt-10">
                <h3 className="text-3xl font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                  {flashSale.title}
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-6 text-primary-200 sm:text-base sm:leading-7">
                  {flashSale.subtitle}
                </p>
              </div>

              <div className="mt-auto pt-8 sm:pt-10">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary-300">
                  <Clock3 size={15} aria-hidden="true" />
                  Offer ends in
                </div>

                <div
                  className="flex items-center gap-2 sm:gap-3"
                  aria-label={`Offer ends in ${timeLeft.hours} hours, ${timeLeft.minutes} minutes and ${timeLeft.seconds} seconds`}
                >
                  <TimeBlock value={timeLeft.hours} label="Hours" />

                  <span
                    className="pb-5 text-xl font-bold text-primary-500 sm:text-2xl"
                    aria-hidden="true"
                  >
                    :
                  </span>

                  <TimeBlock value={timeLeft.minutes} label="Minutes" />

                  <span
                    className="pb-5 text-xl font-bold text-primary-500 sm:text-2xl"
                    aria-hidden="true"
                  >
                    :
                  </span>

                  <TimeBlock value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer"
              aria-hidden="true"
            />
          </Link>

          {/* Right-side offer cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <OfferCard
              banner={shippingOffer}
              icon={Truck}
              eyebrow="Delivery benefit"
              accent="teal"
            />

            <OfferCard
              banner={newArrivals}
              icon={Sparkles}
              eyebrow="Just added"
              accent="navy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ banner, icon: Icon, eyebrow, accent }) {
  const isTeal = accent === "teal";

  return (
    <Link
      to={banner.ctaLink}
      className="group relative isolate min-h-[220px] overflow-hidden rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_18px_50px_-38px_rgba(20,34,49,0.8)] transition duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_28px_65px_-38px_rgba(16,131,113,0.55)] sm:p-7 lg:min-h-0"
      aria-label={`${banner.title}. ${banner.subtitle}`}
    >
      <div
        className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${
          isTeal ? "bg-accent-200/55" : "bg-primary-200/55"
        }`}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary-50/65 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition duration-300 group-hover:scale-105 ${
              isTeal
                ? "border-accent-200 bg-accent-50 text-accent-700"
                : "border-primary-200 bg-primary-50 text-primary-700"
            }`}
          >
            <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-500 transition duration-300 group-hover:border-accent-200 group-hover:bg-accent-50 group-hover:text-accent-700">
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="mt-6">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-[0.16em] ${
              isTeal ? "text-accent-700" : "text-primary-600"
            }`}
          >
            {eyebrow}
          </span>

          <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.025em] text-primary-950 sm:text-2xl">
            {banner.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            {banner.subtitle}
          </p>
        </div>

        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-accent-700">
          {banner.cta}

          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] px-2 text-lg font-extrabold tabular-nums text-white shadow-inner backdrop-blur-md sm:h-14 sm:min-w-14 sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>

      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary-300 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function getRemaining(endTime) {
  const now = Date.now();
  const difference = Math.max(0, endTime - now);

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default PromoBanner;
