import { useState } from "react";
import { useParams, Link } from "react-router";
import { ShoppingCart, Heart, Minus, Plus, ShoppingBag, ChevronLeft, Package, Truck } from "lucide-react";

import { useProduct, useProductReviews, useCreateReview } from "../../features/products/hooks/useProducts.js";
import { useAddToCart } from "../../features/cart/hooks/useCart.js";
import { useAddToWishlist } from "../../features/wishlist/hooks/useWishlist.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import routePaths from "../../routes/routePaths.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import StarRating from "../../components/common/StarRating.jsx";
import FormTextarea from "../../components/common/FormTextarea.jsx";

function ProductDetailsPage() {
  const { productId } = useParams();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const { data: product, isLoading } = useProduct(productId);
  const { data: reviewsData } = useProductReviews(productId);
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const createReviewMutation = useCreateReview(productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  if (isLoading) return <PageLoader />;
  if (!product) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-12 text-center">
        <ShoppingBag className="h-16 w-16 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Product not found</h1>
        <Link to={routePaths.products} className="mt-6 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Browse Products
        </Link>
      </main>
    );
  }

  const images = product.images || [];
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;
  const reviews = reviewsData?.reviews || [];
  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!user) {
      addToast({ type: "error", message: "Please login to add items to cart" });
      return;
    }
    addToCartMutation.mutate(
      { productId: product._id, quantity },
      {
        onSuccess: () => addToast({ type: "success", message: `${product.name} added to cart!` }),
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  function handleAddToWishlist() {
    if (!user) {
      addToast({ type: "error", message: "Please login to add to wishlist" });
      return;
    }
    addToWishlistMutation.mutate(
      { productId: product._id },
      {
        onSuccess: () => addToast({ type: "success", message: "Added to wishlist!" }),
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (reviewRating === 0) {
      addToast({ type: "error", message: "Please select a rating" });
      return;
    }
    createReviewMutation.mutate(
      { rating: reviewRating, comment: reviewComment },
      {
        onSuccess: () => {
          addToast({ type: "success", message: "Review submitted!" });
          setReviewRating(0);
          setReviewComment("");
        },
        onError: (err) => addToast({ type: "error", message: err.message }),
      },
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Breadcrumb */}
      <Link to={routePaths.products} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {images[selectedImage] ? (
              <img src={images[selectedImage].url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <ShoppingBag size={80} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${idx === selectedImage ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <Link to={`${routePaths.products}?category=${product.category._id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.ratingsAverage || 0} size={18} />
            <span className="text-sm text-slate-500">
              {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">₹{finalPrice?.toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-slate-400 line-through">₹{product.price?.toLocaleString("en-IN")}</span>
                <span className="rounded-lg bg-red-50 px-2.5 py-1 text-sm font-bold text-red-600">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-slate-600">{product.shortDescription}</p>
          )}

          {/* Stock Status */}
          <div className="mt-5">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Package size={14} /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
              >
                <ShoppingCart size={16} />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                className="rounded-xl border border-slate-200 p-3 text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <Heart size={18} />
              </button>
            </div>
          )}

          {/* Shipping */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Truck size={16} className="text-emerald-600" />
              Free shipping on orders over ₹5,000
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Specifications</h2>
              <dl className="mt-3 divide-y divide-slate-100">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex py-2.5 text-sm">
                    <dt className="w-40 font-medium text-slate-500">{spec.key}</dt>
                    <dd className="text-slate-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>

        {/* Write Review */}
        {user && (
          <form onSubmit={handleSubmitReview} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900">Write a Review</h3>
            <div className="mt-3">
              <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={24} />
            </div>
            <div className="mt-3">
              <FormTextarea
                id="review-comment"
                placeholder="Share your experience with this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="mt-3 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Review List */}
        <div className="mt-8 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  {review.user?.avatar?.url ? (
                    <img src={review.user.avatar.url} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      {review.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.user?.name}</p>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <span className="ml-auto text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
