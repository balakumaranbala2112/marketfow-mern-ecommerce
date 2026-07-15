import bcrypt from "bcrypt";
import mongoose from "mongoose";

import env from "../config/env.js";
import Roles from "../constants/roles.js";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    url: {
      type: String,
      trim: true,
      default: "",
    },

    publicId: {
      type: String,
      trim: true,
      default: "",
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

    // Password is hidden by default and manually selected only during login.
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

// Hash password only when it is created or changed.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, env.auth.bcryptSaltRounds);

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePasswordAfter = function (jwtIssuedAt) {
  if (!this.passwordChangedAt) {
    return false;
  }

  const passwordChangedTimestamp = Math.floor(
    this.passwordChangedAt.getTime() / 1000,
  );

  return jwtIssuedAt < passwordChangedTimestamp;
};

// Admin user screens commonly filter users by role/status and newest accounts.
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ isBlocked: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
