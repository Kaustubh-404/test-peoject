import { guardsApi } from "../../../config/axios";

// Types based on the API response structure
export interface APIGuardAddress {
  id: string;
  guardId: string;
  line1: string;
  line2: string | null;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  landmark: string | null;
  country: string;
  type: "PERMANENT" | "TEMPORARY";
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface APIGuardContact {
  id: string;
  guardId: string;
  phoneNumber: string;
  contactType: "PRIMARY" | "ALTERNATE";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface APIEmergencyContact {
  id: string;
  guardId: string;
  contactName: string;
  relationship: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIFamilyMember {
  id: string;
  guardId: string;
  relationshipType: "FATHER" | "MOTHER" | "SPOUSE";
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIGuardDocument {
  id: string;
  guardId: string;
  type: string;
  documentNumber: string;
  documentUrl: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface APIEmployment {
  id: string;
  guardId: string;
  agencyId: string;
  startDate: string;
  endDate: string | null;
  position: string;
  salary: string;
  terminationReason: string | null;
  isCurrentEmployer: boolean;
  createdAt: string;
  updatedAt: string;
  agency: {
    id: string;
    name: string;
  };
}

export interface APICurrentAgency {
  id: string;
  name: string;
}

// Main API Guard interface (from the backend response)
export interface APIGuard {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  bloodGroup: string;
  height: number;
  weight: number;
  identificationMark: string;
  martialStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  photo: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  currentAgencyId: string;
  createdAt: string;
  updatedAt: string;
  addresses: APIGuardAddress[];
  contacts: APIGuardContact[];
  emergencyContacts: APIEmergencyContact[];
  familyMembers: APIFamilyMember[];
  documents: APIGuardDocument[];
  employments: APIEmployment[];
  currentAgency: APICurrentAgency;
}

// API Response structure
export interface GuardsAPIResponse {
  success: boolean;
  data: {
    data: APIGuard[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

// Frontend Guard interface (for the table)
export interface Guard {
  companyId: string;
  photo: string;
  name: string;
  phoneNumber: string;
  type: string;
  shiftTime: string;
  assignedClient: string;
  areaOfficer: string;
  upAndUpTrust: number;
  psaraStatus?: string;
  // Additional fields from API
  id: string;
  email: string;
  status: string;
  nationality: string;
  sex: string;
  bloodGroup: string;
  height: number;
  weight: number;
  martialStatus: string;
  currentAgency: string;
  currentAgencyId: string;
}

// Transform API guard data to frontend format
const transformAPIGuardToFrontend = (apiGuard: APIGuard): Guard => {
  // Get primary phone number
  const primaryContact = apiGuard.contacts.find((c) => c.contactType === "PRIMARY");
  const phoneNumber = primaryContact?.phoneNumber || apiGuard.phoneNumber;

  // Format phone number (remove country code for display)
  const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber.substring(3) : phoneNumber;

  // Get current employment details
  const currentEmployment = apiGuard.employments.find((e) => e.isCurrentEmployer);
  const position = currentEmployment?.position || "Security Guard";

  // Generate company ID from guard ID
  const companyId = apiGuard.id.replace("guard_", "").substring(0, 8);

  // Create full name
  const fullName = [apiGuard.firstName, apiGuard.middleName, apiGuard.lastName].filter(Boolean).join(" ");

  // Map guard type from position
  const guardTypeMapping: { [key: string]: string } = {
    "Senior Guard": "Security Guard",
    "Security Guard": "Security Guard",
    "Armed Guard": "Gunman",
    "Personal Security": "Personal Security Guard",
    "Lady Security": "Lady Guard",
  };

  const guardType = guardTypeMapping[position] || position || "Security Guard";

  // Generate mock data for fields not in API
  const mockShiftTime = "8 AM - 8 PM"; // Default shift
  const assignedClient = apiGuard.currentAgency?.name || "Unassigned";
  const areaOfficer = "Area Officer"; // Would need to come from another API
  const upAndUpTrust = Math.random() * 2 + 3; // Random trust score 3-5
  const psaraStatus = Math.random() > 0.5 ? "Completed" : "Pending";

  return {
    id: apiGuard.id,
    companyId,
    photo: apiGuard.photo,
    name: fullName,
    phoneNumber: formattedPhone,
    type: guardType,
    shiftTime: mockShiftTime,
    assignedClient,
    areaOfficer,
    upAndUpTrust,
    psaraStatus,
    email: apiGuard.email,
    status: apiGuard.status,
    nationality: apiGuard.nationality,
    sex: apiGuard.sex,
    bloodGroup: apiGuard.bloodGroup,
    height: apiGuard.height,
    weight: apiGuard.weight,
    martialStatus: apiGuard.martialStatus,
    currentAgency: apiGuard.currentAgency?.name || "N/A",
    currentAgencyId: apiGuard.currentAgencyId,
  };
};

// Guards API service
export const guardsAPIService = {
  // Get all guards
  getGuards: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ guards: Guard[]; total: number; page: number; totalPages: number }> => {
    try {
      console.log("🔄 Fetching guards from API...");

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);

      const url = `/guards${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const response = await guardsApi.get<GuardsAPIResponse>(url);

      console.log("✅ Guards fetched successfully:", response.data.data.data.length, "guards");

      // Transform API data to frontend format
      const transformedGuards = response.data.data.data.map(transformAPIGuardToFrontend);

      return {
        guards: transformedGuards,
        total: response.data.data.total,
        page: response.data.data.page,
        totalPages: response.data.data.totalPages,
      };
    } catch (error: any) {
      console.error("❌ Failed to fetch guards:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You do not have permission to view guards.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(error.response?.data?.message || "Failed to fetch guards.");
      }
    }
  },

  // Get guard by ID
  getGuardById: async (id: string): Promise<Guard> => {
    try {
      console.log("🔄 Fetching guard by ID:", id);

      const response = await guardsApi.get<{ success: boolean; data: APIGuard }>(`/guards/${id}`);

      console.log("✅ Guard fetched successfully:", response.data.data.firstName);

      return transformAPIGuardToFrontend(response.data.data);
    } catch (error: any) {
      console.error("❌ Failed to fetch guard:", error);

      if (error.response?.status === 404) {
        throw new Error("Guard not found.");
      } else if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      } else {
        throw new Error("Failed to fetch guard details.");
      }
    }
  },

  // Search guards (if the API supports it)
  searchGuards: async (searchTerm: string): Promise<Guard[]> => {
    try {
      const result = await guardsAPIService.getGuards({ search: searchTerm });
      return result.guards;
    } catch (error) {
      console.error("❌ Failed to search guards:", error);
      throw error;
    }
  },
};
