import mongoose from "mongoose";

import User from "../src/models/user.model.js";
import Category from "../src/models/category.model.js";
import Product from "../src/models/product.model.js";
import Cart from "../src/models/cart.model.js";
import Order from "../src/models/order.model.js";
import Review from "../src/models/review.model.js";
import Wishlist from "../src/models/wishlist.model.js";

const models = [User, Category, Product, Cart, Order, Review, Wishlist];

console.log("Mongoose models loaded successfully:");

models.forEach((model) => {
  console.log(`- ${model.modelName}`);
});

await mongoose.disconnect();
