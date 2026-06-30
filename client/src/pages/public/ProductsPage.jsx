import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, ShoppingBag, X } from "lucide-react";

import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StarRating from "../../components/common/StarRating.jsx";

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

  const params = { page, limit: 12, isActive: "true" };
  if (search) params.search = search;
  if (category) params.category = category;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (isFeatured) params.isFeatured = isFeatured;

  // Convert sort like "-createdAt" → sort=createdAt&order=desc
  if (sort) {
    if (sort.startsWith("-")) {
      params.sort = sort.slice(1);
      params.order = "desc";
    } else {
      params.sort = sort;
      params.order = "asc";
    }
  }

  const { data, isLoading } = useProducts(params);
  const { data: categories } = useCategories();

  const products = data?.products || [];
  const totalPages = data?.meta?.pagination?.totalPages || 1;

  function updateParam(key, value) {
    const p = new URLSearchParams(searchParams);
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    if (key !== "page") p.set("page", "1");
    setSearchParams(p);
  }

  const [searchInput, setSearchInput] = useState(search);

  function handleSearch(e) {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  }

  function clearFilters() {
    setSearchParams({});
    setSearchInput("");
  }

  const hasFilters = search || category || minPrice || maxPrice || isFeatured;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Products</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">All Products</h1>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 md:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button type="submit" className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Search
        </button>
      </form>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar Filters */}
        <aside className={`space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Category</h3>
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => updateParam("category", "")}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!category ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParam("category", cat._id)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${category === cat._id ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Price Range</h3>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sort By</h3>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratingsAverage">Top Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700">
              <X size={14} /> Clear All Filters
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div>
          {isLoading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              message="Try adjusting your search or filters"
              actionLabel="Clear Filters"
              actionTo="/products"
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {data?.meta?.count || products.length} product(s) found
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {products.map((product) => {
                  const image = product.images?.[0]?.url;
                  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
                  return (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                        {image ? (
                          <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            <ShoppingBag size={40} />
                          </div>
                        )}
                        {hasDiscount && (
                          <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="mt-3 px-1 pb-1">
                        <p className="text-xs font-medium text-emerald-600">{product.category?.name}</p>
                        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">{product.name}</h3>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <StarRating rating={product.ratingsAverage || 0} size={12} />
                          <span className="text-xs text-slate-400">({product.ratingsCount || 0})</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">
                            ₹{(hasDiscount ? product.discountPrice : product.price)?.toLocaleString("en-IN")}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">₹{product.price?.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParam("page", String(p))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductsPage;
