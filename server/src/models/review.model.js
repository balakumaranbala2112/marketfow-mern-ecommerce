import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review user is required"],
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review product is required"],
    },

    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [3, "Review comment must be at least 3 characters"],
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent the same user from reviewing the same product multiple times.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
