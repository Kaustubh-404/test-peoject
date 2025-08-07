// ===== FILE: src/types/clientSite.ts =====

export interface ClientSite {
  id: string;
  areaOfficerId: string;
  name: string;
  type: string | string[]; // Can be single value or array
  contactPerson: {
    fullName: string;
    designation: string;
    phoneNumber: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    pincode: string;
    state: string;
    landmark?: string;
  };
  geoLocation: {
    mapLink?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    plusCode?: string;
  };
  geoFencing: {
    type: "Circular Geofence" | "Polygon Geofence";
  };
  patroling: {
    patrol: boolean;
    patrolRouteDetails: PatrolRouteDetail[];
  };
  sitePosts: SitePost[];
}

export interface PatrolRouteDetail {
  name: string;
  routeCode?: string;
  patrolFrequency: {
    type: "time" | "count";
    hours?: number;
    minutes?: number;
    count?: number;
    numberOfPatrols: number;
  };
  patrolCheckpoints: PatrolCheckpoint[];
}

export interface PatrolCheckpoint {
  type: "qr code" | "photo";
  qrCode?: string;
  photo?: string;
}

export interface SitePost {
  name: string;
  geoFenceType: "Circular Geofence" | "Polygon Geofence";
  shifts: SitePostShift[];
}

export interface SitePostShift {
  days: string[];
  publicHolidayGuardRequired: boolean;
  dutyStartTime: string;
  dutyEndTime: string;
  checkInTime: string;
  latenessFrom: string;
  latenessTo: string;
  guardRequirements: GuardRequirement[];
  guardSelections?: APIGuardSelection[];
}

export interface GuardRequirement {
  guardType: string;
  count: number;
  uniformBy: "client" | "PSA";
  uniformType: string;
  tasks: boolean;
  alertnessChallenge: boolean;
  alertnessChallengeOccurrence?: number;
  patrolEnabled: boolean;
  selectPatrolRoutes: string[];
}

// ===== API REQUEST INTERFACE (MATCHES YOUR EXACT API) =====

export interface CreateSiteAPIRequest {
  clientId: string;
  siteId: string;
  areaOfficerId: string;
  siteName: string;
  siteType: string[]; // ["OFFICE", "CORPORATE"]
  siteContactPersonFullName?: string;
  siteContactDesignation?: string;
  siteContactPhone?: string;
  siteContactEmail?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  pinCode: string; // Note: API expects string, not number
  state: string;
  landMark?: string;
  siteLocationMapLink?: string;
  latitude?: number;
  longitude?: number;
  plusCode?: string;
  geofenceType: "CIRCLE" | "POLYGON" | "NO_GEOFENCE";
  geoFenceMapData?: {
    type: "circle" | "polygon";
    center?: { lat: number; lng: number };
    radius?: number;
    coordinates?: Array<{ lat: number; lng: number }>;
  };
  patrolling: boolean;
  patrolRoutes?: APIPatrolRoute[];
  sitePosts?: APISitePost[];
}

export interface APIPatrolRoute {
  routeName: string;
  patrolRouteCode?: string;
  patrolFrequency: "TIME" | "COUNT";
  hours?: number;
  minutes?: number;
  count?: number;
  roundsInShift?: number;
  checkpoints: APICheckpoint[];
}

