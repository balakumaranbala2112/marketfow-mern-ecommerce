import { Link } from "react-router";
import { ArrowRight, Zap, Tag } from "lucide-react";
import routePaths from "../../routes/routePaths.js";

function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-6 md:p-8 shadow-md">
        {/* Decorative shapes */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-orange-400/20 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-300 fill-yellow-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Limited Time Offer
              </span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Get Flat ₹500 Off on Your First Order
            </h2>
            <p className="mt-1 text-sm text-indigo-200 max-w-md">
              Sign up and apply coupon at checkout. No minimum order value required.
            </p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 border border-white/30 px-3 py-1.5 text-sm font-mono font-extrabold text-white backdrop-blur-sm">
                <Tag size={13} />
                FIRST500
              </span>
              <Link
                to={routePaths.register}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm"
              >
                Start Shopping <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
