import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    url: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [80, "Category name cannot exceed 80 characters"],
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Category description cannot exceed 500 characters"],
      default: "",
    },

    image: {
      type: imageSchema,
      default: () => ({}),
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ isActive: 1, createdAt: -1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
