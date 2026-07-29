import { Link } from "react-router";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import StarRating from "../common/StarRating.jsx";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../features/wishlist/hooks/useWishlist.js";
import { useAddToCart } from "../../features/cart/hooks/useCart.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";

function ProductCard({ product }) {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const { data: wishlist } = useWishlist();
  const addToCartMutation = useAddToCart();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isWishlisted =
    wishlist?.products?.some((p) => p._id === product._id) || false;

  const image = product.images?.[0]?.url;
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;
  const inStock = product.stock > 0;

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast({ type: "error", message: "Please login to add to wishlist" });
      return;
    }

    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product._id, {
        onSuccess: () =>
          addToast({ type: "success", message: "Removed from wishlist" }),
        onError: (err) => addToast({ type: "error", message: err.message }),
      });
    } else {
      addToWishlistMutation.mutate(
        { productId: product._id },
        {
          onSuccess: () =>
            addToast({ type: "success", message: "Added to wishlist!" }),
          onError: (err) => addToast({ type: "error", message: err.message }),
        },
      );
    }
  }

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast({ type: "error", message: "Please login to add items to cart" });
      return;
    }
    if (!inStock) {
      addToast({ type: "error", message: "This item is out of stock" });
      return;
    }

    addToCartMutation.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () =>
          addToast({
            type: "success",
            message: `${product.name} added to cart`,
          }),
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square overflow-hidden bg-gray-50"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-200">
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white">
            -{discountPercent}%
          </span>
        )}

        {!inStock && (
          <span className="absolute left-3 bottom-3 rounded-md bg-gray-900/80 px-2 py-1 text-[10px] font-bold text-white">
            Out of stock
          </span>
        )}

        <button
          type="button"
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all ${
            isWishlisted
              ? "text-red-500 opacity-100"
              : "text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-500"
          }`}
          onClick={handleWishlistClick}
          disabled={
            addToWishlistMutation.isPending ||
            removeFromWishlistMutation.isPending
          }
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 transition-colors hover:text-primary-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            ₹
            {(hasDiscount ? product.discountPrice : product.price)?.toLocaleString(
              "en-IN",
            )}
          </span>
          {hasDiscount && (
            <span className="text-xs font-medium text-gray-400 line-through">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <StarRating rating={product.ratingsAverage || 0} size={12} />
            <span className="text-[11px] font-medium text-gray-400">
              ({product.ratingsCount || 0})
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || !inStock}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
