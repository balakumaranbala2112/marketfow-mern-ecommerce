import { Link } from "react-router";
import { ArrowRight, ShoppingBag, Shield, Truck, Star } from "lucide-react";

import { useProducts } from "../../features/products/hooks/useProducts.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import routePaths from "../../routes/routePaths.js";
import StarRating from "../../components/common/StarRating.jsx";

function ProductCard({ product }) {
  const image = product.images?.[0]?.url;
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;

  return (
    <Link
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
        <p className="text-xs font-medium text-emerald-600">{product.category?.name || "Uncategorized"}</p>
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
}

function HomePage() {
  const { data: featuredData } = useProducts({ isFeatured: "true", limit: 8, isActive: "true" });
  const { data: newData } = useProducts({ sort: "createdAt", order: "desc", limit: 4, isActive: "true" });
  const { data: categories } = useCategories();

  const featuredProducts = featuredData?.products || [];
  const newProducts = newData?.products || [];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                <Star size={12} className="fill-emerald-400" /> Premium E-Commerce
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
                Shop smarter.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Live better.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Discover curated products with fast delivery, secure payments, and exceptional quality. Your one-stop marketplace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={routePaths.products}
                  className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Browse Products
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to={routePaths.register}
                  className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <Truck className="h-8 w-8 text-emerald-400" />
                    <p className="mt-3 text-sm font-semibold text-white">Free Shipping</p>
                    <p className="mt-1 text-xs text-slate-400">Orders over ₹5,000</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5">
                    <Shield className="h-8 w-8 text-cyan-400" />
                    <p className="mt-3 text-sm font-semibold text-white">Secure Payments</p>
                    <p className="mt-1 text-xs text-slate-400">100% protected</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5">
                    <ShoppingBag className="h-8 w-8 text-violet-400" />
                    <p className="mt-3 text-sm font-semibold text-white">Quality Products</p>
                    <p className="mt-1 text-xs text-slate-400">Curated selection</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5">
                    <Star className="h-8 w-8 text-amber-400" />
                    <p className="mt-3 text-sm font-semibold text-white">Top Rated</p>
                    <p className="mt-1 text-xs text-slate-400">By real customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Categories</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Shop by Category</h2>
            </div>
            <Link to={routePaths.products} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              View All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`${routePaths.products}?category=${cat._id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-emerald-200 hover:shadow-md"
              >
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.name} className="mx-auto h-12 w-12 rounded-xl object-cover" />
                ) : (
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50">
                    <ShoppingBag size={20} className="text-emerald-600" />
                  </div>
                )}
                <p className="mt-3 text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Featured</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Handpicked for You</h2>
              </div>
              <Link to={`${routePaths.products}?isFeatured=true`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                See All →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">New Arrivals</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Just Landed</h2>
            </div>
            <Link to={`${routePaths.products}?sort=-createdAt`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              See All →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default HomePage;
