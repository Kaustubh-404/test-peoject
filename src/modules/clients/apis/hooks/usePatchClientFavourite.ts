import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../../../apis/base";

interface PatchFavouritePayload {
  id: string;
  favourite: boolean;
}

export const usePatchClientFavourite = () => {
  const { patch } = useApi;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, favourite }: PatchFavouritePayload) => {
      return patch(`/clients/mark-favourite/${id}?favourite=${favourite}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
