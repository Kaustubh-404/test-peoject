import type { ClientWithDetails } from "@modules/clients/types";
import { useApi } from "../../../../apis/base";

export interface ClientsApiResponse {
  success: boolean;
  data: ClientWithDetails[];
  timestamp: string;
}

export interface ClientDetailsApiResponse {
  success: boolean;
  data: {
    id: string;
    opAgencyId: string;
    clientLogo: string | null;
    clientName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    district: string;
    pinCode: number;
    state: string;
    landMark: string | null;
    contactPersonFullName: string;
    designation: string | null;
    contactPhone: string;
    contactEmail: string | null;
    emergencyContactName: string | null;
    emergencyContactDesignation: string | null;
    emergencyContactPhone: string | null;
    emergencyContactEmail: string | null;
    createdAt: string;
    updatedAt: string;
    opAgency: {
      id: string;
      agencyName: string;
      agencyImageUrl: string;
      registrationNumber: string;
      contactPersonName: string;
      contactEmail: string;
      contactPhone: string;
      addressLine1: string;
      city: string;
      state: string;
      pinCode: string;
      platformSubscriptionTier: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    uniforms: Array<{
      id: string;
      clientId: string;
      uniformName: string;
      topPartUrl: string;
      bottomPartUrl: string;
      accessoriesUrl: string;
      createdAt: string;
      updatedAt: string;
    }>;
    sites: Array<{
      id: string;
      clientId: string;
      siteName: string;
      siteType: string[];
      areaOfficerId: string;
      siteContactPersonFullName: string | null;
      siteContactDesignation: string | null;
      siteContactPhone: string | null;
      siteContactEmail: string | null;
      addressLine1: string | null;
      addressLine2: string | null;
      city: string;
      district: string;
      pinCode: string;
      state: string;
      landMark: string | null;
      siteLocationMapLink: string | null;
      latitude: string | null;
      longitude: string | null;
      plusCode: string | null;
      geoFenceMapData: any | null;
      geofenceType: string;
      patrolling: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  timestamp: string;
}

export const createClient = async (formData: FormData): Promise<any> => {
  const { postFormData } = useApi;
  const response = postFormData("/clients", formData);
  return response;
};

export const getClientsCounts = async (id: string, opAgencyId: string): Promise<ClientsApiResponse> => {
  const { get } = useApi;
  // Use the new API endpoint
  const response = await get(`/clients/count/${id}?opAgencyId=${opAgencyId}`);
  return response as ClientsApiResponse;
};

export const getClients = async (opAgencyId: string): Promise<ClientsApiResponse> => {
  const { get } = useApi;
  const response = await get(`/clients?opAgencyId=${opAgencyId}`);
  return response as ClientsApiResponse;
};

export const getClientById = async (clientId: string): Promise<ClientDetailsApiResponse> => {
  const { get } = useApi;
  const response = await get(`/clients/${clientId}`);
  return response as ClientDetailsApiResponse;
};

export interface AttendanceCountApiResponse {
  success: boolean;
  data: {
    success: boolean;
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
      totalDays: number;
    };
    summary: {
      totalSites: number;
      sitesWithAbsences: number;
      totalAbsentDuties: number;
      totalUniqueAbsentGuards: number;
      averageAbsencesPerSite: number;
    };
    topAbsentGuards: Array<{
      guardId: string;
      guardName: string;
      guardPhoto: string;
      absentDuties: Array<{
        dutyId: string;
        dutyDate: string;
        notes: string | null;
        createdAt: string;
      }>;
      totalAbsences: number;
      siteName: string;
      siteId: string;
    }>;
    siteBreakdown: Array<{
      siteId: string;
      siteName: string;
      totalGuardSelections: number;
      absentCount: number;
      uniqueAbsentGuards: number;
      absentGuardDetails: Array<{
        guardId: string;
        guardName: string;
        guardPhoto: string;
        absentDuties: Array<{
          dutyId: string;
          dutyDate: string;
          notes: string | null;
          createdAt: string;
        }>;
        totalAbsences: number;
      }>;
    }>;
  };
  timestamp: string;
}

export const getAttendanceCount = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<AttendanceCountApiResponse> => {
  const { get } = useApi;
  let url = `/clients/default/absent/${clientId}`;

  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await get(url);
  return response as AttendanceCountApiResponse;
};

export interface LateCountApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalLateIncidents: number;
    lateGuardsByDate: any[];
  };
  timestamp: string;
}

export const getLateCount = async (clientId: string): Promise<LateCountApiResponse> => {
  const { get } = useApi;
  const response = await get(`/clients/default/late/${clientId}/count`);
  return response as LateCountApiResponse;
};

export interface UniformDefaultsApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalUniformChecks: number;
    totalUniformDefaults: number;
    sitesWithDefaults: Array<{
      siteId: string;
      siteName: string;
      totalChecks: number;
      totalDefaults: number;
      defaultsByDate: Array<{
        date: string;
        defaultCount: number;
        guards: Array<{
          guardId: string;
          guardName: string;
          phoneNumber: string;
          failureReasons: string[];
          checkedAt: string;
          retryCount: number;
          triggeredBy: string;
          remarks: string | null;
          dutyId: string;
        }>;
      }>;
    }>;
  };
  timestamp: string;
}

