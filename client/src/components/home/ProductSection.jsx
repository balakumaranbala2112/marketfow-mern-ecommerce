import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard.jsx";

function ProductSection({ label, title, subtitle, linkText, linkTo, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {label}
            </span>
            <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {linkText && linkTo && (
            <Link
              to={linkTo}
              className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {linkText}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
