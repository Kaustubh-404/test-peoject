import { useQuery } from "@tanstack/react-query";
import { getClientTasks as getTasks } from "../../../clients/apis/services/tasks";
import {
  getAreaOfficers,
  getDashboardOverview,
  getIncidentReports,
  getLateUniformSummary,
  getLivelinessAlerts,
  getShiftPerformanceIssues,
} from "../services/dashboard";

export const useDashboardOverview = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["dashboardOverview", params],
    queryFn: () => getDashboardOverview(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useLivelinessAlerts = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["livelinessAlerts", params],
    queryFn: () => getLivelinessAlerts(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useLateUniformSummary = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["lateUniformSummary", params],
    queryFn: () => getLateUniformSummary(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useShiftPerformanceIssues = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["shiftPerformanceIssues", params],
    queryFn: () => getShiftPerformanceIssues(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useAreaOfficers = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["areaOfficers", params],
    queryFn: () => getAreaOfficers(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useIncidentReports = (params: {
  opAgencyId: string;
  clientId?: string;
  dutyDate?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  userTypeFilter?: string;
  incidentStatus?: string;
}) => {
  return useQuery({
    queryKey: ["incidentReports", params],
    queryFn: () => getIncidentReports(params),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};

export const useAreaOfficerTasks = (params: { opAgencyId: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["areaOfficerTasks", params],
    queryFn: () =>
      getTasks({
        page: params.page,
        limit: params.limit,
      }),
    enabled: !!params.opAgencyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes for live dashboard
    refetchOnWindowFocus: false,
  });
};
