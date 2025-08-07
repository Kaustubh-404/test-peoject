import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetAlertnessDefaults } from "../apis/hooks/useGetAlertnessDefaults";
import { useGetAttendanceCount } from "../apis/hooks/useGetAttendanceCount";
import { useGetGeofenceActivity } from "../apis/hooks/useGetGeofenceActivity";
import { useGetLateCount } from "../apis/hooks/useGetLateCount";
import { useGetUniformDefaults } from "../apis/hooks/useGetUniformDefaults";
import {
  AbsentTableColumns,
  AlertnessTableColumns,
  GeofenceTableColumns,
  LateTableColumns,
  PatrolTableColumns,
  UniformTableColumns,
} from "../columns/ClientPerformanceColumns";
import { useClientContext } from "../context/ClientContext";
import { datagridStyle } from "../lib/datagridStyle";
import { getDateRangeForView } from "../utils/dateRangeUtils";

export const GuardDefaultsListView = () => {
  const { selectedMetric, selectedView, currentDate } = useClientContext();
  const { clientId } = useParams();

  // Calculate date range based on selected view
  const dateRange = useMemo(() => {
    return getDateRangeForView(selectedView, currentDate);
  }, [selectedView, currentDate]);

  // Fetch attendance count data for absent metric with date range
  const {
    data: attendanceCountData,
    isLoading: isLoadingAbsent,
    error: errorAbsent,
  } = useGetAttendanceCount(clientId || "", dateRange.startDate, dateRange.endDate);

  const {
    data: uniformData,
    isLoading: isLoadingUniform,
    error: errorUniform,
  } = useGetUniformDefaults(clientId || "", dateRange.startDate, dateRange.endDate);

  const {
    data: alertnessData,
    isLoading: isLoadingAlertness,
    error: errorAlertness,
  } = useGetAlertnessDefaults(clientId || "", dateRange.startDate, dateRange.endDate);

  const {
    data: lateData,
    isLoading: isLoadingLate,
    error: errorLate,
  } = useGetLateCount(clientId || "", dateRange.startDate, dateRange.endDate);

  const {
    data: geofenceData,
    isLoading: isLoadingGeofence,
    error: errorGeofence,
  } = useGetGeofenceActivity(clientId || "", dateRange.startDate, dateRange.endDate);

  // Transform attendance data for absent guards
  const absentGuardsData = useMemo(() => {
    if (!attendanceCountData?.data?.siteBreakdown) {
      return [];
    }

    const siteBreakdown = attendanceCountData.data.siteBreakdown;

    return siteBreakdown
      .filter((site: any) => site.absentCount > 0)
      .map((site: any, index: number) => ({
        id: index,
        siteId: site.siteId,
        siteName: site.siteName,
        guardCount: site.absentCount,
        absent: site.absentCount,
        replaced: 0,
        toReplace: site.absentCount,
      }));
  }, [attendanceCountData]);

  const uniformGuardsData = useMemo(() => {
    if (!uniformData?.data?.sitesWithDefaults) {
      return [];
    }

    const sitesWithDefaults = uniformData.data.sitesWithDefaults;

    const uniformSites = sitesWithDefaults
      .filter((site: any) => site.totalDefaults > 0)
      .map((site: any, index: number) => {
        // Count unique guards from defaultsByDate
        const uniqueGuards = new Set();
        site.defaultsByDate?.forEach((dayData: any) => {
          dayData.guards?.forEach((guard: any) => {
            uniqueGuards.add(guard.guardId);
          });
        });

        return {
          id: index,
          siteId: site.siteId,
          siteName: site.siteName,
          guardCount: uniqueGuards.size,
          totalChecks: site.totalChecks,
          totalDefaults: site.totalDefaults,
          defaultRate: ((site.totalDefaults / site.totalChecks) * 100).toFixed(1) + "%",
        };
      });

    return uniformSites.length > 0 ? uniformSites : [];
  }, [uniformData]);

  const alertnessGuardsData = useMemo(() => {
    if (!alertnessData?.data?.sitesWithDefaults) {
      return [];
    }

    const sitesWithDefaults = alertnessData.data.sitesWithDefaults;

    const alertnessSites = sitesWithDefaults
      .filter((site: any) => site.totalDefaults > 0)
      .map((site: any, index: number) => {
        // Count unique guards from defaultsByDate
        const uniqueGuards = new Set();
        site.defaultsByDate?.forEach((dayData: any) => {
          dayData.guards?.forEach((guard: any) => {
            uniqueGuards.add(guard.guardId);
          });
        });

        return {
          id: index,
          siteId: site.siteId,
          siteName: site.siteName,
          guardCount: uniqueGuards.size,
          totalChecks: site.totalChecks,
          totalDefaults: site.totalDefaults,
          defaultRate: ((site.totalDefaults / site.totalChecks) * 100).toFixed(1) + "%",
        };
      });

    return alertnessSites;
  }, [alertnessData]);

  // Transform late guards data with aggregation by site
  const lateGuardsData = useMemo(() => {
    if (!lateData?.data?.lateGuardsByDate) {
      return [];
    }

    // Group by site and aggregate data
    const siteMap = new Map();
    lateData.data.lateGuardsByDate.forEach((dayData) => {
      const { siteId, siteName, guardCount, guards } = dayData;

      if (siteMap.has(siteId)) {
        const existing = siteMap.get(siteId);
        existing.totalIncidents += guardCount;
        existing.totalLateMinutes += guards.reduce((sum, guard) => sum + guard.lateMinutes, 0);
        guards.forEach((guard) => existing.uniqueGuards.add(guard.guardId));
      } else {
        const uniqueGuards = new Set();
        guards.forEach((guard) => uniqueGuards.add(guard.guardId));

        siteMap.set(siteId, {
          siteId,
          siteName,
          totalIncidents: guardCount,
          totalLateMinutes: guards.reduce((sum, guard) => sum + guard.lateMinutes, 0),
          uniqueGuards,
        });
      }
    });

    return Array.from(siteMap.values())
      .filter((site) => site.totalIncidents > 0)
      .map((site, index) => ({
        id: index,
        siteId: site.siteId,
        siteName: site.siteName,
        guardCount: site.uniqueGuards.size,
        totalIncidents: site.totalIncidents,
        avgLateMinutes: Math.round(site.totalLateMinutes / site.totalIncidents),
      }));
  }, [lateData]);

  // Transform geofence data with site aggregation
  const geofenceGuardsData = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity) {
      return [];
    }

    // Group by site and aggregate data
    const siteMap = new Map();
    geofenceData.data.guardsWithGeofenceActivity.forEach((guard) => {
      const { siteName, sessionCount, sessions, guardId } = guard;

      if (siteMap.has(siteName)) {
        const existing = siteMap.get(siteName);
        existing.totalSessions += sessionCount;
        existing.uniqueGuards.add(guardId);
        existing.totalDuration += sessions.reduce((sum, session) => {
          return sum + (parseInt(session.duration.replace(" Min", "")) || 0);
        }, 0);
      } else {
        siteMap.set(siteName, {
          siteName,
          totalSessions: sessionCount,
          uniqueGuards: new Set([guardId]),
          totalDuration: sessions.reduce((sum, session) => {
            return sum + (parseInt(session.duration.replace(" Min", "")) || 0);
          }, 0),
        });
      }
    });

    return Array.from(siteMap.values())
      .filter((site) => site.totalSessions > 0)
      .map((site, index) => ({
        id: index,
        siteName: site.siteName,
        guardCount: site.uniqueGuards.size,
        totalSessions: site.totalSessions,
        avgDuration: Math.round(site.totalDuration / site.totalSessions),
      }));
  }, [geofenceData]);

  // Transform patrol data (reusing geofence data)
  const patrolGuardsData = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity) {
      return [];
    }

    // Group by site for patrol metrics
    const siteMap = new Map();
    geofenceData.data.guardsWithGeofenceActivity.forEach((guard) => {
      const { siteName, sessionCount, guardId } = guard;

      if (siteMap.has(siteName)) {
        const existing = siteMap.get(siteName);
        existing.totalPatrols += sessionCount;
        existing.uniqueGuards.add(guardId);
      } else {
        siteMap.set(siteName, {
          siteName,
          totalPatrols: sessionCount,
          uniqueGuards: new Set([guardId]),
        });
      }
    });

    return Array.from(siteMap.values())
      .filter((site) => site.totalPatrols > 0)
      .map((site, index) => ({
        id: index,
        siteName: site.siteName,
        guardCount: site.uniqueGuards.size,
        totalPatrols: site.totalPatrols,
        avgPatrolsPerGuard: Math.round(site.totalPatrols / site.uniqueGuards.size),
      }));
  }, [geofenceData]);

  const getTableData = () => {
    switch (selectedMetric) {
      case "absent":
        return {
          rows: absentGuardsData,
          columns: AbsentTableColumns,
          isLoading: isLoadingAbsent,
          error: errorAbsent,
        };
      case "late":
        return {
          rows: lateGuardsData,
          columns: LateTableColumns,
          isLoading: isLoadingLate,
          error: errorLate,
        };
      case "uniform":
        return {
          rows: uniformGuardsData,
          columns: UniformTableColumns,
          isLoading: isLoadingUniform,
          error: errorUniform,
        };
      case "alertness":
        return {
          rows: alertnessGuardsData,
          columns: AlertnessTableColumns,
          isLoading: isLoadingAlertness,
          error: errorAlertness,
        };
      case "geofence":
        return {
          rows: geofenceGuardsData,
          columns: GeofenceTableColumns,
          isLoading: isLoadingGeofence,
          error: errorGeofence,
        };
      case "patrol":
        return {
          rows: patrolGuardsData,
          columns: PatrolTableColumns,
          isLoading: isLoadingGeofence,
          error: errorGeofence,
        };
    }
  };

  const tableData = getTableData();

  if (!tableData) {
    return (
      <div className="flex flex-col bg-white p-4 items-center h-full w-full">
        <span className="uppercase text-lg mb-4">{selectedMetric} : LIST VIEW</span>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No data available for {selectedMetric}
        </Box>
      </div>
    );
  }

  if (tableData.isLoading) {
    return (
      <div className="flex flex-col bg-white p-4 items-center h-full w-full">
        <span className="uppercase text-lg mb-4">{selectedMetric} : LIST VIEW</span>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading {selectedMetric} data...
        </Box>
      </div>
    );
  }

  if (tableData.error) {
    return (
      <div className="flex flex-col bg-white p-4 items-center h-full w-full">
        <span className="uppercase text-lg mb-4">{selectedMetric} : LIST VIEW</span>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Error loading {selectedMetric} data
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white p-4 items-center h-full w-full">
      <span className="uppercase text-lg mb-4">{selectedMetric} : LIST VIEW</span>
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          minHeight: 400,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DataGrid
          rows={tableData.rows}
          columns={tableData.columns}
          hideFooter={true}
          disableColumnMenu
          disableRowSelectionOnClick
          sx={datagridStyle}
        />
      </Box>
    </div>
  );
};
