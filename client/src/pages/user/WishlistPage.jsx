import { Link } from "react-router";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";

import { useWishlist, useRemoveFromWishlist } from "../../features/wishlist/hooks/useWishlist.js";
import { useAddToCart } from "../../features/cart/hooks/useCart.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StarRating from "../../components/common/StarRating.jsx";

function WishlistPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { data: wishlist, isLoading } = useWishlist();
  const removeMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  if (isLoading) return <PageLoader />;

  const products = wishlist?.products || [];

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Wishlist is empty"
        message="Save products you love for later"
        actionLabel="Browse Products"
        actionTo={routePaths.products}
      />
    );
  }

  function handleRemove(productId) {
    removeMutation.mutate(productId, {
      onSuccess: () => addToast({ type: "success", message: "Removed from wishlist" }),
      onError: (err) => addToast({ type: "error", message: err.message }),
    });
  }

  function handleMoveToCart(product) {
    addToCartMutation.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => {
          addToast({ type: "success", message: `${product.name} added to cart!` });
          removeMutation.mutate(product._id);
        },
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Wishlist</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your Wishlist</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} item(s)</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const image = product.images?.[0]?.url;
          const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
          const inStock = product.stock > 0 && product.isActive;

          return (
            <div key={product._id} className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <Link to={`/products/${product._id}`}>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                  {image ? (
                    <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300"><ShoppingBag size={40} /></div>
                  )}
                </div>
              </Link>
              <div className="mt-3 px-1">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{product.name}</h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <StarRating rating={product.ratingsAverage || 0} size={12} />
                  <span className="text-xs text-slate-400">({product.ratingsCount || 0})</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">
                    ₹{(hasDiscount ? product.discountPrice : product.price)?.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && <span className="text-xs text-slate-400 line-through">₹{product.price?.toLocaleString("en-IN")}</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  {inStock && (
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-950 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="rounded-lg border border-slate-200 px-2.5 py-2 text-slate-400 hover:border-red-200 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default WishlistPage;
