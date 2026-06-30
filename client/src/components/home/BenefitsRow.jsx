import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const iconMap = { Truck, Shield, RotateCcw, Headphones };

const benefits = [
  { icon: "Truck", title: "Free Delivery", desc: "On orders over ₹999", color: "text-indigo-600 bg-indigo-50" },
  { icon: "Shield", title: "Secure Payments", desc: "100% protected", color: "text-green-600 bg-green-50" },
  { icon: "RotateCcw", title: "Easy Returns", desc: "7-day return policy", color: "text-orange-600 bg-orange-50" },
  { icon: "Headphones", title: "24/7 Support", desc: "Dedicated helpdesk", color: "text-purple-600 bg-purple-50" },
];

function BenefitsRow() {
  return (
    <section className="border-y border-slate-200/70 bg-white py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {benefits.map((b) => {
            const Icon = iconMap[b.icon];
            return (
              <div
                key={b.title}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition-all hover:shadow-sm"
              >
                <div className={`shrink-0 rounded-lg p-2.5 ${b.color}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{b.title}</h4>
                  <p className="text-[11px] text-slate-500">{b.desc}</p>
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
