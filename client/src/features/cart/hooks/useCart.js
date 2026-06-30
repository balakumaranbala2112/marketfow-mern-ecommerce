import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart, applyCoupon, removeCoupon } from "../cartApi.js";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getMyCart,
    select: (res) => res.data.data,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }) =>
      updateCartItemQuantity(cartItemId, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
