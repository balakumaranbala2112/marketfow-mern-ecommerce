import { Link } from "react-router";
import { Heart, LoaderCircle, ShoppingBag, ShoppingCart } from "lucide-react";

import StarRating from "../common/StarRating.jsx";

import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../features/wishlist/hooks/useWishlist.js";

import { useAddToCart } from "../../features/cart/hooks/useCart.js";

import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";

function ProductCard({ product }) {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const { data: wishlist } = useWishlist();

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isWishlisted =
    wishlist?.products?.some(
      (wishlistProduct) => wishlistProduct._id === product._id,
    ) || false;

  const image = product.images?.[0]?.url;

  const hasDiscount =
    product.discountPrice != null &&
    product.price != null &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  const inStock = Number(product.stock) > 0;

  const isWishlistPending =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      addToast({
        type: "error",
        message: "Please login to add products to your wishlist",
      });

      return;
    }

    if (isWishlistPending) {
      return;
    }

    if (isWishlisted) {
      removeFromWishlistMutation.mutate(product._id, {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Removed from wishlist",
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      });

      return;
    }

    addToWishlistMutation.mutate(
      {
        productId: product._id,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Added to wishlist",
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      },
    );
  }

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      addToast({
        type: "error",
        message: "Please login to add products to your cart",
      });

      return;
    }

    if (!inStock) {
      addToast({
        type: "error",
        message: "This product is currently out of stock",
      });

      return;
    }

    if (addToCartMutation.isPending) {
      return;
    }

    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: `${product.name} added to cart`,
          });
        },
        onError: (error) => {
          addToast({
            type: "error",
            message: error.message,
          });
        },
      },
    );
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_45px_-36px_rgba(20,34,49,0.8)] transition duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_28px_65px_-38px_rgba(16,131,113,0.5)]">
      <Link
        to={`/products/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-100 bg-white text-primary-300 shadow-sm">
              <ShoppingBag size={30} strokeWidth={1.4} aria-hidden="true" />
            </div>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-3.5rem)] flex-wrap gap-1.5 sm:left-3 sm:top-3">
          {hasDiscount && (
            <span className="inline-flex min-h-7 items-center rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm sm:px-2.5 sm:text-[11px]">
              {discountPercent}% OFF
            </span>
          )}

          {!inStock && (
            <span className="inline-flex min-h-7 items-center rounded-lg bg-primary-950/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-[11px]">
              Out of stock
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={isWishlistPending}
          className={`absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-xl border bg-white/95 shadow-md backdrop-blur-sm transition duration-200 sm:right-3 sm:top-3 ${
            isWishlisted
              ? "border-rose-200 text-rose-600"
              : "border-white/80 text-primary-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          } disabled:cursor-not-allowed disabled:opacity-60`}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          {isWishlistPending ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Heart
              size={17}
              fill={isWishlisted ? "currentColor" : "none"}
              aria-hidden="true"
            />
          )}
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link
          to={`/products/${product._id}`}
          className="rounded-md focus-visible:outline-offset-2"
        >
          <h3 className="line-clamp-2 min-h-10 text-[13px] font-bold leading-5 text-primary-900 transition-colors hover:text-accent-700 sm:min-h-12 sm:text-sm sm:leading-6">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-extrabold tracking-[-0.02em] text-primary-950 sm:text-lg">
            ₹{displayPrice?.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="text-[11px] font-semibold text-text-soft line-through sm:text-xs">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex min-w-0 items-center gap-1.5">
          <StarRating rating={product.ratingsAverage || 0} size={12} />

          <span className="truncate text-[10px] font-semibold text-text-soft sm:text-[11px]">
            ({product.ratingsCount || 0})
          </span>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || !inStock}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent-600 px-3 text-xs font-extrabold text-white shadow-[0_12px_28px_-18px_rgba(16,131,113,0.95)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent-700 hover:shadow-[0_16px_34px_-18px_rgba(16,131,113,0.95)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-primary-100 disabled:text-primary-400 disabled:shadow-none sm:text-sm"
            aria-label={
              inStock
                ? `Add ${product.name} to cart`
                : `${product.name} is out of stock`
            }
          >
            {addToCartMutation.isPending ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Adding</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} strokeWidth={2} aria-hidden="true" />
                <span>{inStock ? "Add to cart" : "Unavailable"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
