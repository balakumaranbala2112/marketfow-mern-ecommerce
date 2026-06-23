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
    },

    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["customer", "admin"],
        message: "Role must be customer or admin",
      },
      default: "customer",
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

    passwordChangeAt: {
      type: Date,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
