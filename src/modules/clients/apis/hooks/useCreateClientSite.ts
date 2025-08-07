import { useMutation } from "@tanstack/react-query";
import { createSite } from "../services/clientSite";

export const useCreateSite = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: createSite,
    onSuccess,
    onError: (error) => {
      console.error("Error creating site:", error);
      alert("There was an error submitting the form. Please try again.");
    },
  });
};
