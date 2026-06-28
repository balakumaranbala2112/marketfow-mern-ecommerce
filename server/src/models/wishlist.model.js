import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Wishlist user is required"],
      unique: true,
    },

    products: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
