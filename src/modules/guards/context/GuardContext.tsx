import React, { createContext, useContext, useState, type ReactNode } from "react";
import { guardsAPIService, type Guard } from "../services/guards-api.service";

// Create the context
interface GuardContextType {
  guards: Guard[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  initialized: boolean; // Add flag to track if data has been loaded
  getGuardByName: (name: string) => Guard | undefined;
  getGuardById: (id: string) => Promise<Guard>;
  refreshGuards: () => Promise<void>;
  searchGuards: (searchTerm: string) => Promise<void>;
  loadGuards: (page?: number, limit?: number) => Promise<void>;
  forceRefreshGuards: () => Promise<void>;
  initializeGuards: () => Promise<void>; // Add initialization method
}

const GuardContext = createContext<GuardContextType | undefined>(undefined);

// Provider component
export const GuardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Changed to false initially
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false); // Track initialization

  // Load guards from API
  const loadGuards = async (page: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading guards from API...");

      const result = await guardsAPIService.getGuards({ page, limit });

      setGuards(result.guards);
      setTotal(result.total);
      setCurrentPage(page);
      setTotalPages(result.totalPages);
      setInitialized(true); // Mark as initialized

      console.log("✅ Guards loaded successfully:", result.guards.length, "guards");
    } catch (err: any) {
      console.error("❌ Failed to load guards:", err);
      setError(err.message || "Failed to load guards");
      setGuards([]); // Clear guards on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize guards (called manually when needed)
  const initializeGuards = async () => {
    if (!initialized) {
      console.log("🚀 Initializing guards for the first time...");
      await loadGuards();
    } else {
      console.log("ℹ️ Guards already initialized, skipping...");
    }
  };

  // Force refresh guards (bypasses any caching and always fetches fresh data)
  const forceRefreshGuards = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Force refreshing guards from API (bypassing cache)...");

      // Add a timestamp to bypass any potential caching
      const timestamp = new Date().getTime();
      const result = await guardsAPIService.getGuards({
        page: currentPage,
        limit: 50,
        // Add timestamp as a query param to force fresh request
        _t: timestamp,
      } as any);

      setGuards(result.guards);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setInitialized(true); // Ensure initialized flag is set

      console.log("✅ Guards force refreshed successfully:", result.guards.length, "guards");
    } catch (err: any) {
      console.error("❌ Failed to force refresh guards:", err);
      setError(err.message || "Failed to refresh guards");
    } finally {
      setLoading(false);
    }
  };

  // Function to get a guard by name (search in loaded guards)
  const getGuardByName = (name: string): Guard | undefined => {
    // Format the name to match URL format (lowercase with hyphens)
    const formattedSearchName = name.toLowerCase();

    // Try exact match first
    let guard = guards.find((g) => g.name.toLowerCase() === formattedSearchName);

    // If not found, try to match against URL-formatted name
    if (!guard) {
      guard = guards.find((g) => {
        const guardNameUrl = g.name.toLowerCase().replace(/\s+/g, "-");
        return guardNameUrl === formattedSearchName || formattedSearchName.includes(guardNameUrl);
      });
    }

    return guard;
  };

  // Function to get a guard by ID (API call)
  const getGuardById = async (id: string): Promise<Guard> => {
    try {
      return await guardsAPIService.getGuardById(id);
    } catch (err: any) {
      console.error("❌ Failed to get guard by ID:", err);
      throw err;
    }
  };

  // Function to refresh guards (reload from API)
  const refreshGuards = async () => {
    console.log("🔄 Refreshing guards list...");
    await loadGuards(currentPage);
  };

  // Function to search guards
  const searchGuards = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Searching guards:", searchTerm);

      if (!searchTerm.trim()) {
        // If search term is empty, reload all guards
        await loadGuards();
        return;
      }

      const searchResults = await guardsAPIService.searchGuards(searchTerm);
      setGuards(searchResults);
      setTotal(searchResults.length);
      setCurrentPage(1);
      setTotalPages(1);

      console.log("✅ Search completed:", searchResults.length, "guards found");
    } catch (err: any) {
      console.error("❌ Search failed:", err);
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVED: Auto-loading useEffect that was causing the issue
  // useEffect(() => {
  //   loadGuards();
  // }, []); 

  // Context value
  const value: GuardContextType = {
    guards,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    initialized,
    getGuardByName,
    getGuardById,
    refreshGuards,
    searchGuards,
    loadGuards,
    forceRefreshGuards,
    initializeGuards, // Add initialization method
  };

  return <GuardContext.Provider value={value}>{children}</GuardContext.Provider>;
};

// Custom hook for using the guard context
export const useGuards = () => {
  const context = useContext(GuardContext);
  if (context === undefined) {
    throw new Error("useGuards must be used within a GuardProvider");
  }
  return context;
};

// Export the Guard interface for use in other components
export type { Guard };