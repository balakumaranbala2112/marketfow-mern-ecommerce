import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import routePaths from "../../routes/routePaths.js";
import { fallbackCategories } from "../../data/homeData.js";

function CategorySection({ categories }) {
  const hasApiCategories = categories && categories.length > 0;

  return (
    <section className="home-section border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
          Shop by category
        </h2>
        <div className="flex items-center justify-start gap-6 overflow-x-auto pb-2 scrollbar-none sm:justify-center sm:gap-8 md:gap-12">
          {hasApiCategories
            ? categories.slice(0, 6).map((cat, index) => (
                <Link
                  key={cat._id}
                  to={`${routePaths.products}?category=${cat._id}`}
                  className="group flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-primary-50 border-2 border-primary-100 transition-all duration-300 group-hover:bg-primary-100 group-hover:border-primary-200 group-hover:shadow-lg group-hover:shadow-primary-200/50 group-hover:scale-110">
                    {cat.image?.url ? (
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full"
                      />
                    ) : (
                      <ShoppingBag size={24} className="text-primary-500" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary-700 transition-colors whitespace-nowrap">
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
                  <div className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-primary-50 border-2 border-primary-100 transition-all duration-300 group-hover:bg-primary-100 group-hover:border-primary-200 group-hover:shadow-lg group-hover:shadow-primary-200/50 group-hover:scale-110">
                    <span className="text-2xl sm:text-[28px] select-none transition-transform duration-300 group-hover:scale-110">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary-700 transition-colors whitespace-nowrap">
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
