import { ClientDefaultsDetailsTable } from "@modules/clients/components/ClientDefaultsDetailsTable";
import { useClientContext } from "@modules/clients/context/ClientContext";
import { formatDate, getWeekRange } from "@modules/clients/utils/dateRangeUtils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import CalendarViewWeekOutlinedIcon from "@mui/icons-material/CalendarViewWeekOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import { Avatar, Button } from "@mui/material";
import { ShirtIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  type GuardAbsentItems,
  type GuardAlertnessItems,
  type GuardGeofenceItems,
  type GuardLateItems,
  type GuardPatrolItems,
  type GuardUniformItems,
} from "../../columns/GuardsDefaultsListViewColumns";
import {
  AbsentDetails,
  AlertnessDetails,
  GeofenceDetails,
  LateDetails,
  PatrolDetails,
  UniformInspection,
} from "../../components/ClientDefaultsDetailsComponents";

type ViewType = "day" | "week" | "month" | "custom";
type GuardItems =
  | GuardAbsentItems
  | GuardLateItems
  | GuardUniformItems
  | GuardAlertnessItems
  | GuardGeofenceItems
  | GuardPatrolItems;

export default function ClientGuardDefaultsDetails() {
  const { siteId } = useParams();
  const [selectedGuard, setSelectedGuard] = useState<GuardItems | null>(null);
  const { selectedView, setSelectedView, currentDate, selectedMetric, setSelectedMetric, clientDetails } =
    useClientContext();
  const navigate = useNavigate();
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

  const renderDetailsComponent = () => {
    if (!selectedGuard) return null;

    switch (selectedMetric) {
      case "absent":
        return <AbsentDetails guardData={selectedGuard as GuardAbsentItems} />;

      case "late":
        return <LateDetails guardData={selectedGuard as GuardLateItems} />;

      case "uniform":
        return <UniformInspection guardPhoto={selectedGuard.photo} guardName={selectedGuard.name} />;

      case "alertness":
        return (
          <AlertnessDetails
            guardData={selectedGuard as GuardAlertnessItems}
            missedTimes={[
              { id: 1, number: 1, time: "10:35 AM" },
              { id: 2, number: 2, time: "12:54 PM" },
            ]}
          />
        );

      case "geofence":
        return (
          <GeofenceDetails
            guardData={selectedGuard as GuardGeofenceItems}
            violations={[
              {
                id: 1,
                number: 1,
                entryTime: "08:40 AM",
                exitTime: "08:58 AM",
                duration: "18 Min",
                aoAction: "Approved",
                status: "approved" as const,
                viewReason: "View Task",
              },
              {
                id: 2,
                number: 2,
                entryTime: "02:24 PM",
                exitTime: "02:34 PM",
                duration: "10 Min",
                aoAction: "Pending",
                status: "pending" as const,
                viewReason: "View Task",
              },
            ]}
          />
        );

      case "patrol":
        return (
          <PatrolDetails
            guardData={selectedGuard as GuardPatrolItems}
            patrolData={[
              {
                id: 1,
                startTime: "08:00 AM",
                patrolRoute: "Parking",
                patrolRound: "01",
                checkPoint: "01",
                error: "Photo Not Taken",
                errorType: "photo" as const,
              },
              {
                id: 2,
                startTime: "10:20 AM",
                patrolRoute: "Basement",
                patrolRound: "02",
                checkPoint: "03",
                error: "Patrol Unfinished",
                errorType: "unfinished" as const,
              },
              {
                id: 3,
                startTime: "01:00 PM",
                patrolRoute: "Parking",
                patrolRound: "02",
                checkPoint: "-",
                error: "Patrol Missed",
                errorType: "missed" as const,
              },
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div className="inline-flex gap-2">
          <ArrowBackIcon onClick={() => navigate(-1)} className="cursor-pointer" />

          <h2 className="font-semibold">
            {clientDetails?.clientName} - {clientDetails?.sites.find((site) => site.id === siteId)?.siteName}
          </h2>
        </div>

        <div className="flex flex-row gap-4">
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
      </div>

      <div className="flex flex-col bg-[#F7F7F7] p-4 rounded-lg mt-4 gap-y-4">
        <div className="flex flex-row gap-4">
          <div className="bg-white p-4 rounded-lg w-[140px] h-[140px] flex items-center justify-center">
            <Avatar src={clientDetails?.clientLogo ?? undefined} alt="Client Logo" sx={{ width: 100, height: 100 }} />
          </div>

          <div className="flex flex-col gap-2 bg-white p-4 rounded-lg min-w-[20vw]">
            <span className="font-semibold">Details</span>
            <div className="grid grid-cols-2 gap-x-2">
              <span className="text-[#A3A3A3]">Client</span>
              <span>{clientDetails?.clientName}</span>
              <span className="text-[#A3A3A3]">Site</span>
              <span>{clientDetails?.sites.find((site) => site.id === siteId)?.siteName}</span>
              <span className="text-[#A3A3A3]">Site ID</span>
              <span>{siteId}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-white p-4 rounded-lg min-w-[20vw]">
            <span className="font-semibold">Area officer</span>
            <div className="grid grid-cols-2 gap-x-2">
              <span className="text-[#A3A3A3]">Name</span>
              <span>{clientDetails?.sites.find((site) => site.id === siteId)?.areaOfficerId[0]}</span>
              <span className="text-[#A3A3A3]">Area</span>
              <span>{clientDetails?.sites.find((site) => site.id === siteId)?.city}</span>
              <span className="text-[#A3A3A3]">Phone</span>
              <span>{clientDetails?.sites.find((site) => site.id === siteId)?.siteContactPhone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row">
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

                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("late")}
                  onClick={() => handleMetricChange("late")}
                >
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

            <ClientDefaultsDetailsTable selectedMetric={selectedMetric} setSelectedGuard={setSelectedGuard} />
          </div>

          {renderDetailsComponent()}
        </div>
      </div>
    </div>
  );
}
