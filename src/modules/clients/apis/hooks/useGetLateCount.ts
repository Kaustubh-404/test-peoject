import { useQuery } from "@tanstack/react-query";
import { getLateGuards } from "../services/client";

export const useGetLateCount = (clientId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["lateGuards", clientId, startDate, endDate],
    queryFn: () => getLateGuards(clientId, startDate, endDate),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
