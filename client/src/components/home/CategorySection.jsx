import { Link } from "react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";

import routePaths from "../../routes/routePaths.js";
import { fallbackCategories } from "../../data/homeData.js";

function CategorySection({ categories }) {
  const hasApiCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <section
      className="home-section relative overflow-hidden"
      aria-labelledby="category-section-title"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <span className="inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-700 sm:text-[11px]">
              Browse departments
            </span>

            <h2
              id="category-section-title"
              className="mt-3 text-xl font-extrabold tracking-[-0.025em] text-primary-950 sm:text-2xl lg:text-3xl"
            >
              Shop by category
            </h2>

            <p className="mt-1.5 hidden max-w-lg text-sm leading-6 text-text-muted sm:block">
              Find products quickly by exploring our most popular departments.
            </p>
          </div>

          <Link
            to={routePaths.products}
            className="group hidden min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-accent-700 transition-colors hover:bg-accent-50 hover:text-accent-800 sm:inline-flex"
          >
            View all
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Mobile horizontal category list */}
        <div className="-mx-4 overflow-hidden sm:-mx-6 lg:mx-0">
          <div className="scrollbar-none flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-4 pb-3 sm:gap-4 sm:px-6 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 lg:pb-0">
            {hasApiCategories
              ? categories.slice(0, 6).map((category, index) => (
                  <Link
                    key={category._id}
                    to={`${routePaths.products}?category=${category._id}`}
                    className="group flex min-w-[116px] snap-start flex-col rounded-2xl border border-border bg-white p-3 shadow-[0_12px_35px_-28px_rgba(20,34,49,0.6)] transition duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_22px_48px_-30px_rgba(16,131,113,0.55)] sm:min-w-[140px] sm:p-4 lg:min-w-0 animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.06}s`,
                    }}
                    aria-label={`Shop ${category.name}`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                      {category.image?.url ? (
                        <>
                          <img
                            src={category.image.url}
                            alt={category.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/20 via-transparent to-transparent"
                            aria-hidden="true"
                          />
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-200 bg-white text-accent-700 shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-accent-50 sm:h-14 sm:w-14">
                            <ShoppingBag
                              size={25}
                              strokeWidth={1.7}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex min-h-10 items-center justify-between gap-2">
                      <span className="line-clamp-2 text-xs font-bold leading-5 text-primary-900 transition-colors group-hover:text-accent-700 sm:text-sm">
                        {category.name}
                      </span>

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 transition duration-200 group-hover:bg-accent-100 group-hover:text-accent-700">
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))
              : fallbackCategories.slice(0, 6).map((category, index) => (
                  <Link
                    key={category.name}
                    to={
                      category.searchParam
                        ? `${routePaths.products}?search=${category.searchParam}`
                        : routePaths.products
                    }
                    className="group flex min-w-[116px] snap-start flex-col rounded-2xl border border-border bg-white p-3 shadow-[0_12px_35px_-28px_rgba(20,34,49,0.6)] transition duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_22px_48px_-30px_rgba(16,131,113,0.55)] sm:min-w-[140px] sm:p-4 lg:min-w-0 animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.06}s`,
                    }}
                    aria-label={`Shop ${category.name}`}
                  >
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-accent-50">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-3xl shadow-[0_12px_28px_-18px_rgba(20,34,49,0.7)] transition duration-300 group-hover:scale-110 group-hover:rotate-2 sm:h-16 sm:w-16 sm:text-[2rem]">
                        <span
                          className="select-none"
                          role="img"
                          aria-hidden="true"
                        >
                          {category.icon}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex min-h-10 items-center justify-between gap-2">
                      <span className="line-clamp-2 text-xs font-bold leading-5 text-primary-900 transition-colors group-hover:text-accent-700 sm:text-sm">
                        {category.name}
                      </span>

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 transition duration-200 group-hover:bg-accent-100 group-hover:text-accent-700">
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* Mobile view-all action */}
        <Link
          to={routePaths.products}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 text-sm font-bold text-primary-800 shadow-sm transition hover:border-accent-300 hover:bg-accent-50 hover:text-accent-800 sm:hidden"
        >
          View all categories
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default CategorySection;
