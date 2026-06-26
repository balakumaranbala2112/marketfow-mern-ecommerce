import mongoose from "mongoose";

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

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
}

async function getPopulatedCart(cartId) {
  return Cart.findById(cartId).populate(
    "items.product",
    "name slug price discountPrice stock isActive",
  );
}

function findCartItem(cart, cartItemId) {
  return cart.items.find((item) => {
    return item._id.toString() === cartItemId;
  });
}

function validateCartItemId(cartItemId, next) {
  if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
    next(new AppError(StatusCodes.BAD_REQUEST, "Valid cartItemId is required"));

    return false;
  }

  return true;
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

  const cart = await getOrCreateCart(req.user._id);

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

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Product added to cart successfully",
    populatedCart,
  );
}

async function getMyCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);
  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Cart fetched successfully",
    populatedCart,
  );
}

async function updateCartItemQuantity(req, res, next) {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!validateCartItemId(cartItemId, next)) {
    return;
  }

  const cart = await getOrCreateCart(req.user._id);

  const cartItem = findCartItem(cart, cartItemId);

  if (!cartItem) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Cart item not found"));
  }

  const product = await Product.findById(cartItem.product);

  if (!product) {
    return next(
      new AppError(
        StatusCodes.NOT_FOUND,
        "Product linked to this cart item no longer exists",
      ),
    );
  }

  if (!product.isActive) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        "Product is currently not available",
      ),
    );
  }

  if (quantity > product.stock) {
    return next(
      new AppError(StatusCodes.BAD_REQUEST, "Insufficient product stock", [
        `Only ${product.stock} item(s) available in stock`,
      ]),
    );
  }

  const price = getProductPrice(product);

  cartItem.name = product.name;
  cartItem.image = getProductImage(product);
  cartItem.price = price;
  cartItem.stock = product.stock;
  cartItem.quantity = quantity;
  cartItem.subtotal = quantity * price;

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Cart item quantity updated successfully",
    populatedCart,
  );
}

async function removeCartItem(req, res, next) {
  const { cartItemId } = req.params;

  if (!validateCartItemId(cartItemId, next)) {
    return;
  }

  const cart = await getOrCreateCart(req.user._id);

  const cartItem = findCartItem(cart, cartItemId);

  if (!cartItem) {
    return next(new AppError(StatusCodes.NOT_FOUND, "Cart item not found"));
  }

  cart.items = cart.items.filter((item) => {
    return item._id.toString() !== cartItemId;
  });

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Cart item removed successfully",
    populatedCart,
  );
}

async function clearCart(req, res) {
  const cart = await getOrCreateCart(req.user._id);

  cart.items = [];

  calculateCartTotals(cart);

  await cart.save();

  const populatedCart = await getPopulatedCart(cart._id);

  return sendResponse(
    res,
    StatusCodes.OK,
    "Cart cleared successfully",
    populatedCart,
  );
}

export {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
