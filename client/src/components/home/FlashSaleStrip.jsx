import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Clock3, ShieldCheck, Zap } from "lucide-react";

import { getFlashSaleEndTime } from "../../data/homeData.js";
import routePaths from "../../routes/routePaths.js";

function FlashSaleStrip() {
  const endTimeRef = useRef(getFlashSaleEndTime());

  const [timeLeft, setTimeLeft] = useState(() =>
    getRemaining(endTimeRef.current),
  );

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
      className="relative py-8 sm:py-10"
      aria-labelledby="flash-sale-strip-title"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-primary-800 bg-primary-950 shadow-[0_28px_75px_-42px_rgba(20,34,49,0.95)] sm:rounded-[2rem]">
          {/* Decorative atmosphere */}
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-accent-400/15 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:linear-gradient(to_right,black,transparent)]"
            aria-hidden="true"
          />

          <div className="relative z-10 grid gap-7 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-9 lg:px-10 lg:py-9">
            {/* Sale information */}
            <div className="flex min-w-0 items-start gap-4 sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300 shadow-inner sm:h-14 sm:w-14">
                <Zap
                  size={24}
                  className="fill-amber-300/25"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300 sm:text-[11px]">
                  <Clock3 size={13} aria-hidden="true" />
                  Limited-time offer
                </div>

                <h2
                  id="flash-sale-strip-title"
                  className="mt-1.5 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl lg:text-3xl"
                >
                  Flash Sale
                </h2>

                <p className="mt-1 text-sm leading-6 text-primary-200">
                  Selected deals end when the countdown reaches zero.
                </p>
              </div>
            </div>

            {/* Countdown */}
            <div>
              <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-primary-300 lg:text-left">
                Offer ends in
              </p>

              <div
                className="flex items-center justify-center gap-2 sm:gap-3"
                aria-label={`Offer ends in ${timeLeft.hours} hours, ${timeLeft.minutes} minutes and ${timeLeft.seconds} seconds`}
              >
                <TimeBlock value={timeLeft.hours} label="Hours" />

                <Separator />

                <TimeBlock value={timeLeft.minutes} label="Minutes" />

                <Separator />

                <TimeBlock value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-3 lg:min-w-[190px]">
              <Link
                to={routePaths.products}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-400 px-6 text-sm font-extrabold text-primary-950 shadow-[0_14px_35px_-16px_rgba(53,196,172,0.95)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent-300 hover:shadow-[0_18px_42px_-16px_rgba(53,196,172,0.95)] active:translate-y-0"
              >
                Shop the sale
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>

              <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold text-primary-300 sm:text-[11px]">
                <ShieldCheck
                  size={13}
                  className="text-accent-300"
                  aria-hidden="true"
                />
                Secure MarketFlow checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] px-2 text-lg font-extrabold tabular-nums text-white shadow-inner backdrop-blur-md sm:h-14 sm:min-w-14 sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>

      <span className="max-w-14 truncate text-[8px] font-bold uppercase tracking-[0.1em] text-primary-300 sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span
      className="pb-5 text-xl font-black text-primary-600 sm:text-2xl"
      aria-hidden="true"
    >
      :
    </span>
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

export default FlashSaleStrip;
