import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Zap } from "lucide-react";
import { getFlashSaleEndTime } from "../../data/homeData.js";
import routePaths from "../../routes/routePaths.js";

function FlashSaleStrip() {
  const endTimeRef = useRef(getFlashSaleEndTime());
  const [timeLeft, setTimeLeft] = useState(getRemaining(endTimeRef.current));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemaining(endTimeRef.current));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 md:p-8 shadow-2xl">
        {/* Subtle Decorative */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-1/4 -bottom-12 h-32 w-32 rounded-full bg-slate-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: label + heading */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700/50 shadow-inner">
              <Zap size={24} className="text-orange-400 fill-orange-400/20" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Flash Sale
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">Ends very soon.</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <TimeBlock value={timeLeft.hours} label="Hrs" />
            <span className="text-2xl font-black text-slate-700">:</span>
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <span className="text-2xl font-black text-slate-700">:</span>
            <TimeBlock value={timeLeft.seconds} label="Sec" />
          </div>

          {/* CTA */}
          <Link
            to={routePaths.products}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-xl font-extrabold text-white backdrop-blur-sm border border-white/30">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-bold text-orange-100 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function getRemaining(endTime) {
  const now = Date.now();
  const diff = Math.max(0, endTime - now);
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default FlashSaleStrip;
