import { IncidentReportColumns, incidentReportItems } from "@modules/clients/columns/SitePerformanceIncidents";
import { datagridStyle } from "@modules/clients/lib/datagridStyle";
import { formatDate, getWeekRange } from "@modules/clients/utils/dateRangeUtils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import CalendarViewWeekOutlinedIcon from "@mui/icons-material/CalendarViewWeekOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ShirtIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type GuardAbsentItems,
  type GuardAlertnessItems,
  type GuardGeofenceItems,
  type GuardLateItems,
  type GuardPatrolItems,
  type GuardUniformItems,
} from "../../columns/GuardsDefaultsListViewColumns";

type ViewType = "day" | "week" | "month" | "custom";
type GuardItems =
  | GuardAbsentItems
  | GuardLateItems
  | GuardUniformItems
  | GuardAlertnessItems
  | GuardGeofenceItems
  | GuardPatrolItems;

interface TasksData {
  id: string;
  assignedBy: string;
  time: string;
  date: string;
}
const tasksData: TasksData[] = [
  {
    id: "12443",
    assignedBy: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
  {
    id: "12443",
    assignedBy: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
  {
    id: "12443",
    assignedBy: "Nehru Place",
    time: "04:35 PM",
    date: "23/01/25",
  },
];

export default function Performance() {
  const [selectedView, setSelectedView] = useState<ViewType>("day");
  const [currentDate] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState<string>("absent");
  const [selectedGuard, setSelectedGuard] = useState<GuardItems | null>(null);
  const [activeTab, setActiveTab] = useState<"overdue" | "pending" | "done">("pending");
  const [activeIncidentTab, setActiveIncidentTab] = useState<"open" | "closed">("open");
  const { clientId, siteId } = useParams();

  const currentFormatted = formatDate(currentDate);
  const todayString = `${currentFormatted.dayName} ${currentFormatted.day}/${currentFormatted.month}/${currentFormatted.year}`;
  const weekString = getWeekRange(currentDate);
  const monthString = `${currentFormatted.monthName} ${currentFormatted.year}`;

  const getButtonStyles = (isSelected: boolean) => ({
    bgcolor: isSelected ? "#2A77D5" : "white",
    color: isSelected ? "white" : "#2A77D5",
    border: "1px solid #2A77D5",
    "&:hover": {
      bgcolor: isSelected ? "#1E5A96" : "#E3F2FD",
    },
  });

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    setSelectedGuard(null);
  };

  const getMetricButtonStyles = (metric: string) => ({
    display: "flex",
    flexDirection: "column",
    gap: 0,
    bgcolor: selectedMetric === metric ? "#2A77D5" : "#ffffff",
    color: selectedMetric === metric ? "white" : "#2A77D5",
    "&:hover": {
      bgcolor: selectedMetric === metric ? "#1E5A96" : "#E3F2FD",
    },
    "& .MuiSvgIcon-root": {
      color: selectedMetric === metric ? "white" : "#2A77D5",
    },
    "& .lucide": {
      color: selectedMetric === metric ? "white" : "#2A77D5",
    },
  });

  useEffect(() => {
    console.log("Selected Guard:", selectedGuard);
    console.log("Selected Metric:", selectedMetric);
  }, [selectedGuard, selectedMetric]);
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-row gap-4 ml-auto">
        <Button
          variant="outlined"
          size="small"
          sx={getButtonStyles(selectedView === "day")}
          onClick={() => handleViewChange("day")}
        >
          <EventOutlinedIcon sx={{ mr: 1 }} />
          {selectedView === "day" ? `DAY | ${todayString}` : "DAY"}
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={getButtonStyles(selectedView === "week")}
          onClick={() => handleViewChange("week")}
        >
          <CalendarViewWeekOutlinedIcon sx={{ mr: 1 }} />
          {selectedView === "week" ? `WEEK | ${weekString}` : "WEEK"}
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={getButtonStyles(selectedView === "month")}
          onClick={() => handleViewChange("month")}
        >
          <CalendarViewMonthOutlinedIcon sx={{ mr: 1 }} />
          {selectedView === "month" ? `MONTH | ${monthString}` : "MONTH"}
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={getButtonStyles(selectedView === "custom")}
          onClick={() => handleViewChange("custom")}
        >
          <CalendarMonthOutlinedIcon sx={{ mr: 1 }} />
          CUSTOM
        </Button>
      </div>

      <div className="flex flex-row gap-4 mt-4">
        <div className="bg-white p-4 w-fit rounded-lg">
          <div className="flex flex-col gap-4 items-center">
            <span className="uppercase text-lg">GUARDS : {selectedMetric}</span>

            <div className="flex flex-row gap-4 my-2">
              <Button
                variant="contained"
                sx={getMetricButtonStyles("absent")}
                onClick={() => handleMetricChange("absent")}
              >
                <PersonOffOutlinedIcon />
                08
              </Button>

              <Button variant="contained" sx={getMetricButtonStyles("late")} onClick={() => handleMetricChange("late")}>
                <AccessTimeOutlinedIcon />
                08
              </Button>

              <Button
                variant="contained"
                sx={getMetricButtonStyles("uniform")}
                onClick={() => handleMetricChange("uniform")}
              >
                <ShirtIcon className={`w-6 h-6 ${selectedMetric === "uniform" ? "text-white" : "text-blue-600"}`} />
                08
              </Button>

              <Button
                variant="contained"
                sx={getMetricButtonStyles("alertness")}
                onClick={() => handleMetricChange("alertness")}
              >
                <img
                  src="/client_icons/alertness.svg"
                  alt="Alertness Icon"
                  className="w-6 h-6"
                  style={{
                    filter: selectedMetric === "alertness" ? "brightness(0) invert(1)" : "",
                  }}
                />
                08
              </Button>

              <Button
                variant="contained"
                sx={getMetricButtonStyles("geofence")}
                onClick={() => handleMetricChange("geofence")}
              >
                <HomeWorkOutlinedIcon />
                08
              </Button>

              <Button
                variant="contained"
                sx={getMetricButtonStyles("patrol")}
                onClick={() => handleMetricChange("patrol")}
              >
                <DirectionsRunOutlinedIcon />
                08
              </Button>
            </div>
          </div>

          {/* <ClientDefaultsDetailsTable selectedMetric={selectedMetric} setSelectedGuard={setSelectedGuard} /> */}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="bg-white flex flex-col p-4 rounded-lg items-center gap-4">
            <h2 className="font-semibold">TASKS</h2>
            <div className="flex gap-2 mb-6 bg-[#F7F7F7] p-2 rounded-lg">
              <button
                onClick={() => setActiveTab("overdue")}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg font-medium transition-colors w-[8vw] uppercase text-sm h-fit justify-center ${
                  activeTab === "overdue" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <ReportProblemOutlinedIcon />
                overdue (02)
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg font-medium transition-colors w-[8vw] uppercase text-sm h-fit justify-center ${
                  activeTab === "pending" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <CheckCircleIcon />
                pending (02)
              </button>
              <button
                onClick={() => setActiveTab("done")}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg font-medium transition-colors w-[8vw] uppercase text-sm h-fit justify-center ${
                  activeTab === "done" ? "bg-[#2A77D5] text-white" : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <CheckCircleIcon />
                done (02)
              </button>
            </div>
            <div className="overflow-hidden whitespace-nowrap text-left w-[20vw]">
              {/* Table Header */}
              <div className="grid grid-cols-2 gap-4 px-2 py-2">
                <div className="text-gray-600 font-medium text-sm">DUE ON</div>
                <div className="text-gray-600 font-medium text-sm">ASSIGNED BY</div>
              </div>
              <div className="flex flex-col gap-2">
                {tasksData.map((task, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* Table Data Row */}
                    <div className="grid grid-cols-2 gap-4 px-2 py-2 bg-white items-center">
                      <div className="text-gray-800 font-medium inline-flex gap-1">
                        <div>{task.date}</div>
                        <span className="text-gray-200">|</span>
                        <div>{task.time}</div>
                      </div>
                      <a href={`/clients/${clientId}/performance/area-officers-tasks/${siteId}`}>
                        <div className="text-gray-800 font-medium">{task.assignedBy}</div>
                      </a>
                    </div>

                    {/* Action Icons Row */}
                    <div className="bg-blue-50 px-6 py-2 border-t border-gray-200">
                      <div className="flex justify-center gap-4">
                        <button className="">
                          <LocalFireDepartmentOutlinedIcon sx={{ color: "#2A77D5" }} />
                        </button>
                        <button className="">
                          <HomeOutlinedIcon sx={{ color: "#2A77D5" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white flex flex-col p-4 rounded-lg items-center gap-4 w-full">
            <h2 className="font-semibold">INCIDENT REPORTS</h2>
            <div className="flex gap-2 mb-6 bg-[#F7F7F7] p-2 rounded-lg">
              <button
                onClick={() => setActiveIncidentTab("open")}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg font-medium transition-colors w-[8vw] uppercase text-sm h-fit justify-center ${
                  activeIncidentTab === "open"
                    ? "bg-[#2A77D5] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <ReportProblemOutlinedIcon />
                open (02)
              </button>
              <button
                onClick={() => setActiveIncidentTab("closed")}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg font-medium transition-colors w-[8vw] uppercase text-sm h-fit justify-center ${
                  activeIncidentTab === "closed"
                    ? "bg-[#2A77D5] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <CheckCircleIcon />
                closed (02)
              </button>
            </div>
            <div className="overflow-hidden whitespace-nowrap text-left">
              <Box
                sx={{
                  width: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DataGrid
                  rows={incidentReportItems}
                  columns={IncidentReportColumns}
                  hideFooter={true}
                  // onRowSelectionModelChange={(newRowSelectionModel) => {
                  //   const selectedId = Array.from(newRowSelectionModel.ids)[0];
                  //   if (selectedId !== undefined) {
                  //     setSelectedGuard(items[Number(selectedId)] as GuardItems);
                  //   }
                  // }}
                  // rowSelectionModel={selectedGuardIndex}
                  disableColumnMenu
                  disableMultipleRowSelection={true}
                  sx={datagridStyle}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
