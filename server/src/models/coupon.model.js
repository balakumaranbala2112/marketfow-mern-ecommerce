import mongoose from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [30, "Coupon code cannot exceed 30 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Coupon description cannot exceed 300 characters"],
      default: "",
    },

    discountType: {
      type: String,
      required: [true, "Discount type is required"],
      enum: {
        values: ["percentage", "fixed"],
        message: "Discount type must be percentage or fixed",
      },
    },

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [1, "Discount value must be at least 1"],
    },

    minOrderAmount: {
      type: Number,
      min: [0, "Minimum order amount cannot be negative"],
      default: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount cannot be negative"],
      default: null,
    },

    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
      default: null,
    },

    usedCount: {
      type: Number,
      min: [0, "Used count cannot be negative"],
      default: 0,
    },

    startsAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
