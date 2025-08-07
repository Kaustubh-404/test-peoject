import { Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAlertnessDefaults } from "../apis/hooks/useGetAlertnessDefaults";
import { useGetAttendanceCount } from "../apis/hooks/useGetAttendanceCount";
import { useGetGeofenceActivity } from "../apis/hooks/useGetGeofenceActivity";
import { useGetLateCount } from "../apis/hooks/useGetLateCount";
import { useGetUniformDefaults } from "../apis/hooks/useGetUniformDefaults";
import {
  AbsentColumns,
  AlertnessColumns,
  GeofenceColumns,
  LateColumns,
  PatrolColumns,
  UniformColumns,
  type GuardAbsentItems,
  type GuardAlertnessItems,
  type GuardGeofenceItems,
  type GuardLateItems,
  type GuardPatrolItems,
  type GuardUniformItems,
} from "../columns/GuardsDefaultsListViewColumns";
import { useClientContext } from "../context/ClientContext";
import { datagridStyle } from "../lib/datagridStyle";
import { getDateRangeForView } from "../utils/dateRangeUtils";

export type GuardItems =
  | GuardAbsentItems
  | GuardLateItems
  | GuardUniformItems
  | GuardAlertnessItems
  | GuardGeofenceItems
  | GuardPatrolItems;

const commonTable = ({
  items,
  columns,
  setSelectedGuard,
}: {
  items: any[];
  columns: GridColDef[];
  setSelectedGuard: (guard: GuardItems) => void;
}) => {
  const [selectedGuardIndex] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  return (
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
        rows={items}
        columns={columns}
        hideFooter={true}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          const selectedId = Array.from(newRowSelectionModel.ids)[0];
          if (selectedId !== undefined) {
            setSelectedGuard(items[Number(selectedId)] as GuardItems);
          }
        }}
        rowSelectionModel={selectedGuardIndex}
        disableColumnMenu
        disableMultipleRowSelection={true}
        sx={datagridStyle}
      />
    </Box>
  );
};

