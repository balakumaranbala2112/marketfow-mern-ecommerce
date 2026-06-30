import apiClient from "../../lib/axiosInstance.js";

export function getMyWishlist() {
  return apiClient.get("/wishlist");
}

export function addToWishlist({ productId }) {
  return apiClient.post("/wishlist/items", { productId });
}

export function removeFromWishlist(productId) {
  return apiClient.delete(`/wishlist/items/${productId}`);
}
