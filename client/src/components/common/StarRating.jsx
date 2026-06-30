import { Star } from "lucide-react";

function StarRating({ rating = 0, maxStars = 5, size = 16, interactive = false, onChange }) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
