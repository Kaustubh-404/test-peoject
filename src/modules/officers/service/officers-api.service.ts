// File: src/services/officers-api.service.ts
import { authApi, guardsApi } from "../../../config/axios";

// Types based on the API response structure for guard-references
export interface APIGuardReference {
  id: string; // This is the reference ID
  guardId: string; // This is the actual guard ID needed for profile API
  phoneNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  photo: string;
  bloodGroup: string;
  currentAgencyId: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  userType: "GUARD" | "AREA_OFFICER";
  createdAt: string;
  updatedAt: string;
}

// API Response structure for guard-references
export interface GuardReferencesAPIResponse {
  success: boolean;
  data: {
    guards: APIGuardReference[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp: string;
}

// Detailed officer profile (same as guard structure from /api/v1/guards/{id})
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
  type: "PERMANENT" | "CURRENT";
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
  position: string | null;
  salary: string | null;
  terminationReason: string | null;
  assignedDutyArea: string | null;
  areaManager: string | null;
  isCurrentEmployer: boolean;
  psaraStatus: string;
  licenseNumber: string | null;
  dateOfIssue: string | null;
  validUntil: string | null;
  valindIn: string | null;
  createdAt: string;
  updatedAt: string;
  agency: {
    id: string;
    name: string;
  };
  // Add these for compatibility with the employment card
  assignedArea?: string;
}

export interface APICurrentAgency {
  id: string;
  name: string;
}

// Detailed Officer Profile (same structure as guard from /api/v1/guards/{id})
export interface APIOfficerProfile {
  id: string; // This is the guard ID, not the reference ID
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
  userType: "AREA_OFFICER";
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

// Frontend Officer interface (for the table)
export interface Officer {
  companyId: string;
  photo: string;
  name: string;
  phoneNumber: string;
  designation: string;
  shiftTime: string;
  assignedArea: string;
  assignedSites: number;
  assignedGuards: number;
  upAndUpTrust: number;
  psaraStatus?: string;
  // Additional fields from API
  id: string; // This should be the reference ID for UI purposes
  guardId: string; // This is the actual guard ID for API calls
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

// Transform API guard reference data to frontend Officer format
const transformAPIReferenceToOfficer = (apiRef: APIGuardReference): Officer => {
  // Format phone number (remove country code for display)
  const formattedPhone = apiRef.phoneNumber.startsWith("+91") ? apiRef.phoneNumber.substring(3) : apiRef.phoneNumber;

  // Generate company ID from officer ID
  const companyId = apiRef.id.replace("guard_", "").substring(0, 8);

  // Create full name
  const fullName = [apiRef.firstName, apiRef.middleName, apiRef.lastName].filter(Boolean).join(" ");

  // Generate mock data for fields not in the guard-references API
  const mockDesignation = "Area Officer"; // Default designation for area officers
  const mockShiftTime = "8 AM - 8 PM"; // Default shift
  const mockAssignedArea = "Area Assignment"; // Would need additional API
  const mockAssignedSites = Math.floor(Math.random() * 50) + 10; // Mock data
  const mockAssignedGuards = Math.floor(Math.random() * 100) + 20; // Mock data
  const mockUpAndUpTrust = Math.random() * 2 + 3; // Random trust score 3-5
  const mockPsaraStatus = Math.random() > 0.5 ? "Completed" : "Pending";

  // Mock additional fields not available in guard-references
  const mockNationality = "Indian";
  const mockHeight = 170;
  const mockWeight = 70;
  const mockMartialStatus = "SINGLE";

  return {
    id: apiRef.id, // Reference ID for UI
    guardId: apiRef.guardId, // 🔥 CRITICAL: Store the actual guard ID for API calls
    companyId,
    photo: apiRef.photo,
    name: fullName,
    phoneNumber: formattedPhone,
    designation: mockDesignation,
    shiftTime: mockShiftTime,
    assignedArea: mockAssignedArea,
    assignedSites: mockAssignedSites,
    assignedGuards: mockAssignedGuards,
    upAndUpTrust: mockUpAndUpTrust,
    psaraStatus: mockPsaraStatus,
    email: apiRef.email,
    status: apiRef.status,
    nationality: mockNationality,
    sex: apiRef.sex,
    bloodGroup: apiRef.bloodGroup,
    height: mockHeight,
    weight: mockWeight,
    martialStatus: mockMartialStatus,
    currentAgency: "Current Agency", // Would need agency lookup
    currentAgencyId: apiRef.currentAgencyId,
  };
};

// Transform detailed officer profile to frontend Officer format
const transformAPIProfileToOfficer = (apiProfile: APIOfficerProfile): Officer => {
  // Get primary phone number
  const primaryContact = apiProfile.contacts.find((c) => c.contactType === "PRIMARY");
  const phoneNumber = primaryContact?.phoneNumber || apiProfile.phoneNumber;

  // Format phone number (remove country code for display)
  const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber.substring(3) : phoneNumber;

  // Get current employment details
  const currentEmployment = apiProfile.employments.find((e) => e.isCurrentEmployer);
  const designation = currentEmployment?.position || "Area Officer";

  // Generate company ID from officer ID
  const companyId = apiProfile.id.replace("guard_", "").substring(0, 8);

  // Create full name
  const fullName = [apiProfile.firstName, apiProfile.middleName, apiProfile.lastName].filter(Boolean).join(" ");

  // Generate mock data for fields not available in detailed profile
  const mockShiftTime = "8 AM - 8 PM";
  const mockAssignedArea = "Area Assignment";
  const mockAssignedSites = Math.floor(Math.random() * 50) + 10;
  const mockAssignedGuards = Math.floor(Math.random() * 100) + 20;
  const mockUpAndUpTrust = Math.random() * 2 + 3;
  const mockPsaraStatus = Math.random() > 0.5 ? "Completed" : "Pending";

  return {
    id: apiProfile.id, // In profile, this is already the guard ID
    guardId: apiProfile.id, // Same as ID in profile context
    companyId,
    photo: apiProfile.photo,
    name: fullName,
    phoneNumber: formattedPhone,
    designation,
    shiftTime: mockShiftTime,
    assignedArea: mockAssignedArea,
    assignedSites: mockAssignedSites,
    assignedGuards: mockAssignedGuards,
    upAndUpTrust: mockUpAndUpTrust,
    psaraStatus: mockPsaraStatus,
    email: apiProfile.email,
    status: apiProfile.status,
    nationality: apiProfile.nationality,
    sex: apiProfile.sex,
    bloodGroup: apiProfile.bloodGroup,
    height: apiProfile.height,
    weight: apiProfile.weight,
    martialStatus: apiProfile.martialStatus,
    currentAgency: apiProfile.currentAgency?.name || "N/A",
    currentAgencyId: apiProfile.currentAgencyId,
  };
};

// Officers API service
export const officersAPIService = {
  // Get all officers using guard-references API with AREA_OFFICER filter
  getOfficers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    agencyId?: string;
  }): Promise<{ officers: Officer[]; total: number; page: number; totalPages: number }> => {
    try {
      console.log("🔄 Fetching officers from guard-references API...");

      // Build query parameters - ALWAYS filter by AREA_OFFICER userType
      const queryParams = new URLSearchParams();
      queryParams.append("userType", "AREA_OFFICER"); // Key filter for officers

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.agencyId) queryParams.append("agencyId", params.agencyId);

      const url = `/guard-references/guards?${queryParams.toString()}`;

      const response = await authApi.get<GuardReferencesAPIResponse>(url);

      if (!response.data.success) {
        throw new Error("Failed to fetch officers");
      }

      console.log("✅ Officers fetched successfully:", response.data.data.guards.length, "officers");

      // Transform API data to frontend format
      const transformedOfficers = response.data.data.guards.map(transformAPIReferenceToOfficer);

      return {
        officers: transformedOfficers,
        total: response.data.data.meta.total,
        page: response.data.data.meta.page,
        totalPages: response.data.data.meta.totalPages,
      };
    } catch (error: any) {
      console.error("❌ Failed to fetch officers:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You do not have permission to view officers.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK" || !error.response) {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(error.response?.data?.message || "Failed to fetch officers.");
      }
    }
  },

