import { useGetAlertnessDefaults } from "@modules/clients/apis/hooks/useGetAlertnessDefaults";
import { useGetAttendanceCount } from "@modules/clients/apis/hooks/useGetAttendanceCount";
import { useGetGeofenceActivity } from "@modules/clients/apis/hooks/useGetGeofenceActivity";
import { useGetLateCount } from "@modules/clients/apis/hooks/useGetLateCount";
import { useGetUniformDefaults } from "@modules/clients/apis/hooks/useGetUniformDefaults";
import MetricChart from "@modules/clients/components/CustomMetricChart";
import { renderMetricComponent } from "@modules/clients/components/GuardDefaultsComponents";
import { GuardDefaultsListView } from "@modules/clients/components/GuardDefaultsListView";
import { useClientContext } from "@modules/clients/context/ClientContext";
import { getDateRangeForView } from "@modules/clients/utils/dateRangeUtils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import { Button, CircularProgress } from "@mui/material";
import { ShirtIcon } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function ClientGuardDefaults() {
  const { selectedView, currentDate, selectedMetric, setSelectedMetric } = useClientContext();
  const { clientId } = useParams();

  const dateRange = useMemo(() => {
    return getDateRangeForView(selectedView, currentDate);
  }, [selectedView, currentDate]);

  const { data: attendanceData, isLoading: isLoadingAbsent } = useGetAttendanceCount(
    clientId || "",
    dateRange.startDate,
    dateRange.endDate
  );
  const { data: lateData, isLoading: isLoadingLate } = useGetLateCount(
    clientId || "",
    dateRange.startDate,
    dateRange.endDate
  );
  const { data: uniformData, isLoading: isLoadingUniform } = useGetUniformDefaults(
    clientId || "",
    dateRange.startDate,
    dateRange.endDate
  );
  const { data: alertnessData, isLoading: isLoadingAlertness } = useGetAlertnessDefaults(
    clientId || "",
    dateRange.startDate,
    dateRange.endDate
  );
  const { data: geofenceData, isLoading: isLoadingGeofence } = useGetGeofenceActivity(
    clientId || "",
    dateRange.startDate,
    dateRange.endDate
  );

  const isLoading = isLoadingAbsent || isLoadingLate || isLoadingUniform || isLoadingAlertness || isLoadingGeofence;

  const metrics = useMemo(() => {
    return {
      absent: attendanceData?.data?.summary?.totalUniqueAbsentGuards || 0,
      late: lateData?.data?.totalLateIncidents || 0,
      uniform: uniformData?.data?.totalUniformDefaults || 0,
      alertness: alertnessData?.data?.totalAlertnessDefaults || 0,
      geofence: geofenceData?.data?.guardsWithGeofenceActivity?.length || 0,
      patrol: geofenceData?.data?.totalSessions || 0,
      total:
        (attendanceData?.data?.summary?.totalUniqueAbsentGuards || 0) +
        (lateData?.data?.totalLateIncidents || 0) +
        (uniformData?.data?.totalUniformDefaults || 0) +
        (alertnessData?.data?.totalAlertnessDefaults || 0),
    };
  }, [attendanceData, lateData, uniformData, alertnessData, geofenceData]);

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const getMetricButtonStyles = (metric: string) => ({
    display: "flex",
    flexDirection: "column",
    gap: 0,
    bgcolor: selectedMetric === metric ? "#2A77D5" : "#ffffff",
    color: selectedMetric === metric ? "white" : "#2A77D5",
    border: selectedMetric === metric ? "2px solid #2A77D5" : "2px solid #e0e0e0",
    "&:hover": {
      bgcolor: selectedMetric === metric ? "#1E5A96" : "#E3F2FD",
      border: "2px solid #2A77D5",
    },
    "& .MuiSvgIcon-root": {
      color: selectedMetric === metric ? "white" : "#2A77D5",
    },
    "& .lucide": {
      color: selectedMetric === metric ? "white" : "#2A77D5",
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 w-full h-full flex flex-col items-center justify-center">
        <CircularProgress />
        <p className="mt-2 text-gray-600">Loading metrics data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <div className="flex flex-row gap-2 mt-4 flex-1">
        <div className="bg-white w-fit p-4 rounded-lg flex flex-col gap-4">
          {selectedView === "custom" ? (
            <MetricChart />
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <span className="uppercase text-lg">GUARDS : {selectedMetric}</span>
              <div className="flex flex-row gap-4 my-2">
                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("absent")}
                  onClick={() => handleMetricChange("absent")}
                >
                  <PersonOffOutlinedIcon />
                  {metrics.absent.toString().padStart(2, "0")}
                </Button>
                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("late")}
                  onClick={() => handleMetricChange("late")}
                >
                  <AccessTimeOutlinedIcon />
                  {metrics.late.toString().padStart(2, "0")}
                </Button>
                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("uniform")}
                  onClick={() => handleMetricChange("uniform")}
                >
                  <ShirtIcon className={`w-6 h-6 ${selectedMetric === "uniform" ? "text-white" : "text-blue-600"}`} />
                  {metrics.uniform.toString().padStart(2, "0")}
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
                  {metrics.alertness.toString().padStart(2, "0")}
                </Button>
                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("geofence")}
                  onClick={() => handleMetricChange("geofence")}
                >
                  <HomeWorkOutlinedIcon />
                  {metrics.geofence.toString().padStart(2, "0")}
                </Button>
                <Button
                  variant="contained"
                  sx={getMetricButtonStyles("patrol")}
                  onClick={() => handleMetricChange("patrol")}
                >
                  <DirectionsRunOutlinedIcon />
                  {metrics.patrol.toString().padStart(2, "0")}
                </Button>
              </div>
            </div>
          )}
          {renderMetricComponent(selectedMetric, selectedView, currentDate)}
        </div>
        {(selectedView === "week" || selectedView === "month" || selectedView === "custom") && (
          <GuardDefaultsListView />
        )}
      </div>
    </div>
  );
}
