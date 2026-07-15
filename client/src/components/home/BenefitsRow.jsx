import { ShieldCheck, RotateCcw, Headphones, Users } from "lucide-react";

const iconMap = { ShieldCheck, RotateCcw, Headphones, Users };

const benefits = [
  { icon: "ShieldCheck", title: "Secure Payment", desc: "100% secure payment", color: "text-green-600" },
  { icon: "RotateCcw", title: "Easy Returns", desc: "30-day return policy", color: "text-violet-600" },
  { icon: "Headphones", title: "24/7 Support", desc: "Dedicated support", color: "text-blue-600" },
  { icon: "Users", title: "Trusted by Thousands", desc: "4.8 average rating", color: "text-amber-600" },
];

function BenefitsRow() {
  return (
    <section className="bg-white border-t border-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((b) => {
            const Icon = iconMap[b.icon];
            return (
              <div
                key={b.title}
                className="flex items-center gap-3 group transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 ${b.color} transition-colors group-hover:bg-violet-50`}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
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
