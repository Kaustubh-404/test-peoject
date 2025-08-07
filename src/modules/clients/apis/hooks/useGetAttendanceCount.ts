import { useQuery } from "@tanstack/react-query";
import { getAttendanceCount } from "../services/client";

export const useGetAttendanceCount = (clientId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["attendanceCount", clientId, startDate, endDate],
    queryFn: () => getAttendanceCount(clientId, startDate, endDate),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
