import { Search, StarBorder, Tune } from "@mui/icons-material";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  useAreaOfficers,
  useDashboardOverview,
  useIncidentReports,
  useLateUniformSummary,
  useLivelinessAlerts,
  useShiftPerformanceIssues,
} from "../apis/hooks/useDashboard";
import { areaOfficersColumns, areaOfficersDatagridStyle } from "../columns/AreaOfficersColumns";
import { guardsColumns, guardsDatagridStyle } from "../columns/GuardsColumns";
import { livelinessColumns, livelinessDatagridStyle } from "../columns/LivelinessColumns";
import { columns, datagridStyle } from "../columns/OverviewColumns";
import { shiftsColumns, shiftsDatagridStyle } from "../columns/ShiftsColumns";
import AreaOfficersTasksView from "./AreaOfficersTasksView";
import IncidentReportsView from "./IncidentReportsView";

interface DashboardTableViewProps {
  selectedTableView: string;
  selectedColumn: string;
  onColumnClick: (columnField: string) => void;
  pageSize: number;
}

export default function DashboardTableView({ selectedTableView }: DashboardTableViewProps) {
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if current view should show starred header
  const shouldShowStarredHeader = ["overview", "attendance", "guards", "shifts"].includes(selectedTableView);
  // Fetch dashboard overview data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardOverview({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch liveliness alerts data
  const {
    data: livelinessData,
    isLoading: isLivelinessLoading,
    error: livelinessError,
  } = useLivelinessAlerts({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch late uniform summary data for guards view
  const {
    data: lateUniformData,
    isLoading: isLateUniformLoading,
    error: lateUniformError,
  } = useLateUniformSummary({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch shift performance issues data for shifts view
  const {
    data: shiftPerformanceData,
    isLoading: isShiftPerformanceLoading,
    error: shiftPerformanceError,
  } = useShiftPerformanceIssues({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch area officers data for area officers view
  const {
    data: areaOfficersData,
    isLoading: isAreaOfficersLoading,
    error: areaOfficersError,
  } = useAreaOfficers({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch incident reports data for incidents view
  const {
    data: incidentReportsData,
    isLoading: isIncidentReportsLoading,
    error: incidentReportsError,
  } = useIncidentReports({
    opAgencyId: "agency_0",
    page: 1,
    limit: 50,
    sortOrder: "desc",
    userTypeFilter: "GUARD",
  });

  // Extract overview data from API response
  const overviewData = dashboardData?.data?.data?.[0]?.overviewData || [];

  // Extract liveliness alerts data from API response
  const livelinessAlerts = livelinessData?.data?.data || [];

  // Extract late uniform summary data from API response
  const lateUniformSummary = lateUniformData?.data?.data?.[0]?.overviewData || [];

  // Extract shift performance data from API response
  const shiftPerformanceOverview = shiftPerformanceData?.data?.data?.[0]?.overviewData || [];

  // Extract area officers data from API response
  const areaOfficersOverview = areaOfficersData?.data?.data?.[0]?.overviewData || [];

  // Transform overview data to include id and starred status for DataGrid
  const transformedOverviewData = overviewData.map((item: any, index: number) => ({
    id: index + 1,
    ...item,
    starred: false, // Default to false, could be managed via API later
    patrol: item.patrol || 0, // Default patrol to 0 if not provided
  }));

  // Transform liveliness data to include id for DataGrid
  const transformedLivelinessData = livelinessAlerts.map((item: any, index: number) => ({
    id: index + 1,
    ...item,
  }));

  // Transform late uniform summary data for guards view
  const transformedGuardsData = lateUniformSummary.map((item: any, index: number) => ({
    id: index + 1,
    clientName: item.clientName,
    late: item.lateCount,
    uniform: item.uniform,
    starred: false,
  }));

  // Transform shift performance data for shifts view
  const transformedShiftsData = shiftPerformanceOverview.map((item: any, index: number) => ({
    id: index + 1,
    clientName: item.clientName,
    alertness: item.alertness,
    geofence: item.geofence,
    patrol: 0, // Not available in this API, set to 0
    starred: false,
  }));

  // Transform area officers data for area officers view
  const transformedAreaOfficersData = areaOfficersOverview.map((item: any, index: number) => ({
    id: index + 1,
    name: item.clientName,
    assignedArea: "N/A", // Not available in API response
    absent: 0, // Not available in API response
    late: item.lateCount || 0,
    uniform: item.uniform || 0,
  }));

  useEffect(() => {
    console.log("Transformed Overview Data:", transformedAreaOfficersData);
  });
  // Starred Header Component
  const StarredHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <div
          className={`inline-flex items-center gap-1 cursor-pointer pb-1 text-[#2A77D5] ${
            !showStarredOnly ? "border-b-2 border-[#2A77D5] font-semibold" : ""
          }`}
          onClick={() => setShowStarredOnly(false)}
        >
          <Tune sx={{ mr: 0.5, fontSize: 20 }} />
          ALL
        </div>
        <div
          className={`inline-flex items-center gap-1 cursor-pointer pb-1 text-[#2A77D5] ${
            showStarredOnly ? "border-b-2 border-[#2A77D5] font-semibold" : ""
          }`}
          onClick={() => setShowStarredOnly(true)}
        >
          <StarBorder sx={{ mr: 0.5, fontSize: 20 }} />
          STARRED
        </div>
      </div>

      <TextField
        size="small"
        placeholder="Search List"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search sx={{ color: "#9e9e9e", fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: 180,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: "32px",
            fontSize: "13px",
            "& fieldset": {
              borderColor: "#e5e5e5",
            },
            "&:hover fieldset": {
              borderColor: "#d1d5db",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9ca3af",
              borderWidth: "1px",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "6px 12px",
            "&::placeholder": {
              color: "#9ca3af",
              fontSize: "13px",
            },
          },
        }}
      />
    </div>
  );

  if (selectedTableView === "overview") {
    // Show loading state
    if (isDashboardLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
        </div>
      );
    }

    // Show error state
    if (dashboardError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading dashboard data</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        {shouldShowStarredHeader && <StarredHeader />}
        <DataGrid
          rows={transformedOverviewData}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
          sx={datagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "attendance") {
    // Show loading state
    if (isDashboardLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading attendance data...</Typography>
        </div>
      );
    }

    // Show error state
    if (dashboardError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading attendance data</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        {shouldShowStarredHeader && <StarredHeader />}
        <DataGrid
          rows={transformedOverviewData}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
          sx={datagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "liveiness") {
    // Show loading state
    if (isLivelinessLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading liveliness alerts...</Typography>
        </div>
      );
    }

    // Show error state
    if (livelinessError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading liveliness alerts</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <DataGrid
          rows={transformedLivelinessData}
          columns={livelinessColumns}
          hideFooter
          disableRowSelectionOnClick
          rowHeight={80}
          getRowHeight={() => 80}
          sx={livelinessDatagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "guards") {
    // Show loading state
    if (isLateUniformLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading guards data...</Typography>
        </div>
      );
    }

    // Show error state
    if (lateUniformError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading guards data</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-white p-4">
        {shouldShowStarredHeader && <StarredHeader />}
        <DataGrid
          rows={transformedGuardsData}
          columns={guardsColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={guardsDatagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "shifts") {
    // Show loading state
    if (isShiftPerformanceLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading shifts data...</Typography>
        </div>
      );
    }

    // Show error state
    if (shiftPerformanceError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading shifts data</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-white p-4">
        {shouldShowStarredHeader && <StarredHeader />}
        <DataGrid
          rows={transformedShiftsData}
          columns={shiftsColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={shiftsDatagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "area-officers") {
    // Show loading state
    if (isAreaOfficersLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading area officers data...</Typography>
        </div>
      );
    }

    // Show error state
    if (areaOfficersError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading area officers data</Typography>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <DataGrid
          rows={transformedAreaOfficersData}
          columns={areaOfficersColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={areaOfficersDatagridStyle}
        />
      </div>
    );
  }

  if (selectedTableView === "incidents") {
    return (
      <IncidentReportsView
        incidentReportsData={incidentReportsData}
        isLoading={isIncidentReportsLoading}
        error={incidentReportsError}
      />
    );
  }

  if (selectedTableView === "area-officers-tasks") {
    return <AreaOfficersTasksView />;
  }

  // Return placeholder for other views
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-gray-500">
        {selectedTableView.charAt(0).toUpperCase() + selectedTableView.slice(1)} view coming soon...
      </div>
    </div>
  );
}
