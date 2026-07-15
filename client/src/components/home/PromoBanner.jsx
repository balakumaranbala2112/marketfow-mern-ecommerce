import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Truck, Sparkles, ArrowRight, Zap } from "lucide-react";
import { promoBanners, getFlashSaleEndTime } from "../../data/homeData.js";
import routePaths from "../../routes/routePaths.js";

function PromoBanner() {
  const endTimeRef = useRef(getFlashSaleEndTime());
  const [timeLeft, setTimeLeft] = useState(getRemaining(endTimeRef.current));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemaining(endTimeRef.current));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="home-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Flash Sale Card */}
          <Link
            to={promoBanners[0].ctaLink}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 p-6 text-white shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Decorative blurs */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-400/20 blur-xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Zap size={16} className="text-yellow-300 fill-yellow-300/50" />
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  {promoBanners[0].title}
                </h3>
              </div>
              <p className="text-sm text-purple-100 mb-4">
                {promoBanners[0].subtitle}
              </p>

              {/* Countdown */}
              <div className="flex items-center gap-2">
                <TimeBlock value={timeLeft.hours} label="h" />
                <span className="text-lg font-bold text-purple-200">:</span>
                <TimeBlock value={timeLeft.minutes} label="m" />
                <span className="text-lg font-bold text-purple-200">:</span>
                <TimeBlock value={timeLeft.seconds} label="s" />
              </div>
            </div>

            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
          </Link>

          {/* Free Shipping Card */}
          <Link
            to={promoBanners[1].ctaLink}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-violet-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {promoBanners[1].title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {promoBanners[1].subtitle}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 group-hover:gap-2 transition-all">
              {promoBanners[1].cta}
            </span>

            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-violet-50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* New Arrivals Card */}
          <Link
            to={promoBanners[2].ctaLink}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-violet-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {promoBanners[2].title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {promoBanners[2].subtitle}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 group-hover:gap-2 transition-all">
              {promoBanners[2].cta}
            </span>

            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-violet-50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-base font-extrabold text-white backdrop-blur-sm border border-white/20">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold text-purple-200 uppercase">
        {label}
      </span>
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

export default PromoBanner;
