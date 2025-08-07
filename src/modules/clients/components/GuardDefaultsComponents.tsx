import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo } from "react";
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
import { formatDate, getDateRangeForView, type ViewType } from "../utils/dateRangeUtils";

interface CalendarComponentProps {
  selectedView: ViewType;
  currentDate: Date;
  selectedMetric: string;
  onDateSelect?: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedView,
  currentDate,
  selectedMetric,
  onDateSelect,
}) => {
  const { clientId } = useParams();

  // Calculate date range based on selected view
  const dateRange = useMemo(() => {
    return getDateRangeForView(selectedView, currentDate);
  }, [selectedView, currentDate]);

  // Fetch attendance data for the calendar view
  const { data: attendanceData } = useGetAttendanceCount(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: uniformData } = useGetUniformDefaults(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: alertnessData } = useGetAlertnessDefaults(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: lateData } = useGetLateCount(clientId || "", dateRange.startDate, dateRange.endDate);
  const { data: geofenceData } = useGetGeofenceActivity(clientId || "", dateRange.startDate, dateRange.endDate);

  // Create a map of date to absent count for quick lookup
  const dailyMetricCounts = useMemo(() => {
    const countMap = new Map<string, number>();

    if (selectedMetric === "absent" && attendanceData?.data?.topAbsentGuards) {
      attendanceData.data.topAbsentGuards.forEach((guard) => {
        guard.absentDuties.forEach((duty) => {
          const dutyDate = new Date(duty.dutyDate).toISOString().split("T")[0];
          const currentCount = countMap.get(dutyDate) || 0;
          countMap.set(dutyDate, currentCount + 1);
        });
      });
    }

    if (selectedMetric === "uniform" && uniformData?.data?.sitesWithDefaults) {
      uniformData.data.sitesWithDefaults.forEach((site) => {
        site.defaultsByDate.forEach((dayData) => {
          const currentCount = countMap.get(dayData.date) || 0;
          countMap.set(dayData.date, currentCount + dayData.defaultCount);
        });
      });
    }

    if (selectedMetric === "alertness" && alertnessData?.data?.sitesWithDefaults) {
      alertnessData.data.sitesWithDefaults.forEach((site) => {
        site.defaultsByDate.forEach((dayData) => {
          const currentCount = countMap.get(dayData.date) || 0;
          countMap.set(dayData.date, currentCount + dayData.defaultCount);
        });
      });
    }

    if (selectedMetric === "late" && lateData?.data?.lateGuardsByDate) {
      lateData.data.lateGuardsByDate.forEach((dayData) => {
        const currentCount = countMap.get(dayData.date) || 0;
        countMap.set(dayData.date, currentCount + dayData.guardCount);
      });
    }

    if (selectedMetric === "geofence" && geofenceData?.data?.guardsWithGeofenceActivity) {
      geofenceData.data.guardsWithGeofenceActivity.forEach((guard) => {
        const currentCount = countMap.get(guard.date) || 0;
        countMap.set(guard.date, currentCount + guard.sessionCount);
      });
    }

    if (selectedMetric === "patrol" && geofenceData?.data?.guardsWithGeofenceActivity) {
      geofenceData.data.guardsWithGeofenceActivity.forEach((guard) => {
        const currentCount = countMap.get(guard.date) || 0;
        countMap.set(guard.date, currentCount + guard.sessionCount);
      });
    }

    return countMap;
  }, [selectedMetric, attendanceData, uniformData, alertnessData, lateData, geofenceData]);

  const getWeekDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="grid grid-cols-7">
        {weekDays.map((date, index) => {
          const formatted = formatDate(date);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`;

          const metricCount = dailyMetricCounts.get(dateKey) || 0;
          const isToday = date.toDateString() === currentDate.toDateString();

          // Convert full day name to short format for display (Monday-based)
          const dayNames = ["S", "M", "T", "W", "T", "F", "S"]; // Sunday=0, Monday=1, etc.
          const shortDayName = dayNames[date.getDay()];

          return (
            <div
              key={index}
              className={`bg-white rounded-lg cursor-pointer flex-1 text-center`}
              onClick={() => onDateSelect?.(date)}
            >
              <div className="text-gray-500 font-medium mb-1">{shortDayName}</div>
              <div className="text-gray-400 mb-2">{formatted.day}</div>
              <div
                className={`border border-gray-200 p-2 h-16 flex justify-center items-center ${
                  index === 0 ? "rounded-l-2xl" : index === 6 ? "rounded-r-2xl" : ""
                } ${isToday ? "bg-blue-50 border-blue-300" : ""}`}
              >
                {metricCount > 0 && (
                  <div className="text-red-500 text-sm font-bold bg-white shadow rounded-full w-10 h-10 items-center flex justify-center mx-auto">
                    {metricCount.toString().padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getCurrentMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysFromPrevMonth = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    const days = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const renderMonthView = () => {
    const monthDays = getCurrentMonthDays();
    const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"]; // Match week view format

    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayHeaders.map((day, index) => (
            <div key={index} className="text-center text-gray-600 text-sm font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {monthDays.map((dayObj, index) => {
            const { date, isCurrentMonth } = dayObj;
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const dateKey = `${year}-${month}-${day}`;

            const metricCount = dailyMetricCounts.get(dateKey) || 0;
            const isToday = date.toDateString() === currentDate.toDateString();

            return (
              <div
                key={index}
                className={`relative h-16 cursor-pointer transition-all duration-200 bg-white border border-gray-300 flex flex-col justify-center items-center py-1 ${
                  isCurrentMonth ? "hover:bg-gray-50" : "opacity-40"
                } ${isToday ? "bg-blue-50 border-blue-300" : ""}`}
                onClick={() => onDateSelect?.(date)}
              >
                <div className={`text-sm font-medium mb-1 text-gray-700`}>{date.getDate()}</div>
                {isCurrentMonth && metricCount > 0 && (
                  <div className="text-red-500 text-sm font-bold bg-white w-8 h-8 flex items-center justify-center mx-auto shadow-lg rounded-full">
                    {metricCount.toString().padStart(2, "0")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  switch (selectedView) {
    case "week":
      return renderWeekView();
    case "month":
      return renderMonthView();
    default:
      return null;
  }
};

const CommonDataGrid = ({ selectedMetric }: { selectedMetric: string }) => {
  const { clientId } = useParams();
  const { selectedView, currentDate } = useClientContext();

  const dateRange = useMemo(() => {
    return getDateRangeForView(selectedView, currentDate);
  }, [selectedView, currentDate]);

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

  const absentGuardsData = useMemo(() => {
    if (!attendanceCountData?.data?.siteBreakdown) {
      return [];
    }

    const siteBreakdown = attendanceCountData.data.siteBreakdown;

    const absentSites = siteBreakdown
      .filter((site: any) => site.absentCount > 0)
      .map((site: any, index: number) => ({
        id: index,
        siteId: site.siteId,
        siteName: site.siteName,
        absent: site.absentCount,
        replaced: 0,
        toReplace: site.absentCount,
      }));

    return absentSites;
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

    return uniformSites;
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

  const lateGuardsData = useMemo(() => {
    if (!lateData?.data?.lateGuardsByDate) {
      return [];
    }

    const lateGuardsByDate = lateData.data.lateGuardsByDate;

    // Group by site and aggregate data
    const siteMap = new Map();
    lateGuardsByDate.forEach((dayData) => {
      const { siteId, siteName, guardCount, guards } = dayData;

      if (siteMap.has(siteId)) {
        const existing = siteMap.get(siteId);
        existing.totalIncidents += guardCount;
        existing.totalLateMinutes += guards.reduce((sum, guard) => sum + guard.lateMinutes, 0);
        // Track unique guards
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

    const lateSites = Array.from(siteMap.values())
      .filter((site) => site.totalIncidents > 0)
      .map((site, index) => ({
        id: index,
        siteId: site.siteId,
        siteName: site.siteName,
        guardCount: site.uniqueGuards.size,
        totalIncidents: site.totalIncidents,
        avgLateMinutes: Math.round(site.totalLateMinutes / site.totalIncidents),
      }));

    return lateSites;
  }, [lateData]);

  const geofenceGuardsData = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity) {
      return [];
    }

    const guardsWithGeofenceActivity = geofenceData.data.guardsWithGeofenceActivity;

    // Group by site and aggregate data
    const siteMap = new Map();
    guardsWithGeofenceActivity.forEach((guard) => {
      const { siteName, sessionCount, sessions } = guard;

      if (siteMap.has(siteName)) {
        const existing = siteMap.get(siteName);
        existing.totalSessions += sessionCount;
        existing.guardCount += 1;
        existing.totalDuration += sessions.reduce((sum, session) => {
          const duration = parseInt(session.duration.replace(" Min", "")) || 0;
          return sum + duration;
        }, 0);
      } else {
        siteMap.set(siteName, {
          siteName,
          totalSessions: sessionCount,
          guardCount: 1,
          totalDuration: sessions.reduce((sum, session) => {
            const duration = parseInt(session.duration.replace(" Min", "")) || 0;
            return sum + duration;
          }, 0),
        });
      }
    });

    const geofenceSites = Array.from(siteMap.values())
      .filter((site) => site.totalSessions > 0)
      .map((site, index) => ({
        id: index,
        siteName: site.siteName,
        guardCount: site.guardCount,
        totalSessions: site.totalSessions,
        avgDuration: Math.round(site.totalDuration / site.totalSessions),
      }));

    return geofenceSites;
  }, [geofenceData]);

  const patrolGuardsData = useMemo(() => {
    if (!geofenceData?.data?.guardsWithGeofenceActivity) {
      return [];
    }

    const guardsWithGeofenceActivity = geofenceData.data.guardsWithGeofenceActivity;

    // Group by site and aggregate data for patrol (similar to geofence but different metrics)
    const siteMap = new Map();
    guardsWithGeofenceActivity.forEach((guard) => {
      const { siteName, sessionCount } = guard;

      if (siteMap.has(siteName)) {
        const existing = siteMap.get(siteName);
        existing.totalPatrols += sessionCount;
        existing.guardCount += 1;
      } else {
        siteMap.set(siteName, {
          siteName,
          totalPatrols: sessionCount,
          guardCount: 1,
        });
      }
    });

    const patrolSites = Array.from(siteMap.values())
      .filter((site) => site.totalPatrols > 0)
      .map((site, index) => ({
        id: index,
        siteName: site.siteName,
        guardCount: site.guardCount,
        totalPatrols: site.totalPatrols,
        avgPatrolsPerGuard: Math.round(site.totalPatrols / site.guardCount),
      }));

    return patrolSites;
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
      default:
        return {
          rows: [],
          columns: [],
          isLoading: false,
          error: null,
        };
    }
  };

  const { rows, columns, isLoading: tableLoading, error: tableError } = getTableData();

  if (tableLoading) {
    return (
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
    );
  }

  if (tableError) {
    return (
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
    );
  }

  if (!rows || rows.length === 0) {
    return (
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
        <div className="text-center text-gray-500">
          <p>No {selectedMetric} defaults found</p>
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter={true}
        disableColumnMenu
        disableRowSelectionOnClick
        sx={datagridStyle}
      />
    </Box>
  );
};

export const renderMetricComponent = (
  selectedMetric: string,
  selectedView?: ViewType,
  currentDate?: Date,
  onDateSelect?: (date: Date) => void
) => {
  switch (selectedMetric) {
    case "absent":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric={selectedMetric}
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    case "late":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric="late"
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    case "uniform":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric="uniform"
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    case "alertness":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric="alertness"
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    case "geofence":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric="geofence"
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    case "patrol":
      if (selectedView === "day") {
        return <CommonDataGrid selectedMetric={selectedMetric} />;
      } else if (selectedView === "week" || selectedView === "month" || selectedView === "custom") {
        return (
          <Box sx={{ width: "100%", flexGrow: 1, minHeight: 0, overflow: "hidden", p: 4 }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                {selectedView && currentDate ? (
                  <CalendarComponent
                    selectedView={selectedView}
                    currentDate={currentDate}
                    selectedMetric="patrol"
                    onDateSelect={onDateSelect}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Calendar view not available</p>
                  </div>
                )}
              </div>
            </div>
          </Box>
        );
      }
      break;

    default:
      return null;
  }
};
