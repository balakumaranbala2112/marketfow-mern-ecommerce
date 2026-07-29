import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, ShoppingBag, X } from "lucide-react";

import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import PageHeader from "../../components/common/PageHeader.jsx";
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

  const params = { page, limit: 12, isActive: "true" };
  if (search) params.search = search;
  if (category) params.category = category;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (isFeatured) params.isFeatured = isFeatured;

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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader
        title="All Products"
        description="Browse the full catalog. Filter by category, price, or sort to find what you need."
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 shrink-0 space-y-8 ${showFilters ? "block" : "hidden md:block"}`}>
          {/* Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Category
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => updateParam("category", "")}
                className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  !category
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParam("category", cat._id)}
                  className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                    category === cat._id
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Price Range
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/15"
              />
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 px-4 py-2.5 text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <X size={16} /> Clear All Filters
            </button>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-white border border-gray-200 p-3 shadow-sm">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex w-full sm:max-w-md relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg border-none bg-gray-50 py-2.5 pl-10 pr-24 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary-500/15"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-primary-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors">
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Sort By */}
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none font-medium text-gray-700 transition-all focus:border-primary-500 focus:bg-white"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratingsAverage">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <PageLoader />
          ) : products.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for."
              actionLabel="Clear Filters"
              actionTo="/products"
            />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="font-bold text-gray-900">{data?.meta?.count || products.length}</span> results
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="mt-12">
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
