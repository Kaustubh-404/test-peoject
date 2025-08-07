import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
// Import TanStack Query when APIs are ready
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define interfaces for settings data structures
export interface SecurityGuardType {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Area {
  id: string;
  name: string;
  isActive: boolean;
}

export interface AreaManager {
  id: string;
  name: string;
  areaId: string;
  isActive: boolean;
}

export interface SiteType {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
}

export interface OperationalSettings {
  securityGuardTypes: SecurityGuardType[];
  areas: Area[];
  areaManagers: AreaManager[];
  siteTypes: SiteType[];
  lastModified: string;
}

export interface UniformSettings {
  uniformTypes: any[]; // Define based on your requirements
  lastModified: string;
}

export interface DataSettings {
  dataConfigurations: any[]; // Define based on your requirements
  lastModified: string;
}

export interface SettingsContextType {
  // Operational Settings
  operationalSettings: OperationalSettings | null;

  // Uniform Settings
  uniformSettings: UniformSettings | null;

  // Data Settings
  dataSettings: DataSettings | null;

  // Loading states
  loading: boolean;
  operationalLoading: boolean;
  uniformLoading: boolean;
  dataLoading: boolean;

  // Error states
  error: string | null;

  // Methods for future API integration
  fetchOperationalSettings: () => Promise<void>;
  fetchUniformSettings: () => Promise<void>;
  fetchDataSettings: () => Promise<void>;
  updateOperationalSettings: (settings: Partial<OperationalSettings>) => Promise<void>;
  updateUniformSettings: (settings: Partial<UniformSettings>) => Promise<void>;
  updateDataSettings: (settings: Partial<DataSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // State management
  const [operationalSettings, setOperationalSettings] = useState<OperationalSettings | null>(null);
  const [uniformSettings, setUniformSettings] = useState<UniformSettings | null>(null);
  const [dataSettings, setDataSettings] = useState<DataSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [operationalLoading, setOperationalLoading] = useState(false);
  const [uniformLoading, setUniformLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Mock data for development - replace with API calls later
  const mockOperationalSettings: OperationalSettings = {
    securityGuardTypes: [
      { id: "1", name: "Security Guard", isActive: true },
      { id: "2", name: "Lady Guard", isActive: true },
      { id: "3", name: "Gun Man", isActive: true },
      { id: "4", name: "Post Supervisor", isActive: true },
      { id: "5", name: "Head Guard", isActive: true },
      { id: "6", name: "Personal Security Guard", isActive: true },
    ],
    areas: [
      { id: "1", name: "North Delhi", isActive: true },
      { id: "2", name: "South Delhi", isActive: true },
      { id: "3", name: "Jaipur", isActive: true },
      { id: "4", name: "Ghaziabad", isActive: true },
      { id: "5", name: "Gurgaon + Delhi Airport", isActive: true },
      { id: "6", name: "Greater Noida", isActive: true },
    ],
    areaManagers: [
      { id: "1", name: "Ramesh Garg", areaId: "1", isActive: true },
      { id: "2", name: "Chandan Tripathi", areaId: "4", isActive: true },
      { id: "3", name: "Kanta Sharma", areaId: "6", isActive: true },
    ],
    siteTypes: [
      { id: "1", name: "Commercial Building", category: "Commercial", isActive: true },
      { id: "2", name: "Corporate Office", category: "Corporate", isActive: true },
      { id: "3", name: "Warehouse", category: "Industrial", isActive: true },
      { id: "4", name: "Retail", category: "Retail", isActive: true },
      { id: "5", name: "Factory / Plant", category: "Industrial", isActive: true },
      { id: "6", name: "Bank / ATM", category: "Financial", isActive: true },
      { id: "7", name: "Residential Society", category: "Residential", isActive: true },
      { id: "8", name: "Individual Residence", category: "Residential", isActive: true },
      { id: "9", name: "Hospital / Clinic", category: "Healthcare", isActive: true },
      { id: "10", name: "Government Office", category: "Government", isActive: true },
      { id: "11", name: "School / College / University", category: "Education", isActive: true },
      { id: "12", name: "Religious Place", category: "Religious", isActive: true },
      { id: "13", name: "Event Site / Concert", category: "Event", isActive: true },
      { id: "14", name: "Embassy / Consulate", category: "Government", isActive: true },
      { id: "15", name: "Airport / Railway / Port", category: "Transport", isActive: true },
      { id: "16", name: "Construction Site", category: "Construction", isActive: true },
      { id: "17", name: "Cash Transit", category: "Financial", isActive: true },
      { id: "18", name: "Data Center", category: "Technology", isActive: true },
      { id: "19", name: "VIP residence", category: "VIP", isActive: true },
      { id: "20", name: "Film Set", category: "Entertainment", isActive: true },
    ],
    lastModified: "12/02/205", // Keep as per your mock data
  };

  // Initialize with mock data
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setOperationalSettings(mockOperationalSettings);
      setLoading(false);
    }, 1000);
  }, []);

  // Methods for future API integration
  const fetchOperationalSettings = async (): Promise<void> => {
    try {
      setOperationalLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/settings/operational');
      // const data = await response.json();
      // setOperationalSettings(data);

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOperationalSettings(mockOperationalSettings);
    } catch (err) {
      setError("Failed to fetch operational settings");
      console.error("Error fetching operational settings:", err);
    } finally {
      setOperationalLoading(false);
    }
  };

  const fetchUniformSettings = async (): Promise<void> => {
    try {
      setUniformLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUniformSettings({
        uniformTypes: [],
        lastModified: "12/02/205",
      });
    } catch (err) {
      setError("Failed to fetch uniform settings");
      console.error("Error fetching uniform settings:", err);
    } finally {
      setUniformLoading(false);
    }
  };

  const fetchDataSettings = async (): Promise<void> => {
    try {
      setDataLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDataSettings({
        dataConfigurations: [],
        lastModified: "12/02/205",
      });
    } catch (err) {
      setError("Failed to fetch data settings");
      console.error("Error fetching data settings:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const updateOperationalSettings = async (settings: Partial<OperationalSettings>): Promise<void> => {
    try {
      setOperationalLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/settings/operational', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOperationalSettings((prev) => (prev ? { ...prev, ...settings } : null));
    } catch (err) {
      setError("Failed to update operational settings");
      console.error("Error updating operational settings:", err);
    } finally {
      setOperationalLoading(false);
    }
  };

  const updateUniformSettings = async (settings: Partial<UniformSettings>): Promise<void> => {
    try {
      setUniformLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUniformSettings((prev) => (prev ? { ...prev, ...settings } : null));
    } catch (err) {
      setError("Failed to update uniform settings");
      console.error("Error updating uniform settings:", err);
    } finally {
      setUniformLoading(false);
    }
  };

  const updateDataSettings = async (settings: Partial<DataSettings>): Promise<void> => {
    try {
      setDataLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setDataSettings((prev) => (prev ? { ...prev, ...settings } : null));
    } catch (err) {
      setError("Failed to update data settings");
      console.error("Error updating data settings:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const contextValue: SettingsContextType = {
    operationalSettings,
    uniformSettings,
    dataSettings,
    loading,
    operationalLoading,
    uniformLoading,
    dataLoading,
    error,
    fetchOperationalSettings,
    fetchUniformSettings,
    fetchDataSettings,
    updateOperationalSettings,
    updateUniformSettings,
    updateDataSettings,
  };

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