export const ClientDefaultsDetailsTable = ({
  selectedMetric,
  setSelectedGuard,
}: {
  selectedMetric: string;
  setSelectedGuard: any;
}) => {
  const { clientId, siteId } = useParams();
  const { selectedView, currentDate } = useClientContext();

  // Calculate date range based on selected view
  const dateRange = useMemo(() => {
    return getDateRangeForView(selectedView, currentDate);
  }, [selectedView, currentDate]);

  // Fetch API data
  const { data: attendanceData } = useGetAttendanceCount(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: uniformData } = useGetUniformDefaults(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: alertnessData } = useGetAlertnessDefaults(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: lateData } = useGetLateCount(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: geofenceData } = useGetGeofenceActivity(clientId || "", dateRange.startDate, dateRange.endDate);

  // Transform absent guards data
  const absentGuards = useMemo(() => {
    if (!attendanceData?.data?.topAbsentGuards || !siteId) return [];

    return attendanceData.data.topAbsentGuards
      .filter((guard) => guard.siteId === siteId)
      .map((guard, index) => ({
        id: index,
        name: guard.guardName,
        phone: "N/A", // Phone not available in absent API
        photo: guard.guardPhoto || "/placeholder-avatar.png",
        dutyTime: "08:00 - 20:00", // Default duty time
        absentDays: guard.totalAbsences,
        lastAbsentDate: guard.absentDuties[guard.absentDuties.length - 1]?.dutyDate || "",
        reason: guard.absentDuties[guard.absentDuties.length - 1]?.notes || "Not specified",
      })) as GuardAbsentItems[];
  }, [attendanceData, siteId]);

  // Transform uniform guards data
  const uniformGuards = useMemo(() => {
    if (!uniformData?.data?.sitesWithDefaults || !siteId) return [];

    const siteData = uniformData.data.sitesWithDefaults.find((site) => site.siteId === siteId);
    if (!siteData) return [];

    // Collect all guards with uniform defaults at this site
    const guardsMap = new Map();
    siteData.defaultsByDate.forEach((dayData) => {
      dayData.guards?.forEach((guard) => {
        if (!guardsMap.has(guard.guardId)) {
          guardsMap.set(guard.guardId, {
            id: guardsMap.size,
            name: guard.guardName,
            phone: guard.phoneNumber,
            photo: "/placeholder-avatar.png", // Photo not available in uniform API
            defaults: 0,
            lastDefaultDate: "",
            defaultType: "Uniform Violation",
          });
        }
        const existingGuard = guardsMap.get(guard.guardId);
        existingGuard.defaults += 1;
        existingGuard.lastDefaultDate = dayData.date;
      });
    });

    return Array.from(guardsMap.values()) as GuardUniformItems[];
  }, [uniformData, siteId]);

  // Transform alertness guards data
  const alertnessGuards = useMemo(() => {
    if (!alertnessData?.data?.sitesWithDefaults || !siteId) return [];

    const siteData = alertnessData.data.sitesWithDefaults.find((site) => site.siteId === siteId);
    if (!siteData) return [];

    const guardsMap = new Map();
    siteData.defaultsByDate.forEach((dayData) => {
      dayData.guards?.forEach((guard) => {
        if (!guardsMap.has(guard.guardId)) {
          guardsMap.set(guard.guardId, {
            id: guardsMap.size,
            name: guard.guardName,
            phone: guard.phoneNumber,
            photo: "/placeholder-avatar.png", // Photo not available in alertness API
            defaults: 0,
            lastDefaultDate: "",
            defaultType: "Alertness Check",
          });
        }
        const existingGuard = guardsMap.get(guard.guardId);
        existingGuard.defaults += 1;
        existingGuard.lastDefaultDate = dayData.date;
      });
    });

    return Array.from(guardsMap.values()) as GuardAlertnessItems[];
  }, [alertnessData, siteId]);

  // Transform late guards data
  const lateGuards = useMemo(() => {
    if (!lateData?.data?.lateGuardsByDate || !siteId) return [];

    const guardsMap = new Map();
    lateData.data.lateGuardsByDate
      .filter((dayData) => dayData.siteId === siteId)
      .forEach((dayData) => {
        dayData.guards.forEach((guard) => {
          if (!guardsMap.has(guard.guardId)) {
            guardsMap.set(guard.guardId, {
              id: guardsMap.size,
              name: guard.guardName,
              phone: guard.phoneNumber,
              photo: "/placeholder-avatar.png", // Photo not available in late API
              lateCount: 0,
              totalLateMinutes: 0,
              lastLateDate: "",
              avgLateMinutes: 0,
            });
          }
          const existingGuard = guardsMap.get(guard.guardId);
          existingGuard.lateCount += 1;
          existingGuard.totalLateMinutes += guard.lateMinutes;
          existingGuard.lastLateDate = dayData.date;
          existingGuard.avgLateMinutes = Math.round(existingGuard.totalLateMinutes / existingGuard.lateCount);
        });
      });

    return Array.from(guardsMap.values()) as GuardLateItems[];
  }, [lateData, siteId]);

  // Transform geofence guards data
  const geofenceGuards = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity || !siteId) return [];

    const siteName = attendanceData?.data?.siteBreakdown?.find((site) => site.siteId === siteId)?.siteName;
    if (!siteName) return [];

    const guardsMap = new Map();
    geofenceData.data.guardsWithGeofenceActivity
      .filter((guard) => guard.siteName === siteName)
      .forEach((guard) => {
        if (!guardsMap.has(guard.guardId)) {
          guardsMap.set(guard.guardId, {
            id: guardsMap.size,
            name: guard.guardName,
            phone: guard.phoneNumber,
            photo: "/placeholder-avatar.png", // Photo not available in geofence API
            violations: 0,
            totalDuration: 0,
            lastViolationDate: "",
            avgDurationMinutes: 0,
          });
        }
        const existingGuard = guardsMap.get(guard.guardId);
        existingGuard.violations += guard.sessionCount;
        const totalDuration = guard.sessions.reduce((sum, session) => {
          return sum + (parseInt(session.duration.replace(" Min", "")) || 0);
        }, 0);
        existingGuard.totalDuration += totalDuration;
        existingGuard.lastViolationDate = guard.date;
        existingGuard.avgDurationMinutes = Math.round(existingGuard.totalDuration / existingGuard.violations);
      });

    return Array.from(guardsMap.values()) as GuardGeofenceItems[];
  }, [geofenceData, siteId, attendanceData]);

  // Transform patrol guards data (reuse geofence data)
  const patrolGuards = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity || !siteId) return [];

    const siteName = attendanceData?.data?.siteBreakdown?.find((site) => site.siteId === siteId)?.siteName;
    if (!siteName) return [];

    const guardsMap = new Map();
    geofenceData.data.guardsWithGeofenceActivity
      .filter((guard) => guard.siteName === siteName)
      .forEach((guard) => {
        if (!guardsMap.has(guard.guardId)) {
          guardsMap.set(guard.guardId, {
            id: guardsMap.size,
            name: guard.guardName,
            phone: guard.phoneNumber,
            photo: "/placeholder-avatar.png", // Photo not available in geofence API
            patrolErrors: guard.sessionCount,
            lastErrorDate: guard.date,
            errorType: "Session Issue",
          });
        }
        const existingGuard = guardsMap.get(guard.guardId);
        existingGuard.patrolErrors += guard.sessionCount;
        existingGuard.lastErrorDate = guard.date;
      });

    return Array.from(guardsMap.values()) as GuardPatrolItems[];
  }, [geofenceData, siteId, attendanceData]);

  switch (selectedMetric) {
    case "absent":
      return commonTable({
        items: absentGuards,
        columns: AbsentColumns,
        setSelectedGuard: setSelectedGuard,
      });

    case "late":
      return commonTable({
        items: lateGuards,
        columns: LateColumns,
        setSelectedGuard: setSelectedGuard,
      });

    case "uniform":
      return commonTable({
        items: uniformGuards,
        columns: UniformColumns,
        setSelectedGuard: setSelectedGuard,
      });

    case "alertness":
      return commonTable({
        items: alertnessGuards,
        columns: AlertnessColumns,
        setSelectedGuard: setSelectedGuard,
      });

    case "geofence":
      return commonTable({
        items: geofenceGuards,
        columns: GeofenceColumns,
        setSelectedGuard: setSelectedGuard,
      });

    case "patrol":
      return commonTable({
        items: patrolGuards,
        columns: PatrolColumns,
        setSelectedGuard: setSelectedGuard,
      });

    default:
      return commonTable({
        items: [],
        columns: [],
        setSelectedGuard: setSelectedGuard,
      });
  }
};