export interface APICheckpoint {
  checkType: "QR_CODE" | "PHOTO";
  qrCodeUrl?: string;
  qrlocationImageUrl?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface APISitePost {
  postName: string;
  geofenceType: "CIRCLE" | "POLYGON";
  geoFenceMapData?: {
    type: "circle" | "polygon";
    center: { lat: number; lng: number };
    radius: number;
  };
  shifts: APIShift[];
}

export interface APIShift {
  daysOfWeek: string[]; // ["Monday", "Tuesday", ...]
  includePublicHolidays: boolean;
  dutyStartTime: string; // "18:00"
  dutyEndTime: string; // "06:00"
  checkInTime: string; // "17:45"
  latenessFrom: string; // "18:10"
  latenessTo: string; // "18:20"
  guardRequirements: APIGuardRequirement[];
  guardSelections?: APIGuardSelection[];
}

export interface APIGuardRequirement {
  guardType:
    | "SECURITY_GUARD"
    | "GUN_MAN"
    | "LADY_GUARD"
    | "BOUNCER"
    | "PERSONAL_GUARD"
    | "HEAD_GUARD"
    | "SITE_SUPERVISOR";
  guardCount: number;
  uniformBy: "CLIENT" | "PSA";
  uniformType: string;
  tasksEnabled: boolean;
  alertnessChallengeEnabled: boolean;
  alertnessChallengeCount?: number;
  patrolEnabled: boolean;
  selectedPatrolRoutes: string[];
}

export interface APIGuardSelection {
  guardId: string;
  alertnessChallenge: boolean;
  occurenceCount?: number;
  patrolling: boolean;
}

// ===== HELPER FUNCTIONS =====

// Helper function to safely get coordinates with defaults
const getCoordinatesFromData = (data: ClientSite) => {
  const lat = data.geoLocation?.coordinates?.latitude;
  const lng = data.geoLocation?.coordinates?.longitude;

  // Return valid coordinates or Mumbai defaults
  // Ensure coordinates are valid numbers and not zero
  const validLat = typeof lat === "number" && !isNaN(lat) && lat !== 0 ? lat : 19.076;
  const validLng = typeof lng === "number" && !isNaN(lng) && lng !== 0 ? lng : 72.8777;

  return {
    latitude: Number(Number(validLat).toFixed(5)),
    longitude: Number(Number(validLng).toFixed(5)),
  };
};

// Helper function to validate and clean guard type
const getValidGuardType = (guardType: string): APIGuardRequirement["guardType"] => {
  if (!guardType) return "SECURITY_GUARD";

  const cleanType = guardType
    .toString()
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z_]/g, "");

  const validTypes: APIGuardRequirement["guardType"][] = [
    "SECURITY_GUARD",
    "GUN_MAN",
    "LADY_GUARD",
    "BOUNCER",
    "PERSONAL_GUARD",
    "HEAD_GUARD",
    "SITE_SUPERVISOR",
  ];

  return validTypes.includes(cleanType as APIGuardRequirement["guardType"])
    ? (cleanType as APIGuardRequirement["guardType"])
    : "SECURITY_GUARD";
};

// Helper function to validate time format (ensure HH:MM format)
const validateTimeFormat = (time: string): string => {
  if (!time) return "00:00";

  // If already in HH:MM format, return as is
  if (/^\d{2}:\d{2}$/.test(time)) return time;

  // Try to parse and format common time formats
  try {
    const parts = time.split(":");
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
    }
  } catch (error) {
    console.warn(`Invalid time format: ${time}, using default 00:00`);
  }

  return "00:00";
};

// ===== COMPREHENSIVE TRANSFORMATION FUNCTION WITH VALIDATION =====

