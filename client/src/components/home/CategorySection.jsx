import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import routePaths from "../../routes/routePaths.js";
import { fallbackCategories } from "../../data/homeData.js";

function CategorySection({ categories }) {
  // Use API categories if available, otherwise use fallback mock data
  const hasApiCategories = categories && categories.length > 0;

  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Browse
            </span>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              Shop by Category
            </h2>
          </div>
          <Link
            to={routePaths.products}
            className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View All{" "}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Category cards — horizontal scroll on mobile, circular avatar layout */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none lg:grid lg:grid-cols-6 lg:overflow-visible justify-start lg:justify-items-center">
          {hasApiCategories
            ? categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat._id}
                  to={`${routePaths.products}?category=${cat._id}`}
                  className="group flex-shrink-0 w-[90px] sm:w-[110px] lg:w-auto flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                    {cat.image?.url ? (
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-600">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm font-bold text-slate-750 group-hover:text-indigo-600 transition-colors truncate w-full">
                    {cat.name}
                  </p>
                  {cat.productCount != null && (
                    <p className="text-[10px] sm:text-xs text-slate-450 font-medium mt-0.5">
                      {cat.productCount} items
                    </p>
                  )}
                </Link>
              ))
            : fallbackCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`${routePaths.products}?search=${cat.searchParam}`}
                  className="group flex-shrink-0 w-[90px] sm:w-[110px] lg:w-auto flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110 select-none">
                      {cat.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm font-bold text-slate-750 group-hover:text-indigo-600 transition-colors truncate w-full">
                    {cat.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-450 font-medium mt-0.5">
                    {cat.itemCount} items
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
