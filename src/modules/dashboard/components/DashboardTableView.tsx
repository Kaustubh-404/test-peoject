import { Search, StarBorder, Tune } from "@mui/icons-material";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const StarredHeader = ({
  showStarredOnly,
  setShowStarredOnly,
  searchQuery,
  setSearchQuery,
}: {
  showStarredOnly: boolean;
  setShowStarredOnly: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => (
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

export default function DashboardTableView({ selectedTableView }: DashboardTableViewProps) {
  const navigate = useNavigate();
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const shouldShowStarredHeader = ["overview", "attendance", "guards", "shifts"].includes(selectedTableView);
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
  const overviewData = dashboardData?.data?.data?.[0]?.overviewData || [];
  const livelinessAlerts = livelinessData?.data?.data || [];
  const lateUniformSummary = lateUniformData?.data?.data?.[0]?.overviewData || [];
  const shiftPerformanceOverview = shiftPerformanceData?.data?.data?.[0]?.overviewData || [];
  const areaOfficersOverview = areaOfficersData?.data?.data?.[0]?.overviewData || [];
  const transformedOverviewData = overviewData.map((item: any, index: number) => ({
    id: index + 1,
    ...item,
    starred: false,
    patrol: item.patrol || 0,
  }));
  const transformedLivelinessData = livelinessAlerts.map((item: any, index: number) => ({
    id: index + 1,
    ...item,
  }));
  const transformedGuardsData = lateUniformSummary.map((item: any, index: number) => ({
    id: index + 1,
    clientId: item.clientId,
    clientName: item.clientName,
    late: item.lateCount,
    uniform: item.uniform,
    starred: false,
  }));
  const transformedShiftsData = shiftPerformanceOverview.map((item: any, index: number) => ({
    id: index + 1,
    clientId: item.clientId,
    clientName: item.clientName,
    alertness: item.alertness,
    geofence: item.geofence,
    patrol: item.patrol || 0,
    starred: false,
  }));
  const transformedAreaOfficersData = areaOfficersOverview.map((item: any, index: number) => ({
    id: index + 1,
    clientId: item.clientId,
    name: item.clientName,
    assignedArea: "N/A",
    absent: 0,
    late: item.lateCount || 0,
    uniform: item.uniform || 0,
  }));
  const applySearchFilter = (data: any[], searchFields: string[]) => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      })
    );
  };
  const applyStarredFilter = (data: any[]) => {
    if (!showStarredOnly) return data;
    return data.filter((item) => item.starred === true);
  };
  const getFilteredData = (data: any[], searchFields: string[]) => {
    let filtered = applySearchFilter(data, searchFields);
    filtered = applyStarredFilter(filtered);
    return filtered;
  };
  const handleRowClick = (clientId: string) => {
    if (selectedTableView !== "incidents" && selectedTableView !== "area-officers-tasks") {
      navigate(`/clients/${clientId}/performance/guards-defaults`);
    }
  };
  if (selectedTableView === "overview") {
    if (isDashboardLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
        </div>
      );
    }
    if (dashboardError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading dashboard data</Typography>
        </div>
      );
    }
    return (
      <div className="w-full h-full">
        {shouldShowStarredHeader && (
          <StarredHeader
            showStarredOnly={showStarredOnly}
            setShowStarredOnly={setShowStarredOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <DataGrid
          rows={getFilteredData(transformedOverviewData, ["clientName", "alertness", "geofence", "patrol"])}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
          sx={datagridStyle}
          onRowClick={(params) => handleRowClick(params.row.clientId)}
        />
      </div>
    );
  }
  if (selectedTableView === "attendance") {
    if (isDashboardLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading attendance data...</Typography>
        </div>
      );
    }
    if (dashboardError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading attendance data</Typography>
        </div>
      );
    }
    return (
      <div className="w-full h-full">
        {shouldShowStarredHeader && (
          <StarredHeader
            showStarredOnly={showStarredOnly}
            setShowStarredOnly={setShowStarredOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <DataGrid
          rows={getFilteredData(transformedOverviewData, ["clientName", "alertness", "geofence", "patrol"])}
          columns={columns}
          hideFooter
          disableRowSelectionOnClick
          sx={datagridStyle}
          onRowClick={(params) => handleRowClick(params.row.clientId)}
        />
      </div>
    );
  }
  if (selectedTableView === "liveiness") {
    if (isLivelinessLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading liveliness alerts...</Typography>
        </div>
      );
    }
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
          rows={applySearchFilter(transformedLivelinessData, ["guardName", "clientName", "siteName", "alertType"])}
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
    if (isLateUniformLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading guards data...</Typography>
        </div>
      );
    }
    if (lateUniformError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading guards data</Typography>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-white p-4">
        {shouldShowStarredHeader && (
          <StarredHeader
            showStarredOnly={showStarredOnly}
            setShowStarredOnly={setShowStarredOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <DataGrid
          rows={getFilteredData(transformedGuardsData, ["clientName", "late", "uniform"])}
          columns={guardsColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={guardsDatagridStyle}
          onRowClick={(params) => handleRowClick(params.row.clientId)}
        />
      </div>
    );
  }
  if (selectedTableView === "shifts") {
    if (isShiftPerformanceLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading shifts data...</Typography>
        </div>
      );
    }
    if (shiftPerformanceError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Typography color="error">Error loading shifts data</Typography>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-white p-4">
        {shouldShowStarredHeader && (
          <StarredHeader
            showStarredOnly={showStarredOnly}
            setShowStarredOnly={setShowStarredOnly}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <DataGrid
          rows={getFilteredData(transformedShiftsData, ["clientName", "alertness", "geofence", "patrol"])}
          columns={shiftsColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={shiftsDatagridStyle}
          onRowClick={(params) => handleRowClick(params.row.clientId)}
        />
      </div>
    );
  }
  if (selectedTableView === "area-officers") {
    if (isAreaOfficersLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading area officers data...</Typography>
        </div>
      );
    }
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
          rows={applySearchFilter(transformedAreaOfficersData, ["name", "assignedArea", "late", "uniform"])}
          columns={areaOfficersColumns}
          hideFooter
          disableRowSelectionOnClick
          sx={areaOfficersDatagridStyle}
          onRowClick={(params) => handleRowClick(params.row.clientId)}
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
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-gray-500">
        {selectedTableView.charAt(0).toUpperCase() + selectedTableView.slice(1)} view coming soon...
      </div>
    </div>
  );
}
