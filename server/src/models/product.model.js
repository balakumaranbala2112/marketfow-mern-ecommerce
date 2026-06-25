import mongoose from "mongoose";
// [BUG-FIX #4] Removed unused `import Category from "./category.model.js";`
// The Category model was never used in this file — `ref: "Category"` uses a string
// reference and does not require the import. It was dead code that created a
// circular dependency risk.
const { Schema } = mongoose;

const productImageSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, "Product image URL is required"],
    },

    publicId: {
      type: String,
      required: [true, "Product image publicId is required"],
    },

    alt: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const specificationSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Specification key is required"],
      trim: true,
    },

    value: {
      type: String,
      required: [true, "Specification value is required"],
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Product description must be at least 10 characters"],
      maxlength: [5000, "Product description cannot exceed 5000 characters"],
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: null,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    images: {
      type: [productImageSchema],
      validate: {
        validator: function (images) {
          return images.length > 0;
        },
        message: "At least one product image is required",
      },
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Product stock cannot be negative"],
      default: 0,
    },

    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    ratingsAverage: {
      type: Number,
      min: [0, "Average rating cannot be below 0"],
      max: [5, "Average rating cannot be above 5"],
      default: 0,
    },

    ratingsCount: {
      type: Number,
      min: [0, "Ratings count cannot be negative"],
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "Product creator is required"],
      default: null,
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Product listing queries commonly filter by status/category and sort by newest.
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1, createdAt: -1 });

// Price-based filtering/sorting is common on category listing pages.
productSchema.index({ category: 1, isActive: 1, price: 1 });

// Homepage and admin screens often need featured/latest product lists.
productSchema.index({ isFeatured: 1, isActive: 1, createdAt: -1 });

// Brand pages commonly filter active products by brand.
productSchema.index({ brand: 1, isActive: 1, createdAt: -1 });

// Rating sort is useful for “top rated products” sections.
productSchema.index({ ratingsAverage: -1, isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