export const transformClientSiteToAPI = (data: ClientSite, clientId: string): CreateSiteAPIRequest => {
  const coordinates = getCoordinatesFromData(data);

  return {
    clientId,
    siteId: data.id,
    areaOfficerId: data.areaOfficerId,
    siteName: data.name || "",
    siteType: Array.isArray(data.type) ? data.type.filter((t) => t) : data.type ? [data.type] : [],
    siteContactPersonFullName: data.contactPerson?.fullName || undefined,
    siteContactDesignation: data.contactPerson?.designation || undefined,
    siteContactPhone: data.contactPerson?.phoneNumber || undefined,
    siteContactEmail: data.contactPerson?.email || undefined,
    addressLine1: data.address?.addressLine1 || "",
    addressLine2: data.address?.addressLine2 || undefined,
    city: data.address?.city || "",
    district: data.address?.district || "",
    pinCode: data.address?.pincode || "", // Keep as string to match API
    state: data.address?.state || "",
    landMark: data.address?.landmark || undefined,
    siteLocationMapLink: data.geoLocation?.mapLink || undefined,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    plusCode: data.geoLocation?.plusCode || undefined,
    geofenceType:
      data.geoFencing?.type === "Circular Geofence"
        ? "CIRCLE"
        : data.geoFencing?.type === "Polygon Geofence"
          ? "POLYGON"
          : "NO_GEOFENCE",
    geoFenceMapData: data.geoFencing?.type
      ? {
          type: data.geoFencing.type === "Circular Geofence" ? "circle" : "polygon",
          center: {
            lat: coordinates.latitude,
            lng: coordinates.longitude,
          },
          radius: 100, // Default radius
        }
      : undefined,
    patrolling: data.patroling?.patrol || false,
    patrolRoutes:
      data.patroling?.patrol && data.patroling?.patrolRouteDetails?.length
        ? data.patroling.patrolRouteDetails
            .filter((route) => route && route.name?.trim()) // Only include routes with names
            .map((route) => {
              const frequency = route.patrolFrequency;
              const isTimeType = frequency?.type === "time";
              const isCountType = frequency?.type === "count";

              return {
                routeName: route.name.trim(),
                patrolRouteCode: route.routeCode?.trim() || undefined,
                patrolFrequency: (frequency?.type?.toUpperCase() as "TIME" | "COUNT") || "TIME",
                hours: isTimeType ? frequency.hours || 0 : undefined,
                minutes: isTimeType ? frequency.minutes || 0 : undefined,
                count: isCountType ? Math.max(1, frequency.count || 1) : undefined,
                roundsInShift: Math.max(1, frequency?.numberOfPatrols || 1),
                checkpoints: route.patrolCheckpoints?.length
                  ? route.patrolCheckpoints
                      .filter((checkpoint) => checkpoint && checkpoint.type) // Only include valid checkpoints
                      .map((checkpoint) => ({
                        checkType: checkpoint.type === "qr code" ? "QR_CODE" : "PHOTO",
                        qrCodeUrl: checkpoint.type === "qr code" ? checkpoint.qrCode : undefined,
                        qrlocationImageUrl: checkpoint.type === "qr code" ? checkpoint.photo : undefined,
                        photoUrl: checkpoint.type === "photo" ? checkpoint.photo : undefined,
                        latitude: coordinates.latitude, // Use site coordinates as default
                        longitude: coordinates.longitude, // Use site coordinates as default
                      }))
                  : [], // Empty array if no checkpoints
              };
            })
        : [], // Empty array if patrolling is disabled or no routes
    sitePosts: data.sitePosts?.length
      ? data.sitePosts
          .filter((post) => post && post.name?.trim()) // Only include posts with names
          .map((post) => ({
            postName: post.name.trim(),
            geofenceType: post.geoFenceType === "Circular Geofence" ? "CIRCLE" : "POLYGON",
            geoFenceMapData: {
              type: post.geoFenceType === "Circular Geofence" ? "circle" : "polygon",
              center: { lat: coordinates.latitude, lng: coordinates.longitude }, // Use site coordinates
              radius: 25, // Default radius for posts
            },
            shifts: post.shifts?.length
              ? post.shifts
                  .filter((shift) => shift && shift.days?.length) // Only include shifts with days
                  .map((shift) => ({
                    daysOfWeek: shift.days.filter((day) => day), // Remove empty days
                    includePublicHolidays: shift.publicHolidayGuardRequired || false,
                    dutyStartTime: validateTimeFormat(shift.dutyStartTime),
                    dutyEndTime: validateTimeFormat(shift.dutyEndTime),
                    checkInTime: validateTimeFormat(shift.checkInTime),
                    latenessFrom: validateTimeFormat(shift.latenessFrom),
                    latenessTo: validateTimeFormat(shift.latenessTo),
                    guardRequirements: shift.guardRequirements?.length
                      ? shift.guardRequirements
                          .filter((req) => req && req.guardType && req.count && req.count > 0) // Only include valid requirements
                          .map((req) => ({
                            guardType: getValidGuardType(req.guardType),
                            guardCount: Math.max(1, req.count || 1), // Ensure minimum 1
                            uniformBy: (req.uniformBy?.toUpperCase() === "CLIENT" ? "CLIENT" : "PSA") as
                              | "CLIENT"
                              | "PSA",
                            uniformType: req.uniformType || "standard",
                            tasksEnabled: req.tasks !== false, // Default to true
                            alertnessChallengeEnabled: req.alertnessChallenge || false,
                            alertnessChallengeCount: req.alertnessChallenge
                              ? Math.max(0, req.alertnessChallengeOccurrence || 0)
                              : undefined,
                            patrolEnabled: req.patrolEnabled || false,
                            selectedPatrolRoutes: Array.isArray(req.selectPatrolRoutes)
                              ? req.selectPatrolRoutes.filter(
                                  (route) => route && typeof route === "string" && route.trim()
                                )
                              : [],
                          }))
                      : [], // Empty array if no guard requirements
                    guardSelections: Array.isArray(shift.guardSelections) ? shift.guardSelections : [],
                  }))
              : [], // Empty array if no shifts
          }))
      : [], // Empty array if no site posts
  };
};

