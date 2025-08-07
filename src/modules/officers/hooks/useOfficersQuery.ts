// File: src/hooks/useOfficersQuery.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { officersAPIService, type APIOfficerProfile, type Officer } from "../service/officers-api.service";

// Query keys for officers
export const officersQueryKeys = {
  all: ["officers"] as const,
  lists: () => [...officersQueryKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; search?: string; agencyId?: string }) =>
    [...officersQueryKeys.lists(), params] as const,
  details: () => [...officersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...officersQueryKeys.details(), id] as const,
  profiles: () => [...officersQueryKeys.all, "profile"] as const,
  profile: (id: string, agencyId?: string) => [...officersQueryKeys.profiles(), id, agencyId] as const,
};

// Hook to get all officers with pagination
export const useOfficersQuery = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  agencyId?: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: officersQueryKeys.list(params),
    queryFn: () => officersAPIService.getOfficers(params),
    enabled: params?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to get a single officer by ID (basic Officer format)
export const useOfficerQuery = (id: string | undefined, agencyId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: officersQueryKeys.detail(id || ""),
    queryFn: () => officersAPIService.getOfficerById(id!, agencyId),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false; // Don't retry if officer not found
      }
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false; // Don't retry on auth errors
      }
      return failureCount < 2;
    },
  });
};

// Hook to get detailed officer profile (full APIOfficerProfile)
export const useOfficerProfileQuery = (id: string | undefined, agencyId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: officersQueryKeys.profile(id || "", agencyId),
    queryFn: () => officersAPIService.getOfficerProfile(id!, agencyId),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache for longer
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Only refetch if data is stale
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (officer not found) or auth errors
      if (error?.response?.status === 404 || error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to search officers
export const useOfficersSearch = (searchTerm: string, agencyId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...officersQueryKeys.lists(), "search", searchTerm, agencyId],
    queryFn: () => officersAPIService.searchOfficers(searchTerm, agencyId),
    enabled: enabled && !!searchTerm.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook to manage officers data with local state
export const useOfficersWithState = (agencyId?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isRefetching } = useOfficersQuery({ agencyId });

  // Extract data with defaults
  const officers = data?.officers || [];
  const total = data?.total || 0;
  const currentPage = data?.page || 1;
  const totalPages = data?.totalPages || 0;

  // Refresh function
  const refreshOfficers = async () => {
    await refetch();
  };

  // Invalidate all officers queries
  const invalidateOfficers = () => {
    queryClient.invalidateQueries({ queryKey: officersQueryKeys.all });
  };

  // Get officer by name from loaded data
  const getOfficerByName = (name: string): Officer | undefined => {
    const formattedSearchName = name.toLowerCase();

    // Try exact match first
    let officer = officers.find((o) => o.name.toLowerCase() === formattedSearchName);

    // If not found, try to match against URL-formatted name
    if (!officer) {
      officer = officers.find((o) => {
        const officerNameUrl = o.name.toLowerCase().replace(/\s+/g, "-");
        return officerNameUrl === formattedSearchName || formattedSearchName.includes(officerNameUrl);
      });
    }

    return officer;
  };

  // Get officer by ID (will fetch if not in cache)
  const getOfficerById = async (id: string): Promise<Officer> => {
    // First try to find in current data
    const officerInList = officers.find((o) => o.id === id);
    if (officerInList) {
      return officerInList;
    }

    // If not found, fetch from API
    return await officersAPIService.getOfficerById(id, agencyId);
  };

  return {
    officers,
    loading: isLoading,
    error: error?.message || null,
    total,
    currentPage,
    totalPages,
    isRefetching,
    refreshOfficers,
    invalidateOfficers,
    getOfficerByName,
    getOfficerById,
  };
};

// Utility hook for officers cache management
export const useOfficersUtils = () => {
  const queryClient = useQueryClient();

  const prefetchOfficers = async (params?: { page?: number; limit?: number; search?: string; agencyId?: string }) => {
    await queryClient.prefetchQuery({
      queryKey: officersQueryKeys.list(params),
      queryFn: () => officersAPIService.getOfficers(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchOfficerProfile = async (id: string, agencyId?: string) => {
    await queryClient.prefetchQuery({
      queryKey: officersQueryKeys.profile(id, agencyId),
      queryFn: () => officersAPIService.getOfficerProfile(id, agencyId),
      staleTime: 10 * 60 * 1000,
    });
  };

  const invalidateOfficers = () => {
    queryClient.invalidateQueries({
      queryKey: officersQueryKeys.all,
    });
  };

  const invalidateOfficerProfile = (id: string, agencyId?: string) => {
    queryClient.invalidateQueries({
      queryKey: officersQueryKeys.profile(id, agencyId),
    });
  };

  const removeOfficerFromCache = (id: string) => {
    queryClient.removeQueries({
      queryKey: officersQueryKeys.detail(id),
    });
  };

  const removeOfficerProfileFromCache = (id: string, agencyId?: string) => {
    queryClient.removeQueries({
      queryKey: officersQueryKeys.profile(id, agencyId),
    });
  };

  const getOfficerFromCache = (id: string): Officer | undefined => {
    return queryClient.getQueryData<Officer>(officersQueryKeys.detail(id));
  };

  const getOfficerProfileFromCache = (id: string, agencyId?: string): APIOfficerProfile | undefined => {
    return queryClient.getQueryData<APIOfficerProfile>(officersQueryKeys.profile(id, agencyId));
  };

  const clearAllOfficersCache = () => {
    queryClient.removeQueries({
      queryKey: officersQueryKeys.all,
    });
  };

  return {
    prefetchOfficers,
    prefetchOfficerProfile,
    invalidateOfficers,
    invalidateOfficerProfile,
    removeOfficerFromCache,
    removeOfficerProfileFromCache,
    getOfficerFromCache,
    getOfficerProfileFromCache,
    clearAllOfficersCache,
  };
};
