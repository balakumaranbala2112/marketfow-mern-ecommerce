import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import routePaths from "../../routes/routePaths.js";
import { fallbackCategories } from "../../data/homeData.js";

function CategorySection({ categories }) {
  // Use API categories if available, otherwise use fallback mock data
  const hasApiCategories = categories && categories.length > 0;

  return (
    <section className="home-section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Circular Category Icons */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 overflow-x-auto pb-2 scrollbar-none">
          {hasApiCategories
            ? categories.slice(0, 6).map((cat, index) => (
                <Link
                  key={cat._id}
                  to={`${routePaths.products}?category=${cat._id}`}
                  className="group flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-violet-50 border-2 border-violet-100 transition-all duration-300 group-hover:bg-violet-100 group-hover:border-violet-200 group-hover:shadow-lg group-hover:shadow-violet-200/50 group-hover:scale-110">
                    {cat.image?.url ? (
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full"
                      />
                    ) : (
                      <ShoppingBag size={24} className="text-violet-500" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-violet-700 transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </Link>
              ))
            : fallbackCategories.map((cat, index) => (
                <Link
                  key={cat.name}
                  to={cat.searchParam ? `${routePaths.products}?search=${cat.searchParam}` : routePaths.products}
                  className="group flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-violet-50 border-2 border-violet-100 transition-all duration-300 group-hover:bg-violet-100 group-hover:border-violet-200 group-hover:shadow-lg group-hover:shadow-violet-200/50 group-hover:scale-110">
                    <span className="text-2xl sm:text-[28px] select-none transition-transform duration-300 group-hover:scale-110">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-violet-700 transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
