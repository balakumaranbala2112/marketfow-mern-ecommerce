import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ProductCard from "../../components/home/ProductCard.jsx";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const isFeatured = searchParams.get("isFeatured") || "";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (!showFilters) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showFilters]);

  const requestParams = {
    page,
    limit: 12,
    isActive: "true",
  };

  if (search) {
    requestParams.search = search;
  }

  if (category) {
    requestParams.category = category;
  }

  if (minPrice) {
    requestParams.minPrice = minPrice;
  }

  if (maxPrice) {
    requestParams.maxPrice = maxPrice;
  }

  if (isFeatured) {
    requestParams.isFeatured = isFeatured;
  }

  if (sort) {
    if (sort.startsWith("-")) {
      requestParams.sort = sort.slice(1);
      requestParams.order = "desc";
    } else {
      requestParams.sort = sort;
      requestParams.order = "asc";
    }
  }

  const { data, isLoading } = useProducts(requestParams);
  const { data: categories } = useCategories();

  const products = data?.products || [];
  const totalPages = data?.meta?.pagination?.totalPages || 1;

  const resultCount =
    data?.meta?.pagination?.totalItems ??
    data?.meta?.pagination?.totalProducts ??
    data?.meta?.count ??
    products.length;

  const selectedCategory = useMemo(
    () => categories?.find((item) => item._id === category),
    [categories, category],
  );

  const activeFilterCount = [
    search,
    category,
    minPrice,
    maxPrice,
    isFeatured,
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  function updateParam(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    if (key !== "page") {
      nextParams.set("page", "1");
    }

    setSearchParams(nextParams);
  }

  function handleSearch(event) {
    event.preventDefault();
    updateParam("search", searchInput.trim());
  }

  function clearFilters() {
    const nextParams = new URLSearchParams();

    if (sort && sort !== "-createdAt") {
      nextParams.set("sort", sort);
    }

    setSearchParams(nextParams);
    setSearchInput("");
    setShowFilters(false);
  }

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-700">
                MarketFlow catalog
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
                Browse all products
              </h1>

              <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
                Search the catalog, compare prices, and narrow results using
                categories and price filters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-muted">
              <ShoppingBag
                size={18}
                className="text-accent-600"
                aria-hidden="true"
              />

              <span>
                <strong className="font-extrabold text-primary-950">
                  {resultCount}
                </strong>{" "}
                {resultCount === 1 ? "product" : "products"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden md:block">
            <div className="sticky top-6 overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
              <FiltersPanel
                categories={categories}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                isFeatured={isFeatured}
                hasFilters={hasFilters}
                updateParam={updateParam}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          <section className="min-w-0">
            <div className="rounded-lg border border-border bg-white p-3 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <form
                  onSubmit={handleSearch}
                  className="relative min-w-0 flex-1"
                  role="search"
                >
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                    aria-hidden="true"
                  />

                  <input
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search products"
                    className="min-h-[46px] w-full rounded-md border border-border-strong bg-white py-2.5 pl-10 pr-[88px] text-sm text-text outline-none placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)] sm:pr-[100px]"
                  />

                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 min-h-9 -translate-y-1/2 rounded-md border border-accent-600 bg-accent-400 px-3 text-xs font-bold text-primary-950 transition hover:bg-accent-300 sm:px-4"
                  >
                    Search
                  </button>
                </form>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="relative inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-primary-900 transition hover:bg-primary-50 md:hidden"
                    aria-label="Open product filters"
                  >
                    <SlidersHorizontal size={17} aria-hidden="true" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-950 px-1 text-[10px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="relative min-w-0 flex-1 sm:min-w-[210px] lg:flex-none">
                    <select
                      value={sort}
                      onChange={(event) =>
                        updateParam("sort", event.target.value)
                      }
                      className="min-h-[46px] w-full appearance-none rounded-md border border-border-strong bg-white py-2.5 pl-3 pr-10 text-sm font-semibold text-primary-900 outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                      aria-label="Sort products"
                    >
                      <option value="-createdAt">Newest first</option>
                      <option value="createdAt">Oldest first</option>
                      <option value="price">Price: low to high</option>
                      <option value="-price">Price: high to low</option>
                      <option value="-ratingsAverage">Top rated</option>
                      <option value="name">Name: A to Z</option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold uppercase tracking-[0.1em] text-text-soft">
                  Active
                </span>

                {search && (
                  <FilterChip
                    label={`Search: ${search}`}
                    onRemove={() => {
                      updateParam("search", "");
                      setSearchInput("");
                    }}
                  />
                )}

                {category && (
                  <FilterChip
                    label={selectedCategory?.name || "Selected category"}
                    onRemove={() => updateParam("category", "")}
                  />
                )}

                {minPrice && (
                  <FilterChip
                    label={`Min ₹${Number(minPrice).toLocaleString("en-IN")}`}
                    onRemove={() => updateParam("minPrice", "")}
                  />
                )}

                {maxPrice && (
                  <FilterChip
                    label={`Max ₹${Number(maxPrice).toLocaleString("en-IN")}`}
                    onRemove={() => updateParam("maxPrice", "")}
                  />
                )}

                {isFeatured && (
                  <FilterChip
                    label="Featured products"
                    onRemove={() => updateParam("isFeatured", "")}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="min-h-8 rounded-md px-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="mt-5">
              {isLoading ? (
                <div className="rounded-lg border border-border bg-white py-20">
                  <PageLoader />
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-lg border border-border bg-white py-8">
                  <EmptyState
                    icon={ShoppingBag}
                    title="No products found"
                    message="Try changing the search term, category, or price range."
                    actionLabel="Clear Filters"
                    actionTo="/products"
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-text-muted">
                      Showing{" "}
                      <strong className="font-extrabold text-primary-950">
                        {products.length}
                      </strong>{" "}
                      on this page
                    </p>

                    <span className="hidden text-xs font-medium text-text-soft sm:block">
                      Page {page} of {totalPages}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 border-t border-border pt-7 sm:mt-12">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(nextPage) =>
                          updateParam("page", String(nextPage))
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {showFilters && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <button
            type="button"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-primary-950/55"
            aria-label="Close product filters"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl animate-slide-up">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-primary-950">
                  Filter products
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  Narrow the catalog results
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-primary-700 hover:bg-primary-50"
                aria-label="Close filters"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <FiltersPanel
              categories={categories}
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              isFeatured={isFeatured}
              hasFilters={hasFilters}
              updateParam={updateParam}
              clearFilters={clearFilters}
              mobile
            />

            <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border bg-white p-4">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="min-h-[46px] rounded-md border border-border-strong bg-white px-4 text-sm font-bold text-primary-900 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Clear filters
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="min-h-[46px] rounded-md border border-accent-600 bg-accent-400 px-4 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
              >
                View results
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function FiltersPanel({
  categories,
  category,
  minPrice,
  maxPrice,
  isFeatured,
  hasFilters,
  updateParam,
  clearFilters,
  mobile = false,
}) {
  return (
    <div className={mobile ? "p-4" : "p-5"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={17} className="text-accent-600" aria-hidden="true" />

          <h2 className="text-sm font-extrabold text-primary-950">Filters</h2>
        </div>

        {!mobile && hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-[0.12em] text-text-soft">
          Category
        </h3>

        <div className="mt-3 space-y-1">
          <CategoryButton
            active={!category}
            label="All categories"
            onClick={() => updateParam("category", "")}
          />

          {categories?.map((item) => (
            <CategoryButton
              key={item._id}
              active={category === item._id}
              label={item.name}
              onClick={() => updateParam("category", item._id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-xs font-extrabold uppercase tracking-[0.12em] text-text-soft">
          Price range
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-text-muted">
              Minimum
            </span>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-600">
                ₹
              </span>

              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="0"
                value={minPrice}
                onChange={(event) =>
                  updateParam("minPrice", event.target.value)
                }
                className="min-h-[42px] w-full rounded-md border border-border-strong bg-white py-2 pl-7 pr-2 text-sm text-text outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
              />
            </div>
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-semibold text-text-muted">
              Maximum
            </span>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-600">
                ₹
              </span>

              <input
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Any"
                value={maxPrice}
                onChange={(event) =>
                  updateParam("maxPrice", event.target.value)
                }
                className="min-h-[42px] w-full rounded-md border border-border-strong bg-white py-2 pl-7 pr-2 text-sm text-text outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <button
          type="button"
          onClick={() => updateParam("isFeatured", isFeatured ? "" : "true")}
          className={`flex min-h-[44px] w-full items-center justify-between rounded-md border px-3 text-left text-sm font-semibold transition ${
            isFeatured
              ? "border-accent-500 bg-accent-50 text-primary-950"
              : "border-border bg-white text-primary-800 hover:border-border-strong hover:bg-primary-50"
          }`}
          aria-pressed={Boolean(isFeatured)}
        >
          Featured products
          <span
            className={`flex h-5 w-5 items-center justify-center rounded border ${
              isFeatured
                ? "border-accent-600 bg-accent-400 text-primary-950"
                : "border-border-strong bg-white text-transparent"
            }`}
          >
            <Check size={13} strokeWidth={3} aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  );
}

function CategoryButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[40px] w-full items-center justify-between rounded-md px-3 text-left text-sm transition ${
        active
          ? "bg-primary-950 font-bold text-white"
          : "font-medium text-primary-700 hover:bg-primary-50 hover:text-primary-950"
      }`}
      aria-pressed={active}
    >
      <span className="truncate">{label}</span>

      {active && <Check size={15} aria-hidden="true" />}
    </button>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center gap-1.5 rounded-md border border-border-strong bg-white pl-2.5 pr-1.5 text-xs font-semibold text-primary-800">
      <span className="max-w-[190px] truncate">{label}</span>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-500 hover:bg-primary-100 hover:text-primary-950"
        aria-label={`Remove ${label} filter`}
      >
        <X size={13} aria-hidden="true" />
      </button>
    </span>
  );
}

export default ProductsPage;