// ===== VALIDATION HELPER FUNCTIONS =====

export const validatePatrolRouteData = (route: any): boolean => {
  if (!route || !route.name?.trim()) return false;

  // Validate patrol frequency
  if (!route.patrolFrequency || !route.patrolFrequency.type) return false;

  const freq = route.patrolFrequency;
  if (freq.type === "time") {
    const hasValidTime = (freq.hours && freq.hours > 0) || (freq.minutes && freq.minutes > 0);
    if (!hasValidTime) return false;
  } else if (freq.type === "count") {
    if (!freq.count || freq.count < 1) return false;
  }

  if (!freq.numberOfPatrols || freq.numberOfPatrols < 1) return false;

  // Validate checkpoints (optional but if present must be valid)
  if (route.patrolCheckpoints && route.patrolCheckpoints.length > 0) {
    return route.patrolCheckpoints.every(
      (checkpoint: any) =>
        checkpoint && checkpoint.type && (checkpoint.type === "qr code" || checkpoint.type === "photo")
    );
  }

  return true;
};

export const validateSitePostData = (post: any): boolean => {
  if (!post || !post.name?.trim()) return false;

  // Validate shifts
  if (!post.shifts || post.shifts.length === 0) return false;

  return post.shifts.every((shift: any) => {
    if (!shift || !shift.days || shift.days.length === 0) return false;
    if (!shift.dutyStartTime || !shift.dutyEndTime) return false;
    if (!shift.guardRequirements || shift.guardRequirements.length === 0) return false;

    return shift.guardRequirements.every((req: any) => req && req.guardType && req.count && req.count >= 1);
  });
};

