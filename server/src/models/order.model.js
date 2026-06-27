import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order item is required"],
    },

    name: {
      type: String,
      required: [true, "Order item name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Order item price is required"],
      min: [0, "Order item price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Order item quantity is required"],
      min: [1, "Order item quantity must be at least 1"],
    },

    subtotal: {
      type: Number,
      required: [true, "Order item subtotal is required"],
      min: [0, "Order item subtotal cannot be negative"],
    },
  },
  {
    _id: false,
  },
);

const shippingAddressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Shipping full name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Shipping phone is required"],
      trim: true,
    },

    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India",
    },
  },
  {
    _id: false,
  },
);

const paymentInfoSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["cod", "razorpay", "stripe"],
      default: "cod",
    },

    providerOrderId: {
      type: String,
      trim: true,
      default: "",
    },

    providerPaymentId: {
      type: String,
      trim: true,
      default: "",
    },

    providerSignature: {
      type: String,
      trim: true,
      default: "",
      select: false,
    },

    providerStatus: {
      type: String,
      trim: true,
      default: "",
    },

    receipt: {
      type: String,
      trim: true,
      default: "",
    },

    rawResponse: {
      type: Schema.Types.Mixed,
      select: false,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const orderCouponSchema = new Schema(
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

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order user is required"],
    },

    orderItems: {
      type: [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },

    paymentMethod: {
      type: String,
      enum: {
        values: ["cod", "online"],
        message: "Payment method must be cod or online",
      },
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "refunded"],
        message: "Invalid payment status",
      },
      default: "pending",
    },

    paymentInfo: {
      type: paymentInfoSchema,
      default: () => ({}),
    },

    paymentFailureReason: {
      type: String,
      trim: true,
      default: "",
    },

    paymentRetryCount: {
      type: Number,
      min: [0, "Payment retry count cannot be negative"],
      default: 0,
    },

    paymentExpiresAt: {
      type: Date,
      default: null,
    },

    stockRestoredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    orderStatus: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
        message: "Invalid order status",
      },
      default: "pending",
    },

    itemsPrice: {
      type: Number,
      required: [true, "Items price is required"],
      min: [0, "Items price cannot be negative"],
    },

    shippingPrice: {
      type: Number,
      min: [0, "Shipping price cannot be negative"],
      default: 0,
    },

    taxPrice: {
      type: Number,
      min: [0, "Tax price cannot be negative"],
      default: 0,
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    coupon: {
      code: {
        type: String,
        uppercase: true,
        trim: true,
        default: "",
      },

      discountAmount: {
        type: Number,
        min: [0, "Coupon discount cannot be negative"],
        default: 0,
      },
    },

    paidAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Admin order screens commonly filter by status and newest orders.
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
