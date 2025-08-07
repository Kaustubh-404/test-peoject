// File: src/components/OfficerProfile-subComponents/OfficerEmploymentDetailsCard.tsx
import EditIcon from "@mui/icons-material/Edit";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import { formatDateOnly } from "../../../../utils/dateFormatter";

// Props interface
interface OfficerEmploymentDetailsCardProps {
  employmentDetails: {
    companyId: string;
    dateOfJoining: string;
    designation: string;
    assignedArea: string;
    areaManager: string;
  };
  onEdit: () => void;
  isUpdating?: boolean;
}

// Key-Value pair component for displaying data
const KeyValuePair: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ display: "flex", gap: "12px", mb: "8px", alignItems: "flex-start" }}>
    <Typography
      sx={{
        width: "88px",
        fontFamily: "Mukta",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "16px",
        color: "#A3A3A3",
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        flex: 1,
        fontFamily: "Mukta",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "16px",
        color: "#3B3B3B",
        wordBreak: "break-word",
      }}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

const OfficerEmploymentDetailsCard: React.FC<OfficerEmploymentDetailsCardProps> = ({
  employmentDetails,
  onEdit,
  isUpdating = false,
}) => {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        padding: "16px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "150px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "20px",
            color: "#3B3B3B",
            textTransform: "capitalize",
          }}
        >
          Employment Details
        </Typography>
        <IconButton
          onClick={onEdit}
          disabled={isUpdating}
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
            backgroundColor: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#F5F5F5",
            },
            "&.Mui-disabled": {
              backgroundColor: "#F0F0F0",
            },
          }}
        >
          {isUpdating ? (
            <CircularProgress size={14} />
          ) : (
            <EditIcon sx={{ width: "14px", height: "14px", color: "#2A77D5" }} />
          )}
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        <KeyValuePair label="Company ID" value={employmentDetails.companyId || ""} />
        <KeyValuePair
          label="Joining Date"
          value={employmentDetails.dateOfJoining ? formatDateOnly(employmentDetails.dateOfJoining) : ""}
        />
        <KeyValuePair label="Designation" value={employmentDetails.designation || ""} />
        <KeyValuePair label="Assigned Area" value={employmentDetails.assignedArea || ""} />
        <KeyValuePair label="Area Manager" value={employmentDetails.areaManager || ""} />
      </Box>
    </Box>
  );
};

export default OfficerEmploymentDetailsCard;
