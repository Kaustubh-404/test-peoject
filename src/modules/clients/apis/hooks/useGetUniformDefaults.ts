import { useQuery } from "@tanstack/react-query";
import { getUniformDefaults } from "../services/client";

export const useGetUniformDefaults = (clientId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["uniformDefaults", clientId, startDate, endDate],
    queryFn: () => getUniformDefaults(clientId, startDate, endDate),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