export const validateClientSiteData = (data: ClientSite): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic required fields
  if (!data.name?.trim()) errors.push("Site name is required");
  if (!data.contactPerson?.fullName?.trim()) errors.push("Contact person name is required");
  if (!data.address?.addressLine1?.trim()) errors.push("Address line 1 is required");
  if (!data.address?.city?.trim()) errors.push("City is required");
  if (!data.address?.state?.trim()) errors.push("State is required");

  // Validate coordinates
  const lat = data.geoLocation?.coordinates?.latitude;
  const lng = data.geoLocation?.coordinates?.longitude;
  if (typeof lat !== "number" || isNaN(lat)) errors.push("Valid latitude is required");
  if (typeof lng !== "number" || isNaN(lng)) errors.push("Valid longitude is required");

  // Validate site posts
  if (!data.sitePosts?.length) {
    errors.push("At least one site post is required");
  } else {
    data.sitePosts.forEach((post, postIndex) => {
      if (!validateSitePostData(post)) {
        errors.push(`Site post ${postIndex + 1} has invalid data`);
      }
    });
  }

  // Validate patrol routes if patrolling is enabled
  if (data.patroling?.patrol && data.patroling?.patrolRouteDetails?.length) {
    data.patroling.patrolRouteDetails.forEach((route, routeIndex) => {
      if (!validatePatrolRouteData(route)) {
        errors.push(`Patrol route ${routeIndex + 1} has invalid data`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== PATROL ROUTE COORDINATE VALIDATION =====

export const validateAndFixPatrolRoutes = (
  patrolRoutes: any[],
  fallbackCoordinates: { latitude: number; longitude: number }
): any[] => {
  if (!patrolRoutes || patrolRoutes.length === 0) {
    return [];
  }

  return patrolRoutes.map((route, routeIndex) => {
    if (!route.checkpoints || route.checkpoints.length === 0) {
      // Add default checkpoint with valid coordinates
      return {
        ...route,
        checkpoints: [
          {
            checkType: "QR_CODE" as const,
            qrCodeUrl: undefined,
            qrlocationImageUrl: undefined,
            photoUrl: undefined,
            latitude: Number(fallbackCoordinates.latitude.toFixed(5)),
            longitude: Number(fallbackCoordinates.longitude.toFixed(5)),
          },
        ],
      };
    }

    // Fix any checkpoints with invalid coordinates
    const fixedCheckpoints = route.checkpoints.map((checkpoint: any, checkpointIndex: number) => {
      const lat = checkpoint.latitude;
      const lng = checkpoint.longitude;

      if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
        console.warn(`⚠️ Fixed invalid coordinates in route ${routeIndex}, checkpoint ${checkpointIndex}`);
        return {
          ...checkpoint,
          latitude: Number(fallbackCoordinates.latitude.toFixed(5)),
          longitude: Number(fallbackCoordinates.longitude.toFixed(5)),
        };
      }

      return {
        ...checkpoint,
        latitude: Number(Number(lat).toFixed(5)),
        longitude: Number(Number(lng).toFixed(5)),
      };
    });

    return {
      ...route,
      checkpoints: fixedCheckpoints,
    };
  });
};

// ===== ENHANCED TRANSFORMATION FUNCTION =====

export const debugTransformClientSiteToAPI = (data: ClientSite, clientId: string): CreateSiteAPIRequest => {
  console.log("🔍 DEBUG: Starting transformation with data:", {
    geoLocation: data.geoLocation,
    patroling: data.patroling,
  });

  const coordinates = getCoordinatesFromData(data);
  console.log("🔍 DEBUG: Calculated coordinates:", coordinates);

  // Validate coordinates before proceeding
  if (
    typeof coordinates.latitude !== "number" ||
    typeof coordinates.longitude !== "number" ||
    isNaN(coordinates.latitude) ||
    isNaN(coordinates.longitude)
  ) {
    console.error("❌ Invalid coordinates detected:", coordinates);
    throw new Error(`Invalid coordinates: lat=${coordinates.latitude}, lng=${coordinates.longitude}`);
  }

  const result = transformClientSiteToAPI(data, clientId);

  console.log("🔍 DEBUG: Final transformation result:", {
    patrolling: result.patrolling,
    patrolRoutes: result.patrolRoutes,
    coordinates: { lat: result.latitude, lng: result.longitude },
  });

  // Additional validation for patrol routes
  if (result.patrolRoutes && result.patrolRoutes.length > 0) {
    result.patrolRoutes.forEach((route, routeIndex) => {
      console.log(`🔍 DEBUG: Route ${routeIndex} checkpoints:`, route.checkpoints);

      // Ensure all checkpoints have valid coordinates
      route.checkpoints = route.checkpoints.map((checkpoint, checkpointIndex) => {
        if (
          typeof checkpoint.latitude !== "number" ||
          typeof checkpoint.longitude !== "number" ||
          isNaN(checkpoint.latitude) ||
          isNaN(checkpoint.longitude)
        ) {
          console.warn(`⚠️ Fixing invalid coordinates in route ${routeIndex}, checkpoint ${checkpointIndex}`);
          return {
            ...checkpoint,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          };
        }
        return checkpoint;
      });

      route.checkpoints.forEach((checkpoint, checkpointIndex) => {
        if (typeof checkpoint.latitude !== "number" || typeof checkpoint.longitude !== "number") {
          console.error(`❌ Still invalid coordinates in route ${routeIndex}, checkpoint ${checkpointIndex}:`, {
            latitude: checkpoint.latitude,
            longitude: checkpoint.longitude,
            type: typeof checkpoint.latitude,
            isNaN: isNaN(checkpoint.latitude as any),
          });
        }
      });
    });
  }

  return result;
};

// ===== SAFE TRANSFORMATION WITH VALIDATION AND DEBUGGING =====

export const safeTransformClientSiteToAPI = (
  data: ClientSite,
  clientId: string
): {
  success: boolean;
  data?: CreateSiteAPIRequest;
  errors?: string[];
} => {
  try {
    // Validate input data
    const validation = validateClientSiteData(data);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Basic validation
    if (!clientId?.trim()) {
      return {
        success: false,
        errors: ["Client ID is required"],
      };
    }

    // Use debug transformation in development, regular in production
    const transformedData =
      process.env.NODE_ENV === "development"
        ? debugTransformClientSiteToAPI(data, clientId)
        : transformClientSiteToAPI(data, clientId);

    // Final validation of coordinates in patrol routes
    if (transformedData.patrolRoutes && transformedData.patrolRoutes.length > 0) {
      for (const route of transformedData.patrolRoutes) {
        for (const checkpoint of route.checkpoints) {
          if (
            typeof checkpoint.latitude !== "number" ||
            typeof checkpoint.longitude !== "number" ||
            isNaN(checkpoint.latitude) ||
            isNaN(checkpoint.longitude)
          ) {
            return {
              success: false,
              errors: [
                `Invalid coordinates in patrol route "${route.routeName}": lat=${checkpoint.latitude}, lng=${checkpoint.longitude}`,
              ],
            };
          }
        }
      }
    }

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("Error transforming client site data:", error);
    return {
      success: false,
      errors: [`Transformation error: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
};

// ===== RESPONSE INTERFACES =====

export interface SiteAPIResponse {
  id: string;
  clientId: string;
  siteName: string;
  siteType: string[];
  siteContactPersonFullName?: string;
  siteContactDesignation?: string;
  siteContactPhone?: string;
  siteContactEmail?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  pinCode: string;
  state: string;
  landMark?: string;
  siteLocationMapLink?: string;
  latitude?: string;
  longitude?: string;
  plusCode?: string;
  geoFenceMapData?: any;
  geofenceType: string;
  patrolling: boolean;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    clientName: string;
    clientLogo?: string;
  };
  PatrolRoutes: PatrolRouteResponse[];
  SitePost: SitePostResponse[];
}

export interface PatrolRouteResponse {
  id: string;
  siteId: string;
  routeName: string;
  patrolRouteCode?: string;
  patrolFrequency: string;
  hours?: number;
  minutes?: number;
  count?: number;
  roundsInShift?: number;
  createdAt: string;
  updatedAt: string;
  checkpoints: CheckpointResponse[];
}

export interface CheckpointResponse {
  id: string;
  patrolRouteId: string;
  checkType: string;
  qrCodeUrl?: string;
  qrlocationImageUrl?: string;
  photoUrl?: string;
  latitude?: string;
  longitude?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SitePostResponse {
  id: string;
  siteId: string;
  postName: string;
  geofenceType: string;
  geoFenceMapData?: any;
  createdAt: string;
  updatedAt: string;
  SitePostShift: SitePostShiftResponse[];
}

export interface SitePostShiftResponse {
  id: string;
  sitePostId: string;
  daysOfWeek: string[];
  includePublicHolidays: boolean;
  dutyStartTime: string;
  dutyEndTime: string;
  checkInTime: string;
  latenessFrom: string;
  latenessTo: string;
  createdAt: string;
  updatedAt: string;
  guardRequirements: GuardRequirementResponse[];
  GuardSelection: GuardSelectionResponse[];
}

export interface GuardRequirementResponse {
  id: string;
  sitePostShiftId: string;
  guardType: string;
  guardCount: number;
  uniformBy: string;
  uniformType: string;
  tasksEnabled: boolean;
  alertnessChallengeEnabled: boolean;
  alertnessChallengeCount?: number;
  patrolEnabled: boolean;
  selectedPatrolRoutes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GuardSelectionResponse {
  id: string;
  shiftPostId: string;
  guardId: string;
  alertnessChallenge: boolean;
  occurenceCount?: number;
  patrolling: boolean;
  createdAt: string;
  updatedAt: string;
  guardReference: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    status: string;
  };
}

// ===== UTILITY TYPES =====

export type SiteType =
  | "OFFICE"
  | "RESIDENTIAL"
  | "INDUSTRIAL"
  | "HEALTHCARE"
  | "PUBLIC"
  | "EVENT"
  | "HIGH_SECURITY"
  | "RELIGIOUS";

export type GeofenceType = "CIRCLE" | "POLYGON" | "NO_GEOFENCE";

export type PatrolFrequencyType = "TIME" | "COUNT";

export type GuardType =
  | "SECURITY_GUARD"
  | "GUN_MAN"
  | "LADY_GUARD"
  | "BOUNCER"
  | "PERSONAL_GUARD"
  | "HEAD_GUARD"
  | "SITE_SUPERVISOR";

export type UniformProvider = "CLIENT" | "PSA";

export type CheckpointType = "QR_CODE" | "PHOTO";

// ===== FORM VALIDATION SCHEMAS (for react-hook-form) =====

export interface SiteFormValidation {
  step1: {
    id: string;
    name: string;
    type: string;
    "contactPerson.fullName": string;
    "contactPerson.designation": string;
    "contactPerson.phoneNumber": string;
    "contactPerson.email": string;
    areaOfficer: string;
  };
  step2: {
    "address.addressLine1": string;
    "address.city": string;
    "address.district": string;
    "address.pincode": string;
    "address.state": string;
    "geoFencing.type": string;
  };
  step3: {
    sitePosts: SitePost[];
  };
  step4: {
    // Guard selection validation if needed
  };
}

// ===== DEFAULT VALUES =====

export const defaultClientSite: ClientSite = {
  id: "",
  areaOfficerId: "",
  name: "",
  type: "",
  contactPerson: {
    fullName: "",
    designation: "",
    phoneNumber: "",
    email: "",
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    landmark: "",
  },
  geoLocation: {
    mapLink: "",
    coordinates: {
      latitude: 19.076, // Default to Mumbai coordinates
      longitude: 72.8777,
    },
    plusCode: "",
  },
  geoFencing: {
    type: "Circular Geofence",
  },
  patroling: {
    patrol: false,
    patrolRouteDetails: [],
  },
  sitePosts: [],
};

export const defaultSitePost: SitePost = {
  name: "",
  geoFenceType: "Circular Geofence",
  shifts: [],
};

export const defaultSitePostShift: SitePostShift = {
  days: [],
  publicHolidayGuardRequired: false,
  dutyStartTime: "00:00",
  dutyEndTime: "00:00",
  checkInTime: "00:00",
  latenessFrom: "00:00",
  latenessTo: "00:00",
  guardRequirements: [],
};

export const defaultGuardRequirement: GuardRequirement = {
  guardType: "SECURITY_GUARD",
  count: 1,
  uniformBy: "PSA",
  uniformType: "standard",
  tasks: true,
  alertnessChallenge: false,
  alertnessChallengeOccurrence: 0,
  patrolEnabled: false,
  selectPatrolRoutes: [],
};

export const defaultPatrolRouteDetail: PatrolRouteDetail = {
  name: "",
  routeCode: "",
  patrolFrequency: {
    type: "time",
    hours: 1,
    minutes: 0,
    count: 0,
    numberOfPatrols: 1,
  },
  patrolCheckpoints: [],
};

export const defaultPatrolCheckpoint: PatrolCheckpoint = {
  type: "qr code",
  qrCode: "",
  photo: "",
};
