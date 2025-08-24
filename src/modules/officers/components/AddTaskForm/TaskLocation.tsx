// File: src/modules/officers/components/AddTaskForm/TaskLocation.tsx
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import type { TransformedClientSite } from "../../service/clientSitesApiService";
import { useClientSites } from "../../service/clientSitesApiService";
import CustomLocationModal from "./CustomLocationModal";

interface TaskLocationData {
  selectedSites: Array<{
    siteId: string;
    clientId: string;
    siteName: string;
    clientName: string;
  }>;
  customLocation?: string;
  isCustomLocation: boolean;
}

interface TaskLocationFormProps {
  data: TaskLocationData;
  areaOfficerId: string | null; // Guard ID for API calls
  onUpdate: (data: Partial<TaskLocationData>) => void;
}

const TaskLocationForm: React.FC<TaskLocationFormProps> = ({ data, areaOfficerId, onUpdate }) => {
  const [customLocationModalOpen, setCustomLocationModalOpen] = useState(false);

  // Fetch client sites using the same API as ClientSitesWindow
  const {
    data: clientSites = [],
    isLoading: loadingClientSites,
    error: clientSitesError,
  } = useClientSites(areaOfficerId, !!areaOfficerId);

  const handleSiteSelect = (site: TransformedClientSite) => {
    const siteData = {
      siteId: site.siteId,
      clientId: site.clientId,
      siteName: site.siteName,
      clientName: site.client,
    };

    const isSelected = data.selectedSites.some((s) => s.siteId === site.siteId);

    if (isSelected) {
      // Remove site from selection
      const updatedSites = data.selectedSites.filter((s) => s.siteId !== site.siteId);
      onUpdate({ selectedSites: updatedSites, isCustomLocation: false });
    } else {
      // Add site to selection (for now, single selection - can be enhanced for multiple)
      onUpdate({
        selectedSites: [siteData],
        isCustomLocation: false,
        customLocation: undefined,
      });
    }
  };

  const handleAddCustomLocation = () => {
    setCustomLocationModalOpen(true);
  };

  const handleCustomLocationSave = (locationName: string) => {
    onUpdate({
      customLocation: locationName,
      isCustomLocation: true,
      selectedSites: [], // Clear site selection when using custom location
    });
    setCustomLocationModalOpen(false);
  };

  const handleClearCustomLocation = () => {
    onUpdate({
      customLocation: undefined,
      isCustomLocation: false,
    });
  };

  // Show error if no area officer ID
  if (!areaOfficerId) {
    return (
      <Box
        sx={{
          width: "1136px",
          height: "552px",
          padding: "24px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error">Officer information not available. Cannot load client sites.</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "1136px",
          height: "552px",
          padding: "24px",
          gap: "24px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "32px",
            color: "#2A77D5",
            textTransform: "capitalize",
            mb: 3,
          }}
        >
          TASK LOCATION
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Label */}
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "16px",
              color: "#707070",
              textTransform: "capitalize",
            }}
          >
            Select a Task Location
          </Typography>

          {/* Custom Location Display */}
          {data.isCustomLocation && data.customLocation && (
            <Box
              sx={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#E3F0FF",
                border: "2px solid #2A77D5",
                boxShadow: "0px 1px 4px 0px #70707033",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOnIcon sx={{ color: "#2A77D5", fontSize: "24px" }} />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Mukta",
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#2A77D5",
                    }}
                  >
                    Custom Location Selected
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Mukta",
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "#3B3B3B",
                    }}
                  >
                    {data.customLocation}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <CheckIcon sx={{ color: "#2A77D5", fontSize: "24px" }} />
                <Typography
                  onClick={handleClearCustomLocation}
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "#E05952",
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#C04A43",
                    },
                  }}
                >
                  Clear
                </Typography>
              </Box>
            </Box>
          )}

          {/* Add New Location Button */}
          <Box
            onClick={handleAddCustomLocation}
            sx={{
              width: "112px",
              height: "90px",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: data.isCustomLocation ? "#E3F0FF" : "#FFFFFF",
              border: data.isCustomLocation ? "2px solid #2A77D5" : "none",
              boxShadow: "0px 1px 4px 0px #70707033",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              mb: 2,
              "&:hover": {
                backgroundColor: data.isCustomLocation ? "#E3F0FF" : "#F5F5F5",
              },
            }}
          >
            <AddIcon
              sx={{
                width: "32px",
                height: "32px",
                color: data.isCustomLocation ? "#2A77D5" : "#2A77D5",
                mb: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "14px",
                textAlign: "center",
                textTransform: "uppercase",
                color: data.isCustomLocation ? "#2A77D5" : "#3B3B3B",
              }}
            >
              Add New Location
            </Typography>
          </Box>

          {/* Client Sites Section */}
          <Box>
            <Typography
              sx={{
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "12px",
                color: "#707070",
                textTransform: "capitalize",
                mb: 1,
              }}
            >
              Existing Client Sites ({clientSites.length} available)
            </Typography>

            {/* Error Display */}
            {clientSitesError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load client sites: {clientSitesError.message}
              </Alert>
            )}

            {/* Loading State */}
            {loadingClientSites ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(136px, 1fr))",
                  gap: "16px",
                  maxHeight: "318px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#dddddd",
                    borderRadius: "4px",
                  },
                }}
              >
                {clientSites.length > 0 ? (
                  clientSites.map((site) => {
                    const isSelected = data.selectedSites.some((s) => s.siteId === site.siteId);

                    return (
                      <Box
                        key={site.siteId}
                        onClick={() => handleSiteSelect(site)}
                        sx={{
                          width: "136px",
                          height: "112px",
                          padding: "12px",
                          borderRadius: "12px",
                          backgroundColor: isSelected ? "#E3F0FF" : "#FFFFFF",
                          border: isSelected ? "2px solid #2A77D5" : "none",
                          boxShadow: "0px 1px 4px 0px #70707033",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: isSelected ? "#E3F0FF" : "#F5F5F5",
                          },
                        }}
                      >
                        {/* Client Logo or Icon */}
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#F0F0F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            fontSize: "20px",
                            border: "1.43px solid #F0F0F0",
                          }}
                        >
                          {site.clientLogo ? (
                            <img
                              src={site.clientLogo}
                              alt={site.client}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "🏢"
                          )}
                        </Box>

                        {/* Site Info */}
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: "Mukta",
                              fontWeight: 600,
                              fontSize: "12px",
                              textAlign: "center",
                              color: "#3B3B3B",
                              lineHeight: "14px",
                              mb: 0.5,
                            }}
                          >
                            {site.client}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Mukta",
                              fontWeight: 400,
                              fontSize: "11px",
                              textAlign: "center",
                              color: "#707070",
                              lineHeight: "12px",
                            }}
                          >
                            {site.siteName}
                          </Typography>
                        </Box>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              width: "16px",
                              height: "16px",
                              color: "#2A77D5",
                              backgroundColor: "#FFFFFF",
                              borderRadius: "50%",
                              padding: "2px",
                            }}
                          />
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      gridColumn: "1 / -1",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "200px",
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Mukta",
                        fontSize: "16px",
                        color: "#CCCCCC",
                        textAlign: "center",
                      }}
                    >
                      No client sites available
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Mukta",
                        fontSize: "14px",
                        color: "#A3A3A3",
                        textAlign: "center",
                      }}
                    >
                      You can add a custom location instead
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Custom Location Modal */}
      <CustomLocationModal
        open={customLocationModalOpen}
        onClose={() => setCustomLocationModalOpen(false)}
        onSave={handleCustomLocationSave}
        initialValue={data.customLocation}
      />
    </>
  );
};

export default TaskLocationForm;
