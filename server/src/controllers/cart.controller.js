import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

import StatusCodes from "../constants/statusCodes.js";
import AppError from "../utils/AppError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";
import sendResponse from "../utils/sendResponse.js";

function getProductPrice(product) {
  return product.discountPrice ?? product.price;
}

function getProductImage(product) {
  return product.images?.[0]?.url || "";
}

async function addToCart(req, res, next) {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Product not found"));
  }

  if (!product.isActive) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Product is currently not available",
      ),
    );
  }

  if (product.stock < quantity) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Insufficient product stock", [
        `Only ${product.stock} item(s) available in stock`,
      ]),
    );
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find((item) => {
    return item.product.toString() === productId;
  });

  const price = getProductPrice(product);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return next(
        new AppError(StatusCodes.BAD_REQUEST, "Insufficient product stock", [
          `You already have ${existingItem.quantity} item(s) in cart. Only ${product.stock} item(s) available in stock.`,
        ]),
      );
    }

    existingItem.quantity = newQuantity;
    existingItem.price = price;
    existingItem.stock = product.stock;
    existingItem.subtotal = existingItem.quantity * price;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: getProductImage(product),
      price,
      quantity,
      stock: product.stock,
      subtotal: price * quantity,
    });
  }

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name slug price discountPrice stock isActive",
  );

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product added to cart successfully",
    populatedCart,
  );
}

export { addToCart };
