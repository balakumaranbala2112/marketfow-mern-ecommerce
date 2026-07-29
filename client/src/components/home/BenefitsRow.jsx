import { Headphones, RotateCcw, ShieldCheck, Users } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Protected checkout experience",
    accentClasses:
      "border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:border-emerald-300 group-hover:bg-emerald-100",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Simple 30-day return process",
    accentClasses:
      "border-accent-200 bg-accent-50 text-accent-700 group-hover:border-accent-300 group-hover:bg-accent-100",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Help when you need it",
    accentClasses:
      "border-sky-200 bg-sky-50 text-sky-700 group-hover:border-sky-300 group-hover:bg-sky-100",
  },
  {
    icon: Users,
    title: "Trusted Shopping",
    description: "Built for confident purchases",
    accentClasses:
      "border-amber-200 bg-amber-50 text-amber-700 group-hover:border-amber-300 group-hover:bg-amber-100",
  },
];

function BenefitsRow() {
  return (
    <section
      className="relative overflow-hidden border-t border-border bg-white/90 py-8 backdrop-blur-sm sm:py-10"
      aria-label="MarketFlow shopping benefits"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-50/50 via-transparent to-accent-50/45"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group flex min-h-[96px] items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4 shadow-[0_14px_38px_-32px_rgba(20,34,49,0.7)] transition duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-[0_22px_48px_-32px_rgba(16,131,113,0.45)] sm:px-5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition duration-300 group-hover:scale-105 ${benefit.accentClasses}`}
                >
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold tracking-[-0.015em] text-primary-950 sm:text-[15px]">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-text-muted sm:text-[13px]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BenefitsRow;
