import React, { createContext, useContext, useState, type ReactNode } from "react";
import { officersAPIService, type Officer } from "../service/officers-api.service";

// Create the context
interface OfficerContextType {
  officers: Officer[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  initialized: boolean; // Add flag to track if data has been loaded
  getOfficerByName: (name: string) => Officer | undefined;
  getOfficerById: (id: string) => Promise<Officer>;
  refreshOfficers: () => Promise<void>;
  searchOfficers: (searchTerm: string) => Promise<void>;
  loadOfficers: (page?: number, limit?: number) => Promise<void>;
  forceRefreshOfficers: () => Promise<void>;
  initializeOfficers: () => Promise<void>; // Add initialization method
}

const OfficerContext = createContext<OfficerContextType | undefined>(undefined);

// Provider component
export const OfficerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Changed to false initially
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [initialized, setInitialized] = useState<boolean>(false); // Track initialization

  // Load officers from API
  const loadOfficers = async (page: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading officers from API...");

      const result = await officersAPIService.getOfficers({ page, limit });

      setOfficers(result.officers);
      setTotal(result.total);
      setCurrentPage(page);
      setTotalPages(result.totalPages);
      setInitialized(true); // Mark as initialized

      console.log("✅ Officers loaded successfully:", result.officers.length, "officers");
    } catch (err: any) {
      console.error("❌ Failed to load officers:", err);
      setError(err.message || "Failed to load officers");
      setOfficers([]); // Clear officers on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize officers (called manually when needed)
  const initializeOfficers = async () => {
    if (!initialized) {
      console.log("🚀 Initializing officers for the first time...");
      await loadOfficers();
    } else {
      console.log("ℹ️ Officers already initialized, skipping...");
    }
  };

  // Force refresh officers (bypasses any caching and always fetches fresh data)
  const forceRefreshOfficers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Force refreshing officers from API (bypassing cache)...");

      // Add a timestamp to bypass any potential caching
      const timestamp = new Date().getTime();
      const result = await officersAPIService.getOfficers({
        page: currentPage,
        limit: 50,
        // Add timestamp as a query param to force fresh request
        _t: timestamp,
      } as any);

      setOfficers(result.officers);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setInitialized(true); // Ensure initialized flag is set

      console.log("✅ Officers force refreshed successfully:", result.officers.length, "officers");
    } catch (err: any) {
      console.error("❌ Failed to force refresh officers:", err);
      setError(err.message || "Failed to refresh officers");
    } finally {
      setLoading(false);
    }
  };

  // Function to get an officer by name (search in loaded officers)
  const getOfficerByName = (name: string): Officer | undefined => {
    // Format the name to match URL format (lowercase with hyphens)
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

  // Function to get an officer by ID (API call)
  const getOfficerById = async (id: string): Promise<Officer> => {
    try {
      return await officersAPIService.getOfficerById(id);
    } catch (err: any) {
      console.error("❌ Failed to get officer by ID:", err);
      throw err;
    }
  };

  // Function to refresh officers (reload from API)
  const refreshOfficers = async () => {
    console.log("🔄 Refreshing officers list...");
    await loadOfficers(currentPage);
  };

  // Function to search officers
  const searchOfficers = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Searching officers:", searchTerm);

      if (!searchTerm.trim()) {
        // If search term is empty, reload all officers
        await loadOfficers();
        return;
      }

      const searchResults = await officersAPIService.searchOfficers(searchTerm);
      setOfficers(searchResults);
      setTotal(searchResults.length);
      setCurrentPage(1);
      setTotalPages(1);

      console.log("✅ Officer search completed:", searchResults.length, "officers found");
    } catch (err: any) {
      console.error("❌ Officer search failed:", err);
      setError(err.message || "Officer search failed");
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVED: Auto-loading useEffect that was causing the issue
  // useEffect(() => {
  //   loadOfficers();
  // }, []); // Only run once on mount

  // Context value
  const value: OfficerContextType = {
    officers,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    initialized,
    getOfficerByName,
    getOfficerById,
    refreshOfficers,
    searchOfficers,
    loadOfficers,
    forceRefreshOfficers,
    initializeOfficers, // Add initialization method
  };

  return <OfficerContext.Provider value={value}>{children}</OfficerContext.Provider>;
};

// Custom hook for using the officer context
export const useOfficers = () => {
  const context = useContext(OfficerContext);
  if (context === undefined) {
    throw new Error("useOfficers must be used within an OfficerProvider");
  }
  return context;
};

// Export the Officer interface for use in other components
export type { Officer };