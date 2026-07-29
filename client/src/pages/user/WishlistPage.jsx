import { Link } from "react-router";
import {
  ArrowRight,
  Heart,
  LoaderCircle,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  useRemoveFromWishlist,
  useWishlist,
} from "../../features/wishlist/hooks/useWishlist.js";

import { useAddToCart } from "../../features/cart/hooks/useCart.js";

import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StarRating from "../../components/common/StarRating.jsx";

function WishlistPage() {
  const addToast = useToastStore((state) => state.addToast);

  const { data: wishlist, isLoading } = useWishlist();
  const removeMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  const products = wishlist?.products || [];

  if (products.length === 0) {
    return (
      <main className="min-h-[70vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-white py-8 shadow-[0_2px_8px_rgba(15,24,32,0.06)]">
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              message="Save products here so you can compare them or return later."
              actionLabel="Browse products"
              actionTo={routePaths.products}
            />
          </div>
        </div>
      </main>
    );
  }

  function handleRemove(productId) {
    removeMutation.mutate(productId, {
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
  }

  function handleMoveToCart(product) {
    const inStock = Number(product.stock) > 0 && product.isActive !== false;

    if (!inStock) {
      addToast({
        type: "error",
        message: "This product is currently unavailable",
      });

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

          removeMutation.mutate(product._id, {
            onError: (error) => {
              addToast({
                type: "error",
                message:
                  error.message ||
                  "Product was added to cart but could not be removed from the wishlist",
              });
            },
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
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
                Saved products
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
                Your wishlist
              </h1>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Keep products here while you compare and decide.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-muted">
              <Heart
                size={16}
                className="text-red-600"
                fill="currentColor"
                aria-hidden="true"
              />

              <span>
                <strong className="font-extrabold text-primary-950">
                  {products.length}
                </strong>{" "}
                {products.length === 1 ? "saved item" : "saved items"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            Prices and availability may change before checkout.
          </p>

          <Link
            to={routePaths.products}
            className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline sm:inline-flex"
          >
            Continue shopping
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <WishlistProductCard
              key={product._id}
              product={product}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
              isRemoving={removeMutation.isPending}
              isAddingToCart={addToCartMutation.isPending}
            />
          ))}
        </div>

        <Link
          to={routePaths.products}
          className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-5 text-sm font-semibold text-primary-900 shadow-[0_1px_2px_rgba(15,24,32,0.05)] transition hover:bg-primary-50 sm:hidden"
        >
          Continue shopping
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

function WishlistProductCard({
  product,
  onRemove,
  onMoveToCart,
  isRemoving,
  isAddingToCart,
}) {
  const image = product.images?.[0]?.url;

  const hasDiscount =
    product.discountPrice != null &&
    product.price != null &&
    product.discountPrice < product.price;

  const finalPrice = hasDiscount ? product.discountPrice : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const inStock = Number(product.stock) > 0 && product.isActive !== false;
  const isBusy = isRemoving || isAddingToCart;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)] transition hover:border-border-strong hover:shadow-[0_3px_10px_rgba(15,24,32,0.09)]">
      <Link
        to={`/products/${product._id}`}
        className="relative block aspect-[4/3] overflow-hidden border-b border-border bg-white"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
            <ShoppingBag size={42} strokeWidth={1.3} aria-hidden="true" />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-[10px] font-extrabold text-white">
            {discountPercent}% off
          </span>
        )}

        {!inStock && (
          <span className="absolute bottom-3 left-3 rounded-md bg-primary-950/90 px-2.5 py-1 text-[10px] font-bold text-white">
            Unavailable
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/products/${product._id}`} className="rounded-sm">
          <h2 className="line-clamp-2 min-h-11 text-sm font-bold leading-[1.4rem] text-primary-950 transition hover:text-blue-700">
            {product.name}
          </h2>
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={product.ratingsAverage || 0} size={12} />

          <span className="text-xs text-text-soft">
            ({product.ratingsCount || 0})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-primary-950">
            ₹{finalPrice?.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <span className="text-xs font-medium text-text-soft line-through">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <p
          className={`mt-2 text-xs font-semibold ${
            inStock ? "text-green-700" : "text-red-600"
          }`}
        >
          {inStock ? "In stock" : "Currently unavailable"}
        </p>

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_44px] gap-2 pt-4">
          <button
            type="button"
            onClick={() => onMoveToCart(product)}
            disabled={isBusy || !inStock}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-3 text-xs font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:border-border disabled:bg-primary-100 disabled:text-primary-500 sm:text-sm"
          >
            {isAddingToCart ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ShoppingCart size={16} aria-hidden="true" />
            )}

            {inStock ? "Move to cart" : "Unavailable"}
          </button>

          <button
            type="button"
            onClick={() => onRemove(product._id)}
            disabled={isBusy}
            className="flex min-h-[44px] items-center justify-center rounded-md border border-border-strong bg-white text-primary-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            {isRemoving ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Trash2 size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default WishlistPage;
