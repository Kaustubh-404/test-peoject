// Updated GuardDefaultsComponent.tsx

import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import DefaultFilterTabs from "./DefaultFilterTabs";
import PatrolContent from "./PatrolContent";
import TimeWheelContent from "./TimeWheelContent";
import UniformContent from "./UniformContent";
import type { DefaultData, DefaultType, GuardDefault } from "./defaults-types";

interface DefaultsCardProps {
  defaults: DefaultData[];
  width?: string | number;
  height?: string | number;
  // New props for week/month view
  isWeekOrMonthView?: boolean;
  allDaysInPeriod?: Date[];
  allDefaultsData?: GuardDefault[];
  onDayClick?: (date: Date) => void;
}

/**
 * Main defaults card component that displays guard defaults with filter tabs
 * Enhanced to support week/month view with day highlighting
 */
const DefaultsCard: React.FC<DefaultsCardProps> = ({
  defaults,
  width = "502px",
  height = "288px",
  isWeekOrMonthView = false,
  allDaysInPeriod = [],
  allDefaultsData = [],
  onDayClick,
}) => {
  // Get available default types
  const availableTypes = defaults.map((d) => d.type);

  // Set initial selected type to first available type
  const [selectedType, setSelectedType] = useState<DefaultType>(availableTypes.length > 0 ? availableTypes[0] : "LATE");

  // Get selected default data
  const selectedDefault = defaults.find((d) => d.type === selectedType);

  // Get title text based on selected type
  const getTitleText = (): string => {
    if (isWeekOrMonthView) {
      return "DEFAULTS : ALL DAYS";
    }

    switch (selectedType) {
      case "LATE":
        return "DEFAULTS : LATE";
      case "UNIFORM":
        return "DEFAULTS : UNIFORM";
      case "ALERTNESS":
        return "DEFAULTS : ALERTNESS";
      case "GEOFENCE":
        return "DEFAULTS : GEOFENCE";
      case "PATROL":
        return "DEFAULTS : PATROL";
      default:
        return "DEFAULTS";
    }
  };

  // Check if a date has defaults
  const hasDefaultsOnDate = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayDefaults = allDefaultsData.find((gd) => gd.date === dateStr);
    return dayDefaults ? dayDefaults.defaults.length > 0 : false;
  };

  // Handle day click - only trigger if day has defaults
  const handleDayClick = (date: Date) => {
    if (hasDefaultsOnDate(date) && onDayClick) {
      onDayClick(date);
    }
  };

  // Render week view
  const renderWeekView = () => {
    return (
      <Box
        sx={{
          width: "470px",
          height: "168px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        {/* Days Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px",
            flex: 1,
          }}
        >
          {allDaysInPeriod.map((date, index) => {
            const hasDefaults = hasDefaultsOnDate(date);
            const dayOfMonth = date.getDate();
            const dayName = format(date, "EEE").substring(0, 1); // First letter of day

            return (
              <Box
                key={index}
                onClick={() => handleDayClick(date)}
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  cursor: hasDefaults ? "pointer" : "default",
                  backgroundColor: hasDefaults ? "#FFE6E6" : "transparent",
                  border: hasDefaults ? "2px solid #FF6B6B" : "1px solid #F0F0F0",
                  "&:hover": hasDefaults
                    ? {
                        backgroundColor: "#FFD6D6",
                      }
                    : {},
                  transition: "all 0.2s ease",
                }}
              >
                {/* Day name (S, M, T, etc.) */}
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 500,
                    fontSize: "10px",
                    color: "#707070",
                    lineHeight: "12px",
                  }}
                >
                  {dayName}
                </Typography>

                {/* Day number */}
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: hasDefaults ? "#FF6B6B" : "#3B3B3B",
                    lineHeight: "16px",
                  }}
                >
                  {dayOfMonth}
                </Typography>

                {/* Defaults indicator - only show if has defaults */}
                {hasDefaults && (
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#FF6B6B",
                      marginTop: "2px",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Summary */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "8px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "12px",
              color: "#707070",
              textAlign: "center",
            }}
          >
            {allDefaultsData.filter((gd) => gd.defaults.length > 0).length > 0
              ? `${allDefaultsData.filter((gd) => gd.defaults.length > 0).length} day${allDefaultsData.filter((gd) => gd.defaults.length > 0).length > 1 ? "s" : ""} with defaults`
              : "No defaults in this period"}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Render month view - more compact to fit in container
  const renderMonthView = () => {
    return (
      <Box
        sx={{
          width: "470px",
          height: "168px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          paddingTop: "8px",
          paddingBottom: "8px",
        }}
      >
        {/* Days Grid - smaller cells for month view */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "3px",
            flex: 1,
            maxHeight: "140px",
            overflow: "hidden",
          }}
        >
          {allDaysInPeriod.slice(0, 35).map((date, index) => {
            // Limit to 5 weeks max
            const hasDefaults = hasDefaultsOnDate(date);
            const dayOfMonth = date.getDate();

            return (
              <Box
                key={index}
                onClick={() => handleDayClick(date)}
                sx={{
                  minHeight: "18px",
                  maxHeight: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  cursor: hasDefaults ? "pointer" : "default",
                  backgroundColor: hasDefaults ? "#FFE6E6" : "transparent",
                  border: hasDefaults ? "1px solid #FF6B6B" : "1px solid #F0F0F0",
                  "&:hover": hasDefaults
                    ? {
                        backgroundColor: "#FFD6D6",
                      }
                    : {},
                  transition: "all 0.2s ease",
                }}
              >
                {/* Day number */}
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "10px",
                    color: hasDefaults ? "#FF6B6B" : "#3B3B3B",
                    lineHeight: "12px",
                  }}
                >
                  {dayOfMonth}
                </Typography>

                {/* Defaults indicator - only show if has defaults */}
                {hasDefaults && (
                  <Box
                    sx={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#FF6B6B",
                      marginTop: "1px",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Summary */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "4px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "10px",
              color: "#707070",
              textAlign: "center",
            }}
          >
            {allDefaultsData.filter((gd) => gd.defaults.length > 0).length > 0
              ? `${allDefaultsData.filter((gd) => gd.defaults.length > 0).length} day${allDefaultsData.filter((gd) => gd.defaults.length > 0).length > 1 ? "s" : ""} with defaults`
              : "No defaults in this period"}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Render content based on selected type
  const renderContent = () => {
    if (isWeekOrMonthView) {
      // Determine which view to render based on the title or data
      const isWeekView = getTitleText().includes("ALL DAYS") && allDaysInPeriod.length <= 7;
      return isWeekView ? renderWeekView() : renderMonthView();
    }

    if (!selectedDefault) {
      return (
        <Box
          sx={{
            width: "470px",
            height: "168px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 400,
              fontSize: "16px",
              color: "#707070",
            }}
          >
            No data available for this default type.
          </Typography>
        </Box>
      );
    }

    switch (selectedType) {
      case "UNIFORM":
        return <UniformContent errors={selectedDefault.uniformErrors || []} />;
      case "PATROL":
        return <PatrolContent errors={selectedDefault.patrolErrors || []} />;
      case "LATE":
      case "ALERTNESS":
      case "GEOFENCE":
        return (
          <TimeWheelContent
            timeWheelData={selectedDefault.timeWheel!}
            displayText={selectedDefault.displayText || ""}
          />
        );
      default:
        return null;
    }
  };

  // If no defaults available and not week/month view, show empty state
  if (defaults.length === 0 && !isWeekOrMonthView) {
    return (
      <Box
        sx={{
          width: width,
          height: height,
          borderRadius: "10px",
          padding: "16px",
          gap: "16px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Empty State Icon */}
        <Box
          sx={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "32px",
              color: "#CCCCCC",
            }}
          >
            👤
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "16px",
            color: "#CCCCCC",
            textAlign: "center",
          }}
        >
          DEFAULTS
        </Typography>
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontWeight: 400,
            fontSize: "14px",
            color: "#CCCCCC",
            textAlign: "center",
          }}
        >
          NO RECENT
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: width,
        height: height,
        borderRadius: "10px",
        padding: "16px",
        gap: "16px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          width: "470px",
          height: "72px",
          gap: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title */}
        <Box
          sx={{
            width: "470px",
            height: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "3px",
            paddingBottom: "3px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "20px",
              textAlign: "center",
              textTransform: "capitalize",
              color: "#3B3B3B",
            }}
          >
            {getTitleText()}
          </Typography>
        </Box>

        {/* Filter Tabs - Only show for day view */}
        {!isWeekOrMonthView && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingTop: "8px",
            }}
          >
            <DefaultFilterTabs
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              availableTypes={availableTypes}
            />
          </Box>
        )}
      </Box>

      {/* Content */}
      {renderContent()}
    </Box>
  );
};

export default DefaultsCard;
