import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Cart item product is required"],
    },

    name: {
      type: String,
      required: [true, "Cart item name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Cart item price is required"],
      min: [0, "Cart item price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Cart item quantity is required"],
      min: [1, "Cart item quantity must be at least 1"],
      default: 1,
    },

    stock: {
      type: Number,
      required: [true, "Cart item stock is required"],
      min: [0, "Cart item stock cannot be negative"],
    },

    subtotal: {
      type: Number,
      required: [true, "Cart item subtotal is required"],
      min: [0, "Cart item subtotal cannot be negative"],
    },
  },
  {
    _id: true,
  },
);

const appliedCouponSchema = new Schema(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    code: {
      type: String,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },

    discountValue: {
      type: Number,
      min: 0,
    },

    minOrderAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: null,
    },

    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart user is required"],
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalItems: {
      type: Number,
      min: [0, "Total items cannot be negative"],
      default: 0,
    },

    cartTotal: {
      type: Number,
      min: [0, "Cart total cannot be negative"],
      default: 0,
    },

    coupon: {
      type: appliedCouponSchema,
      default: null,
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0,
    },

    payableTotal: {
      type: Number,
      min: [0, "Payable total cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
