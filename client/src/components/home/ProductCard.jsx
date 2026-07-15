import { Link } from "react-router";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import StarRating from "../common/StarRating.jsx";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../features/wishlist/hooks/useWishlist.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";

function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const { data: wishlist } = useWishlist();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isWishlisted = wishlist?.products?.some((p) => p._id === product._id) || false;

  const image = product.images?.[0]?.url;
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast({ type: "error", message: "Please login to add to wishlist" });
      return;
    }

    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product._id, {
        onSuccess: () => addToast({ type: "success", message: "Removed from wishlist" }),
        onError: (err) => addToast({ type: "error", message: err.message }),
      });
    } else {
      addToWishlistMutation.mutate(
        { productId: product._id },
        {
          onSuccess: () => addToast({ type: "success", message: "Added to wishlist!" }),
          onError: (err) => addToast({ type: "error", message: err.message }),
        },
      );
    }
  }

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1 overflow-hidden">
      {/* Image area */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square overflow-hidden bg-slate-50"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-200">
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}

        {/* Discount badge — top left circle */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-md">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist heart — top right */}
        <button
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-110 cursor-pointer z-10 ${
            isWishlisted
              ? "text-red-500"
              : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
          }`}
          onClick={handleWishlistClick}
          disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 leading-snug hover:text-violet-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-slate-900">
            ₹
            {(hasDiscount
              ? product.discountPrice
              : product.price
            )?.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-xs font-medium text-slate-400 line-through">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Rating + Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.ratingsAverage || 0} size={12} />
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.ratingsCount || 0})
            </span>
          </div>

          {/* Add to cart icon */}
          <Link
            to={`/products/${product._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="View product details"
          >
            <ShoppingCart size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
