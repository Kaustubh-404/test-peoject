import { useApi } from "../../../../apis/base";

// Incident report API response types
export interface IncidentReportData {
  id: string;
  status: string;
  dateAndTime: string;
  closedAt?: string;
  siteName: string;
  siteId: string;
  events: string[];
  eventCount: number;
  evidenceCount: number;
  duration: number;
}

export interface IncidentReportResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalIncidents: number;
    openIncidents: number;
    closedIncidents: number;
    incidents: IncidentReportData[];
  };
  timestamp: string;
}

// Get client incident report API service
export const getClientIncidentReport = async (params: {
  clientId: string;
  status: "OPEN" | "CLOSED";
  startDate?: string;
  endDate?: string;
}): Promise<IncidentReportResponse> => {
  const { get } = useApi;

  const searchParams = new URLSearchParams();
  searchParams.append("status", params.status);

  if (params.startDate) {
    searchParams.append("startDate", params.startDate);
  }
  if (params.endDate) {
    searchParams.append("endDate", params.endDate);
  }

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return get(`/clients/incident/report/client/${params.clientId}${queryString}`);
};
