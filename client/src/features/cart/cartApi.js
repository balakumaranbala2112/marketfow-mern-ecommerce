import apiClient from "../../lib/axiosInstance.js";

export function getMyCart() {
  return apiClient.get("/cart");
}

export function addToCart({ productId, quantity }) {
  return apiClient.post("/cart/items", { productId, quantity });
}

export function updateCartItemQuantity(cartItemId, { quantity }) {
  return apiClient.put(`/cart/items/${cartItemId}`, { quantity });
}

export function removeCartItem(cartItemId) {
  return apiClient.delete(`/cart/items/${cartItemId}`);
}

export function clearCart() {
  return apiClient.delete("/cart");
}

export function applyCoupon({ code }) {
  return apiClient.post("/coupons/apply", { code });
}

export function removeCoupon() {
  return apiClient.delete("/coupons/remove");
}
