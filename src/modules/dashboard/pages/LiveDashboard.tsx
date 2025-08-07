import { useGetClients } from "@modules/clients/apis/hooks/useGetClients";
import type { ClientListItem } from "@modules/clients/types";
import { transformToClientListItem } from "@modules/clients/types";
import { formatDate } from "@modules/clients/utils/dateRangeUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import { useDashboardOverview, useLateUniformSummary } from "../apis/hooks/useDashboard";
import DashboardTableView from "../components/DashboardTableView";

type ViewType = "live" | "day" | "month";

type TableViewType =
  | "overview"
  | "liveiness"
  | "attendance"
  | "guards"
  | "shifts"
  | "area-officers"
  | "incidents"
  | "area-officers-tasks";

export default function LiveDashboard() {
  const [selectedView, setSelectedView] = useState<ViewType>("live");
  const [selectedTableView, setSelectedTableView] = useState<TableViewType>("overview");
  const [selectedColumn, setSelectedColumn] = useState<string>("absent");
  const [currentDate] = useState(new Date());

  const currentFormatted = formatDate(currentDate);
  const todayString = `${currentFormatted.dayName} ${currentFormatted.day}/${currentFormatted.month}/${currentFormatted.year}`;
  const monthString = `${currentFormatted.monthName} ${currentFormatted.year}`;

  const getButtonStyles = (_view: ViewType, isSelected: boolean) => ({
    bgcolor: isSelected ? "#2A77D5" : "white",
    color: isSelected ? "white" : "#2A77D5",
    "&:hover": {
      bgcolor: isSelected ? "#1E5A96" : "#E3F2FD",
    },
  });

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
  };

  const handleTableViewChange = (view: TableViewType) => {
    setSelectedTableView(view);
  };

  const handleColumnClick = (columnField: string) => {
    setSelectedColumn(columnField);
  };

  const opAgencyId = "agency_0";

  const { data: clientsResponse, isLoading, error } = useGetClients(opAgencyId);

  // Fetch dashboard overview data for summary cards
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboardOverview({
    opAgencyId,
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Fetch late uniform summary data for guards section
  const {
    data: lateUniformData,
    isLoading: isLateUniformLoading,
    error: lateUniformError,
  } = useLateUniformSummary({
    opAgencyId,
    page: 1,
    limit: 50,
    sortOrder: "desc",
    incidentStatus: "ALL",
  });

  // Calculate totals from dashboard data for summary cards
  const overviewData = dashboardData?.data?.data?.[0]?.overviewData || [];
  const totals = overviewData.reduce(
    (acc, client) => ({
      absent: acc.absent + client.absent,
      late: acc.late + client.late,
      uniform: acc.uniform + client.uniform,
      alert: acc.alert + client.alert,
      geofence: acc.geofence + client.geofence,
    }),
    { absent: 0, late: 0, uniform: 0, alert: 0, geofence: 0 }
  );

  // Calculate late and uniform totals from late uniform summary
  const lateUniformSummary = lateUniformData?.data?.data?.[0];
  const guardTotals = {
    late: lateUniformSummary?.totalLateCount || 0,
    uniform: lateUniformSummary?.totalUniformDefaultCount || 0,
  };

  const [showFavouritesOnly] = useState(false);
  const [guardCountRange, setGuardCountRange] = useState<[number, number]>([0, 500]);
  const [sitesCountRange, setSitesCountRange] = useState<[number, number]>([0, 100]);
  const [pageSize] = useState(5);
  const [, setCurrentPage] = useState(0);
  const [filteredRows, setFilteredRows] = useState<ClientListItem[]>([]);
  const [clientRows, setClientRows] = useState<ClientListItem[]>([]);

  useEffect(() => {
    if (clientsResponse?.data) {
      const transformedClients = clientsResponse.data.map(transformToClientListItem);
      setClientRows(transformedClients);

      if (transformedClients.length > 0) {
        const guards = transformedClients.map((client) => client.totalGuards);
        const sites = transformedClients.map((client) => client.totalSites);

        const minGuards = Math.min(...guards);
        const maxGuards = Math.max(...guards);
        const minSites = Math.min(...sites);
        const maxSites = Math.max(...sites);

        setGuardCountRange([minGuards, maxGuards]);
        setSitesCountRange([minSites, maxSites]);
      }
    }
  }, [clientsResponse]);

  useEffect(() => {
    applyFilters();
  }, [showFavouritesOnly, guardCountRange, sitesCountRange, clientRows]);

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, filteredRows]);

  const applyFilters = () => {
    let result = [...clientRows];

    if (showFavouritesOnly) {
      result = result.filter((row) => row.favourite);
    }

    result = result.filter((row) => row.totalGuards >= guardCountRange[0] && row.totalGuards <= guardCountRange[1]);

    result = result.filter((row) => row.totalSites >= sitesCountRange[0] && row.totalSites <= sitesCountRange[1]);

    setFilteredRows(result);
  };

  if (isLoading || isDashboardLoading || isLateUniformLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error || dashboardError || lateUniformError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">
          Error loading dashboard: {error?.message || dashboardError?.message || lateUniformError?.message}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center text-xl gap-2 font-semibold">
          <h2 className="">LIVE: 24 HOURS DASHBOARD</h2>
          <p className="text-[#707070] text-sm">UPDATED 5 MINUTES AGO</p>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            variant="outlined"
            size="small"
            sx={getButtonStyles("live", selectedView === "live")}
            onClick={() => handleViewChange("live")}
          >
            <AccessTimeIcon sx={{ mr: 1 }} />
            LIVE 24 HOURS
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={getButtonStyles("day", selectedView === "day")}
            onClick={() => handleViewChange("day")}
          >
            <EventOutlinedIcon sx={{ mr: 1 }} />
            {selectedView === "day" ? `DAY | ${todayString}` : "DAY"}
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={getButtonStyles("month", selectedView === "month")}
            onClick={() => handleViewChange("month")}
          >
            <CalendarViewMonthOutlinedIcon sx={{ mr: 1 }} />
            {selectedView === "month" ? `MONTH | ${monthString}` : "MONTH"}
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-4 bg-[#F7F7F7] p-4 rounded-lg">
        <div className="flex flex-col gap-2 w-[300px] flex-shrink-0">
          <Button
            variant="contained"
            size="small"
            sx={{
              ...getButtonStyles("live", selectedTableView === "overview"),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={() => handleTableViewChange("overview")}
          >
            Overview
            <RemoveRedEyeOutlinedIcon sx={{ ml: 1 }} />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={getButtonStyles("live", selectedTableView === "liveiness")}
            onClick={() => handleTableViewChange("liveiness")}
          >
            LIVELINESS TEST ALERTS
          </Button>
          <div
            onClick={() => handleTableViewChange("attendance")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "attendance" ? "#2A77D5" : "white",
              color: selectedTableView === "attendance" ? "white" : "black",
            }}
          >
            <span className="text-xs">ATTENDANCE</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "attendance" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>{totals.absent}</span>
                <Person2OutlinedIcon
                  sx={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                  }}
                >
                  ABSENT
                </span>
              </div>
              -
              <div className="flex flex-col items-center p-2">
                <span>0</span>
                <SwapHorizOutlinedIcon
                  sx={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                  }}
                >
                  REPLACED
                </span>
              </div>
              =
              <div className="flex flex-col items-center p-2">
                <span>{totals.absent}</span>
                <WarningAmberOutlinedIcon
                  sx={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "attendance" ? "white" : "#2A77D5",
                  }}
                >
                  NET ABSENT
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleTableViewChange("guards")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "guards" ? "#2A77D5" : "white",
              color: selectedTableView === "guards" ? "white" : "black",
            }}
          >
            <span className="text-xs">GUARDS</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "guards" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>{guardTotals.late}</span>
                <QueryBuilderOutlinedIcon
                  sx={{
                    color: selectedTableView === "guards" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "guards" ? "white" : "#2A77D5",
                  }}
                >
                  LATE
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "guards" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>{guardTotals.uniform}</span>
                <Shirt
                  className="text-[20px]"
                  style={{
                    color: selectedTableView === "guards" ? "white" : "#2A77D5",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "guards" ? "white" : "#2A77D5",
                  }}
                >
                  UNIFORM
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleTableViewChange("shifts")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "shifts" ? "#2A77D5" : "white",
              color: selectedTableView === "shifts" ? "white" : "black",
            }}
          >
            <span className="text-xs">SHIFTS WITH PERFORMANCE ISSUES</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "shifts" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>70</span>
                <img src="/client_icons/alertness.svg" alt="Alertness" className="w-6 h-6" />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "shifts" ? "white" : "#2A77D5",
                  }}
                >
                  LATE
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "shifts" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>32</span>
                <MapsHomeWorkOutlinedIcon
                  sx={{
                    color: selectedTableView === "shifts" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "shifts" ? "white" : "#2A77D5",
                  }}
                >
                  UNIFORM
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "shifts" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>43</span>
                <DirectionsRunOutlinedIcon
                  sx={{
                    color: selectedTableView === "shifts" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "shifts" ? "white" : "#2A77D5",
                  }}
                >
                  PATROL
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleTableViewChange("area-officers")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "area-officers" ? "#2A77D5" : "white",
              color: selectedTableView === "area-officers" ? "white" : "black",
            }}
          >
            <span className="text-xs">AREA OFFICERS</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "area-officers" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>02</span>
                <Person2OutlinedIcon
                  sx={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                  }}
                >
                  ABSENT
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "area-officers" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>01</span>
                <QueryBuilderOutlinedIcon
                  sx={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                  }}
                >
                  LATE
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "area-officers" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>04</span>
                <Shirt
                  className="text-[20px]"
                  style={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers" ? "white" : "#2A77D5",
                  }}
                >
                  UNIFORM
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleTableViewChange("incidents")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "incidents" ? "#2A77D5" : "white",
              color: selectedTableView === "incidents" ? "white" : "black",
            }}
          >
            <span className="text-xs">INCIDENT REPORTS</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "incidents" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>02</span>
                <HistoryToggleOffIcon
                  sx={{
                    color: selectedTableView === "incidents" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "incidents" ? "white" : "#2A77D5",
                  }}
                >
                  OPEN
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "incidents" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>06</span>
                <TaskAltOutlinedIcon
                  sx={{
                    color: selectedTableView === "incidents" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "incidents" ? "white" : "#2A77D5",
                  }}
                >
                  CLOSED
                </span>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleTableViewChange("area-officers-tasks")}
            className="p-2 rounded-lg flex flex-col gap-2 items-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: selectedTableView === "area-officers-tasks" ? "#2A77D5" : "white",
              color: selectedTableView === "area-officers-tasks" ? "white" : "black",
            }}
          >
            <span className="text-xs">AREA OFFICERS : TASKS</span>
            <div
              className="flex flex-row items-center rounded-lg w-full justify-around"
              style={{
                backgroundColor: selectedTableView === "area-officers-tasks" ? "rgba(255,255,255,0.2)" : "#F1F7FE",
              }}
            >
              <div className="flex flex-col items-center p-2">
                <span>02</span>
                <WarningAmberOutlinedIcon
                  sx={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                  }}
                >
                  OVERDUE
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "area-officers-tasks" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>01</span>
                <HistoryToggleOffIcon
                  sx={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                  }}
                >
                  PENDING
                </span>
              </div>
              <Divider
                orientation="vertical"
                sx={{
                  borderColor: selectedTableView === "area-officers-tasks" ? "rgba(255,255,255,0.3)" : "#C2DBFA",
                }}
              />
              <div className="flex flex-col items-center p-2">
                <span>04</span>
                <TaskAltOutlinedIcon
                  sx={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                    fontSize: "20px",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: selectedTableView === "area-officers-tasks" ? "white" : "#2A77D5",
                  }}
                >
                  DONE
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 min-h-[600px]">
          <DashboardTableView
            selectedTableView={selectedTableView}
            selectedColumn={selectedColumn}
            onColumnClick={handleColumnClick}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
