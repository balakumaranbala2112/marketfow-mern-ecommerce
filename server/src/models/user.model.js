import mongoose from "mongoose";

import Roles from "../constants/roles.js";

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

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "User name must be at least 2 characters"],
      maxlength: [60, "User name cannot exceed 60 characters"],
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    // Password is hidden by default and will be manually selected only during login.
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: [Roles.CUSTOMER, Roles.ADMIN],
        message: "Role must be customer or admin",
      },
      default: Roles.CUSTOMER,
    },

    avatar: {
      type: imageSchema,
      default: () => ({}),
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Admin user screens commonly filter users by role/status and newest accounts.
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ isBlocked: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
