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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 p-5 md:p-6 shadow-md">
        {/* Decorative */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="absolute left-1/2 -bottom-6 h-24 w-24 rounded-full bg-white/10 blur-lg" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: label + heading */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white sm:text-xl">
                Flash Sale Ends In
              </h3>
              <p className="text-xs text-orange-100">Limited time deals — don't miss out!</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <TimeBlock value={timeLeft.hours} label="Hrs" />
            <span className="text-xl font-bold text-white/80">:</span>
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <span className="text-xl font-bold text-white/80">:</span>
            <TimeBlock value={timeLeft.seconds} label="Sec" />
          </div>

          {/* CTA */}
          <Link
            to={routePaths.products}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-all shadow-sm whitespace-nowrap"
          >
            Shop Flash Deals <ArrowRight size={14} />
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
