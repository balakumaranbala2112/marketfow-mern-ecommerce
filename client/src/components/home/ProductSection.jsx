import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard.jsx";

function ProductSection({ label, title, subtitle, linkText, linkTo, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="home-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {linkText && linkTo && (
            <Link
              to={linkTo}
              className="group flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              {linkText}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
