import { useQuery } from "@tanstack/react-query";
import { getAlertnessDefaults } from "../services/client";

export const useGetAlertnessDefaults = (clientId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["alertnessDefaults", clientId, startDate, endDate],
    queryFn: () => getAlertnessDefaults(clientId, startDate, endDate),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
