import { Link } from "react-router";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import StarRating from "../common/StarRating.jsx";

function ProductCard({ product }) {
  const image = product.images?.[0]?.url;
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      {/* Image area */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-[4/3] overflow-hidden bg-slate-50"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <ShoppingBag size={36} />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 hover:scale-110 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Add to wishlist"
        >
          <Heart size={15} />
        </button>
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Category label */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
          {product.category?.name || "General"}
        </span>

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 leading-snug hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <StarRating rating={product.ratingsAverage || 0} size={12} />
          <span className="text-[10px] text-slate-400 font-medium">
            ({product.ratingsCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-slate-900">
            ₹
            {(hasDiscount
              ? product.discountPrice
              : product.price
            )?.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <Link
          to={`/products/${product._id}`}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 py-2 text-xs font-bold text-white transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <ShoppingCart size={13} />
          Add to Cart
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
