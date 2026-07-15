import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "../wishlistApi.js";
import useAuthStore from "../../../stores/authStore.js";

export function useWishlist() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getMyWishlist,
    select: (res) => res.data.data,
    enabled: !!user,
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
