import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../categoryApi.js";

export function useCategories(params = {}) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
    select: (res) => res.data.data,
    staleTime: 5 * 60 * 1000,
  });
}