export const getUniformDefaults = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<UniformDefaultsApiResponse> => {
  const { get } = useApi;
  let url = `/clients/default/uniform/${clientId}`;

  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await get(url);
  return response as UniformDefaultsApiResponse;
};

export interface AlertnessDefaultsApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalAlertnessChecks: number;
    totalAlertnessDefaults: number;
    sitesWithDefaults: Array<{
      siteId: string;
      siteName: string;
      totalChecks: number;
      totalDefaults: number;
      defaultsByDate: Array<{
        date: string;
        defaultCount: number;
        guards: Array<{
          guardId: string;
          guardName: string;
          phoneNumber: string;
          checkedAt: string;
          retryCount: number;
          triggeredBy: string;
          challengeType: string;
          score: number;
          totalQuestions: number;
          correctAnswers: number;
          timeSpent: number;
          minimumScore: number;
          difficulty: string;
          dutyId: string;
        }>;
      }>;
    }>;
  };
  timestamp: string;
}

export const getAlertnessDefaults = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<AlertnessDefaultsApiResponse> => {
  const { get } = useApi;
  let url = `/clients/default/alertness/${clientId}`;

  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await get(url);
  return response as AlertnessDefaultsApiResponse;
};

export interface GeofenceActivityApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalGuards: number;
    totalSessions: number;
    guardsWithGeofenceActivity: Array<{
      guardId: string;
      guardName: string;
      phoneNumber: string;
      dutyTime: string;
      date: string;
      siteName: string;
      sessionCount: number;
      sessions: Array<{
        number: number;
        entryTime: string | null;
        exitTime: string | null;
        duration: string;
        aoAction: string;
        viewReason: string;
      }>;
    }>;
  };
  timestamp: string;
}

export const getGeofenceActivity = async (clientId: string): Promise<GeofenceActivityApiResponse> => {
  const { get } = useApi;
  const response = await get(`/clients/default/geofence/${clientId}`);
  return response as GeofenceActivityApiResponse;
};

export interface LateGuardsApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalLateIncidents: number;
    lateGuardsByDate: Array<{
      siteId: string;
      siteName: string;
      date: string;
      guardCount: number;
      guards: Array<{
        guardId: string;
        guardName: string;
        phoneNumber: string;
        lateMinutes: number;
        reason: string | null;
        dutyId: string;
        timeDifference: number | null;
      }>;
    }>;
  };
  timestamp: string;
}

export const getLateGuards = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<LateGuardsApiResponse> => {
  const { get } = useApi;
  let url = `/clients/default/late/${clientId}`;

  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await get(url);
  return response as LateGuardsApiResponse;
};

export interface GeofenceDefaultsApiResponse {
  success: boolean;
  data: {
    clientId: string;
    clientName: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    totalGuards: number;
    totalSessions: number;
    guardsWithGeofenceActivity: Array<{
      guardId: string;
      guardName: string;
      phoneNumber: string;
      dutyTime: string;
      date: string;
      siteName: string;
      sessionCount: number;
      sessions: Array<{
        number: number;
        entryTime: string | null;
        exitTime: string | null;
        duration: string;
        aoAction: string;
        viewReason: string | null;
      }>;
    }>;
  };
  timestamp: string;
}

export const getGeofenceDefaults = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<GeofenceDefaultsApiResponse> => {
  const { get } = useApi;
  let url = `/clients/default/geofence/${clientId}`;

  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await get(url);
  return response as GeofenceDefaultsApiResponse;
};

// Correct API endpoint and structure based on the API documentation
export const updateClient = async (clientId: string, data: FormData): Promise<any> => {
  console.log("updateClient service called with:", { clientId, formData: Object.fromEntries(data.entries()) });

  const { patchFormData } = useApi;

  try {
    // Use the correct API endpoint and patchFormData method for FormData
    const response = await patchFormData(`/clients/${clientId}`, data);
    console.log("updateClient service response:", response);
    return response;
  } catch (error) {
    console.error("updateClient service error:", error);
    throw error;
  }
};

// Alternative updateClient with JSON instead of FormData for debugging
export const updateClientJson = async (clientId: string, data: any): Promise<any> => {
  const { patch } = useApi;

  // Log the data being sent for debugging
  console.log("UpdateClientJson - clientId:", clientId);
  console.log("UpdateClientJson - data:", data);

  return patch(`/clients/${clientId}`, data);
};

// Get guard references for a client
export const getGuardReferences = async (params: {
  clientId: string;
  page?: number;
  limit?: number;
  guardId?: string;
  agencyId?: string;
  siteId?: string;
  userType?: string;
  status?: string;
  gender?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<any> => {
  const { get } = useApi;

  const searchParams = new URLSearchParams();

  // Add all parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return get(`/guard-references${queryString}`);
};
