import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "../wishlistApi.js";

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getMyWishlist,
    select: (res) => res.data.data,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
