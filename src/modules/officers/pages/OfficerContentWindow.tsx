import AddIcon from "@mui/icons-material/Add";
import DraftsIcon from "@mui/icons-material/Drafts";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Alert, Badge, Box, Button, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfficerFilterComponent from "../components/OfficerFilterComponent";
import OfficerTable from "../components/OfficerTable";
import { useOfficers } from "../context/OfficerContext";

// Interface for filter state
interface FilterState {
  assignedAreas: string[];
  guardsCountMin: number | null;
  guardsCountMax: number | null;
  sitesCountMin: number | null;
  sitesCountMax: number | null;
  trustScore: number | null;
}

// Content Window Component
const OfficerContentWindow: React.FC = () => {
  // Get officers data from context (now uses real API)
  const { officers, loading, error, total, refreshOfficers, forceRefreshOfficers } = useOfficers();

  const navigate = useNavigate();

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔥 Add effect to log when officers array changes (for debugging)
  useEffect(() => {
    console.log("📊 Officers list updated:", officers.length, "officers");
  }, [officers]);

  // Calculate filtered count - count only non-empty array filters and non-null values
  const filterCount = activeFilters
    ? Object.entries(activeFilters).reduce((count, [_key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return count + 1; // Count each filter category only once, not each selected item
        } else if (value !== null && !Array.isArray(value)) {
          return count + 1;
        }
        return count;
      }, 0)
    : 0;

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Apply filters
  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  // Navigate to Add New Officer page
  const handleAddNewOfficer = () => {
    navigate("/add-officer");
  };

  // Handle refresh with force refresh option
  const handleRefresh = async (forceRefresh: boolean = false) => {
    try {
      setIsRefreshing(true);
      console.log(`🔄 ${forceRefresh ? "Force refreshing" : "Refreshing"} officers list...`);

      if (forceRefresh) {
        await forceRefreshOfficers();
      } else {
        await refreshOfficers();
      }

      console.log("✅ Officers list refreshed successfully!");
    } catch (error) {
      console.error("Failed to refresh officers:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading state
  if (loading && officers.length === 0) {
    return (
      <Box
        sx={{
          width: "1272px",
          height: "872px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CircularProgress color="primary" size={48} />
        <Typography sx={{ fontFamily: "Mukta", fontSize: "16px", color: "#707070" }}>
          Loading officers data...
        </Typography>
        <Typography sx={{ fontFamily: "Mukta", fontSize: "14px", color: "#A0A0A0" }}>
          This may take a few moments
        </Typography>
      </Box>
    );
  }

  // Show error state with retry button
  if (error && officers.length === 0) {
    return (
      <Box
        sx={{
          width: "1272px",
          height: "872px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          borderRadius: "16px",
          backgroundColor: "#FFFFFF",
          padding: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 2,
            "& .MuiAlert-message": {
              fontFamily: "Mukta",
            },
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRefresh(true)} // Force refresh on error retry
          startIcon={<RefreshIcon />}
          disabled={isRefreshing}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#2A77D5",
            fontFamily: "Mukta",
            "&:hover": {
              backgroundColor: "#1E5AA3",
            },
          }}
        >
          {isRefreshing ? "Retrying..." : "Retry"}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="content-window"
      sx={{
        width: "1272px",
        height: "872px",
        padding: "16px",
        borderRadius: "16px",
        backgroundColor: "#FFFFFF",
        gap: "16px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Error banner (for non-blocking errors) */}
      {error && officers.length > 0 && (
        <Alert
          severity="warning"
          onClose={() => {}}
          sx={{
            mb: 1,
            "& .MuiAlert-message": {
              fontFamily: "Mukta",
              fontSize: "14px",
            },
          }}
        >
          {error} - Showing cached data
        </Alert>
      )}

      {/* Content Heading */}
      <Box
        className="content-heading"
        sx={{
          width: "1240px",
          height: "32px",
          gap: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Frame 1 - Left side with title */}
        <Box
          className="frame-1"
          sx={{
            width: "840px",
            height: "24px",
            gap: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Text container */}
          <Box
            className="text-container"
            sx={{
              width: "auto",
              height: "24px",
              gap: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Text 1 Box - "Officers" */}
            <Box
              className="text1-box"
              sx={{
                height: "24px",
                gap: "10px",
                paddingTop: "5px",
                paddingBottom: "4px",
              }}
            >
              <Typography
                variant="h1"
                className="text1-properties"
                sx={{
                  height: "15px",
                  fontFamily: "Mukta",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0%",
                  textTransform: "capitalize",
                  color: "#3B3B3B",
                }}
              >
                Officers
              </Typography>
            </Box>

            {/* Text 2 Box - Count of officers */}
            <Box
              className="text2-box"
              sx={{
                height: "24px",
                gap: "10px",
                paddingTop: "5px",
                paddingBottom: "4px",
              }}
            >
              <Typography
                variant="h1"
                className="text2-properties"
                sx={{
                  height: "15px",
                  fontFamily: "Mukta",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0%",
                  textTransform: "capitalize",
                  color: "#707070",
                }}
              >
                {total || officers.length}
              </Typography>
            </Box>

            {/* Loading indicator when refreshing */}
            {(loading || isRefreshing) && officers.length > 0 && (
              <Box sx={{ ml: 1 }}>
                <CircularProgress size={16} sx={{ color: "#2A77D5" }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Frame 2 - Right side with buttons */}
        <Box
          className="frame-2"
          sx={{
            width: "auto",
            height: "32px",
            gap: "16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* Refresh Button with enhanced functionality */}
          <Tooltip title="Refresh data">
            <IconButton
              onClick={(e) => handleRefresh(e.shiftKey)} // Force refresh if Shift is held
              disabled={isRefreshing}
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#F0F0F0",
                },
              }}
            >
              <RefreshIcon
                sx={{
                  width: "16px",
                  height: "16px",
                  color: isRefreshing ? "#A0A0A0" : "#2A77D5",
                  ...(isRefreshing && {
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }),
                }}
              />
            </IconButton>
          </Tooltip>

          {/* Button 1 - Filters */}
          <Badge
            badgeContent={filterCount}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#2A77D5",
                color: "white",
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "10px",
                minWidth: "16px",
                height: "16px",
                right: 4,
                top: 4,
              },
            }}
          >
            <Button
              variant="contained"
              className="button1"
              onClick={toggleFilters}
              sx={{
                width: "97px",
                height: "32px",
                px: "16px",
                borderRadius: "8px",
                backgroundColor: showFilters ? "#F0F7FF" : "#FFFFFF",
                border: showFilters ? "1px solid #2A77D5" : "none",
                boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
                "&:hover": {
                  backgroundColor: showFilters ? "#E3F0FF" : "#F5F5F5",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <FilterListIcon
                className="filter-icon"
                sx={{
                  width: "16px",
                  height: "16px",
                  color: "#2A77D5",
                }}
              />
              <Typography
                className="text-inside-box"
                sx={{
                  fontFamily: "Mukta",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                  textTransform: "uppercase",
                  color: "#2A77D5",
                  whiteSpace: "nowrap",
                }}
              >
                Filters
              </Typography>
            </Button>
          </Badge>

          {/* Button 2 - Add New Officer */}
          <Button
            variant="contained"
            className="button2"
            onClick={handleAddNewOfficer}
            sx={{
              minWidth: "164px",
              height: "32px",
              px: "16px",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <AddIcon
              sx={{
                width: "16px",
                height: "16px",
                color: "#2A77D5",
              }}
            />
            <Typography
              sx={{
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                textTransform: "uppercase",
                color: "#2A77D5",
                whiteSpace: "nowrap",
              }}
            >
              Add New Officer
            </Typography>
          </Button>

          {/* Button 3 - Drafts */}
          <Button
            variant="contained"
            className="button3"
            sx={{
              width: "99px",
              height: "32px",
              px: "16px",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <DraftsIcon
              className="drafts-icon"
              sx={{
                width: "16px",
                height: "16px",
                color: "#2A77D5",
              }}
            />
            <Typography
              className="text-inside-box"
              sx={{
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                textTransform: "uppercase",
                color: "#2A77D5",
                whiteSpace: "nowrap",
              }}
            >
              Drafts
            </Typography>
          </Button>
        </Box>
      </Box>

      {/* Filter Component (conditionally rendered) */}
      {showFilters && (
        <OfficerFilterComponent
          onApplyFilters={handleApplyFilters}
          onClose={() => setShowFilters(false)}
          allOfficers={officers} // Use real officers from API
        />
      )}

      {/* Table Frame Layout */}
      <OfficerTable filters={activeFilters} />
    </Box>
  );
};

export default OfficerContentWindow;