  // 🔥 FIXED: Use guard ID directly for profile fetch
  getOfficerById: async (guardId: string, agencyId?: string): Promise<Officer> => {
    try {
      console.log("🔄 Fetching officer details by GUARD ID:", guardId);

      // Use the guard ID directly to fetch detailed profile
      const url = agencyId ? `/guards/${guardId}?agencyId=${encodeURIComponent(agencyId)}` : `/guards/${guardId}`;

      const response = await guardsApi.get<{ success: boolean; data: APIOfficerProfile }>(url);

      if (!response.data.success) {
        throw new Error("Failed to fetch officer details");
      }

      console.log("✅ Officer details fetched successfully:", response.data.data.firstName);

      // Verify this is actually an officer
      if (response.data.data.userType !== "AREA_OFFICER") {
        throw new Error("The requested user is not an area officer");
      }

      return transformAPIProfileToOfficer(response.data.data);
    } catch (error: any) {
      console.error("❌ Failed to fetch officer details:", error);

      if (error.response?.status === 404) {
        throw new Error("Officer not found.");
      } else if (error.response?.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You do not have permission to view this officer.");
      } else {
        throw new Error("Failed to fetch officer details.");
      }
    }
  },

  // 🔥 FIXED: Use guard ID directly for profile fetch
  getOfficerProfile: async (guardId: string, agencyId?: string): Promise<APIOfficerProfile> => {
    try {
      console.log("🔄 Fetching officer profile by GUARD ID:", guardId);

      // Use the guard ID directly to fetch detailed profile
      const url = agencyId ? `/guards/${guardId}?agencyId=${encodeURIComponent(agencyId)}` : `/guards/${guardId}`;

      const response = await guardsApi.get<{ success: boolean; data: APIOfficerProfile }>(url);

      if (!response.data.success) {
        throw new Error("Failed to fetch officer profile");
      }

      // Verify this is actually an officer
      if (response.data.data.userType !== "AREA_OFFICER") {
        throw new Error("The requested user is not an area officer");
      }

      console.log("✅ Officer profile fetched successfully:", response.data.data.firstName);

      return response.data.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch officer profile:", error);
      throw error;
    }
  },

  // Search officers (using the guard-references API with search parameter)
  searchOfficers: async (searchTerm: string, agencyId?: string): Promise<Officer[]> => {
    try {
      const result = await officersAPIService.getOfficers({
        search: searchTerm,
        agencyId,
      });
      return result.officers;
    } catch (error) {
      console.error("❌ Failed to search officers:", error);
      throw error;
    }
  },
};
