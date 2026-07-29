import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  LoaderCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Truck,
  UserRound,
} from "lucide-react";

import {
  useCreateReview,
  useProduct,
  useProductReviews,
} from "../../features/products/hooks/useProducts.js";

import { useAddToCart } from "../../features/cart/hooks/useCart.js";

import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "../../features/wishlist/hooks/useWishlist.js";

import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";

import PageLoader from "../../components/common/PageLoader.jsx";
import StarRating from "../../components/common/StarRating.jsx";

function ProductDetailsPage() {
  const { productId } = useParams();

  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const { data: product, isLoading } = useProduct(productId);
  const { data: reviewsData } = useProductReviews(productId);

  const addToCartMutation = useAddToCart();
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const createReviewMutation = useCreateReview(productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setReviewRating(0);
    setReviewComment("");
  }, [productId]);

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center shadow-[0_2px_8px_rgba(15,24,32,0.08)]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-400">
            <ShoppingBag size={30} strokeWidth={1.6} aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-2xl font-extrabold text-primary-950">
            Product not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            This product may have been removed or is no longer available.
          </p>

          <Link
            to={routePaths.products}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-6 text-sm font-bold text-primary-950 transition hover:bg-accent-300"
          >
            Browse products
            <ChevronRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const selectedProductImage = images[selectedImage];

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

  const reviews = reviewsData?.reviews || [];
  const inStock = Number(product.stock) > 0;

  const isWishlisted =
    wishlist?.products?.some(
      (wishlistProduct) => wishlistProduct._id === product._id,
    ) || false;

  const isWishlistPending =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  function decreaseQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function increaseQuantity() {
    setQuantity((currentQuantity) =>
      Math.min(product.stock, currentQuantity + 1),
    );
  }

  function handleAddToCart() {
    if (!user) {
      addToast({
        type: "error",
        message: "Please login to add items to your cart",
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

    addToCartMutation.mutate(
      {
        productId: product._id,
        quantity,
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

  function handleWishlistToggle() {
    if (!user) {
      addToast({
        type: "error",
        message: "Please login to use your wishlist",
      });

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

  function handleSubmitReview(event) {
    event.preventDefault();

    if (reviewRating === 0) {
      addToast({
        type: "error",
        message: "Please select a rating",
      });

      return;
    }

    createReviewMutation.mutate(
      {
        rating: reviewRating,
        comment: reviewComment.trim(),
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            message: "Review submitted",
          });

          setReviewRating(0);
          setReviewComment("");
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
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <nav
            className="flex min-w-0 items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              to={routePaths.products}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700 transition hover:text-blue-800 hover:underline"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Products
            </Link>

            {product.category?.name && (
              <>
                <ChevronRight
                  size={15}
                  className="shrink-0 text-text-soft"
                  aria-hidden="true"
                />

                <Link
                  to={`${routePaths.products}?category=${product.category._id}`}
                  className="hidden truncate font-medium text-text-muted hover:text-blue-700 hover:underline sm:block"
                >
                  {product.category.name}
                </Link>
              </>
            )}

            <ChevronRight
              size={15}
              className="hidden shrink-0 text-text-soft sm:block"
              aria-hidden="true"
            />

            <span className="hidden truncate font-medium text-primary-900 sm:block">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-10">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]">
              <div className="relative aspect-square bg-white">
                {selectedProductImage ? (
                  <img
                    src={selectedProductImage.url}
                    alt={product.name}
                    className="h-full w-full object-contain p-3 sm:p-6"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-primary-50 text-primary-300">
                    <ShoppingBag
                      size={76}
                      strokeWidth={1.2}
                      aria-hidden="true"
                    />
                  </div>
                )}

                {hasDiscount && (
                  <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-extrabold text-white shadow-sm sm:left-4 sm:top-4">
                    {discountPercent}% off
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="scrollbar-none mt-3 flex snap-x gap-2 overflow-x-auto pb-1 sm:gap-3">
                {images.map((image, index) => {
                  const isSelected = index === selectedImage;

                  return (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-18 w-18 shrink-0 snap-start overflow-hidden rounded-md border-2 bg-white transition sm:h-20 sm:w-20 ${
                        isSelected
                          ? "border-accent-500 shadow-[0_0_0_2px_rgba(245,154,0,0.16)]"
                          : "border-border hover:border-border-strong"
                      }`}
                      aria-label={`View product image ${index + 1}`}
                      aria-pressed={isSelected}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border border-border bg-white p-5 shadow-[0_2px_8px_rgba(15,24,32,0.08)] sm:p-7">
              {product.category && (
                <Link
                  to={`${routePaths.products}?category=${product.category._id}`}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700 transition hover:text-blue-800 hover:underline"
                >
                  {product.category.name}
                </Link>
              )}

              <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-primary-950 sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border pb-5">
                <StarRating rating={product.ratingsAverage || 0} size={17} />

                <span className="text-sm font-semibold text-primary-800">
                  {(product.ratingsAverage || 0).toFixed(1)}
                </span>

                <a
                  href="#customer-reviews"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
                >
                  {product.ratingsCount || 0}{" "}
                  {product.ratingsCount === 1 ? "review" : "reviews"}
                </a>
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
                    ₹{finalPrice?.toLocaleString("en-IN")}
                  </span>

                  {hasDiscount && (
                    <span className="text-base font-medium text-text-soft line-through">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <p className="mt-2 text-sm font-bold text-red-600">
                    You save ₹
                    {(product.price - product.discountPrice).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                )}
              </div>

              {product.shortDescription && (
                <p className="mt-5 text-sm leading-7 text-text-muted">
                  {product.shortDescription}
                </p>
              )}

              <div className="mt-5 border-y border-border py-4">
                {inStock ? (
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                      <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                    </span>

                    <div>
                      <p className="text-sm font-extrabold text-green-700">
                        In stock
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-text-muted">
                        {product.stock} currently available
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Package size={18} aria-hidden="true" />
                    </span>

                    <div>
                      <p className="text-sm font-extrabold text-red-600">
                        Out of stock
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-text-muted">
                        This product cannot be added to the cart right now.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {inStock && (
                <div className="mt-5">
                  <label className="text-sm font-bold text-primary-950">
                    Quantity
                  </label>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="inline-flex min-h-[46px] items-center rounded-md border border-border-strong bg-white">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={17} aria-hidden="true" />
                      </button>

                      <span
                        className="min-w-12 border-x border-border px-3 text-center text-sm font-extrabold text-primary-950"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                        className="flex h-11 w-11 items-center justify-center text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Increase quantity"
                      >
                        <Plus size={17} aria-hidden="true" />
                      </button>
                    </div>

                    <span className="text-xs text-text-muted">
                      Maximum {product.stock}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-[minmax(0,1fr)_48px] gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending || !inStock}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:border-border disabled:bg-primary-100 disabled:text-primary-500"
                >
                  {addToCartMutation.isPending ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Adding to cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} aria-hidden="true" />
                      {inStock ? "Add to cart" : "Unavailable"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={isWishlistPending}
                  className={`flex min-h-[50px] items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-55 ${
                    isWishlisted
                      ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-border-strong bg-white text-primary-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  }`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  aria-pressed={isWishlisted}
                >
                  {isWishlistPending ? (
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Heart
                      size={19}
                      fill={isWishlisted ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              <div className="mt-6 divide-y divide-border rounded-md border border-border bg-surface-subtle">
                <TrustRow
                  icon={Truck}
                  title="Delivery information"
                  description="Availability and delivery charges are shown during checkout."
                />

                <TrustRow
                  icon={ShieldCheck}
                  title="Secure checkout"
                  description="Complete payment through the configured MarketFlow checkout."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
          <article className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-7">
            <h2 className="text-xl font-extrabold text-primary-950">
              Product details
            </h2>

            <div className="mt-5 border-t border-border pt-5">
              <h3 className="text-sm font-extrabold text-primary-950">
                Description
              </h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-muted">
                {product.description || "No description is available."}
              </p>
            </div>
          </article>

          {product.specifications?.length > 0 && (
            <aside className="rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-7">
              <h2 className="text-xl font-extrabold text-primary-950">
                Specifications
              </h2>

              <dl className="mt-5 divide-y divide-border border-y border-border">
                {product.specifications.map((specification, index) => (
                  <div
                    key={`${specification.key}-${index}`}
                    className="grid grid-cols-[minmax(100px,0.75fr)_minmax(0,1.25fr)] gap-4 py-3 text-sm"
                  >
                    <dt className="font-semibold text-text-muted">
                      {specification.key}
                    </dt>

                    <dd className="min-w-0 break-words font-medium text-primary-950">
                      {specification.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </section>

        <section
          id="customer-reviews"
          className="mt-8 scroll-mt-6 rounded-lg border border-border bg-white p-5 shadow-[0_1px_4px_rgba(15,24,32,0.06)] sm:p-7"
        >
          <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-700">
                Verified customer feedback
              </p>

              <h2 className="mt-1.5 text-2xl font-extrabold tracking-[-0.025em] text-primary-950">
                Customer reviews
              </h2>
            </div>

            <p className="text-sm text-text-muted">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {user ? (
            <form
              onSubmit={handleSubmitReview}
              className="mt-6 rounded-lg border border-border bg-surface-subtle p-4 sm:p-5"
            >
              <h3 className="text-base font-extrabold text-primary-950">
                Write a review
              </h3>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                Share a clear and honest description of your experience.
              </p>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold text-primary-900">
                  Your rating
                </label>

                <StarRating
                  rating={reviewRating}
                  interactive
                  onChange={setReviewRating}
                  size={25}
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-bold text-primary-900"
                >
                  Review
                </label>

                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={4}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full resize-y rounded-md border border-border-strong bg-white px-3.5 py-3 text-sm leading-6 text-text outline-none placeholder:text-text-soft focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
                />
              </div>

              <button
                type="submit"
                disabled={createReviewMutation.isPending}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-primary-950 bg-primary-950 px-5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createReviewMutation.isPending ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Submitting
                  </>
                ) : (
                  "Submit review"
                )}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-md border border-border bg-surface-subtle px-4 py-4 text-sm text-text-muted">
              <Link
                to={routePaths.login}
                className="font-bold text-blue-700 hover:text-blue-800 hover:underline"
              >
                Sign in
              </Link>{" "}
              to write a review.
            </div>
          )}

          <div className="mt-7 space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-md border border-dashed border-border-strong px-5 py-10 text-center">
                <UserRound
                  size={30}
                  className="mx-auto text-primary-300"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-bold text-primary-900">
                  No reviews yet
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Be the first customer to share an experience with this
                  product.
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function TrustRow({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <Icon
        size={18}
        className="mt-0.5 shrink-0 text-green-700"
        aria-hidden="true"
      />

      <div>
        <p className="text-xs font-extrabold text-primary-950">{title}</p>

        <p className="mt-0.5 text-xs leading-5 text-text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const reviewerName = review.user?.name || "MarketFlow customer";
  const reviewerInitial = reviewerName.charAt(0).toUpperCase();

  return (
    <article className="rounded-lg border border-border bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {review.user?.avatar?.url ? (
          <img
            src={review.user.avatar.url}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
            {reviewerInitial}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <h3 className="truncate text-sm font-extrabold text-primary-950">
                {reviewerName}
              </h3>

              <div className="mt-1">
                <StarRating rating={review.rating} size={13} />
              </div>
            </div>

            <time
              dateTime={review.createdAt}
              className="shrink-0 text-xs text-text-soft"
            >
              {formatReviewDate(review.createdAt)}
            </time>
          </div>

          {review.comment && (
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-muted">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function formatReviewDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default ProductDetailsPage;
