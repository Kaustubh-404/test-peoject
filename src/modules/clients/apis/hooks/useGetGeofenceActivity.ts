import { useQuery } from "@tanstack/react-query";
import { getGeofenceDefaults } from "../services/client";

export const useGetGeofenceActivity = (clientId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["geofenceDefaults", clientId, startDate, endDate],
    queryFn: () => getGeofenceDefaults(clientId, startDate, endDate),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
