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
  },
  {
    timestamps: true,
  },
);

// One user should have only one active cart document.
cartSchema.index({ user: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
