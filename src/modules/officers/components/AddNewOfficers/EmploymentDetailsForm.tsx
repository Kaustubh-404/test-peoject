import { Box, Divider, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import LabeledInput from "../LabeledInput";

// Define props interface for the component
interface OfficerEmploymentDetailsFormProps {
  register: any;
  errors: any; // Using any type for errors to avoid TypeScript issues
  watch?: any;
  setValue?: any;
}

const OfficerEmploymentDetailsForm: React.FC<OfficerEmploymentDetailsFormProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const { user } = useAuth(); // Get the logged-in user

  // Auto-fill company ID with agency ID when component mounts
  useEffect(() => {
    if (user?.agencyId && setValue) {
      setValue("employmentDetails.companyId", user.agencyId);
    }
  }, [user, setValue]);

  // Helper functions to check and get errors
  const hasError = (fieldName: string) => {
    return errors?.employmentDetails && errors.employmentDetails[fieldName] ? true : false;
  };

  const getErrorMessage = (fieldName: string) => {
    return hasError(fieldName) ? errors.employmentDetails[fieldName].message : "";
  };

  // Get values from watch
  const assignedDutyArea = watch ? watch("employmentDetails.assignedDutyArea") || "" : "";
  const areaManager = watch ? watch("employmentDetails.areaManager") || "" : "";

  // Area options
  const areaOptions = ["North Delhi", "South Delhi", "South East Delhi", "South West Delhi", "East Delhi", "Gurgaon"];

  // Area Manager options based on screenshots
  const areaManagerOptions = ["Sachin Sharma", "Anup Singh", "Vishesh Singh", "Prakash Kapoor", "Prabh Kumar"];

  // Simple phone number formatting - only allow digits and limit to 10
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 10 digits
    return digitsOnly.substring(0, 10);
  };

  // Handle phone number input change - no +91 prefix (handled by backend)
  const handlePhoneChange = (fieldName: string, value: string) => {
    const formatted = formatPhoneNumber(value);
    if (setValue) {
      setValue(fieldName, formatted);
    }
  };

  return (
    <Box
      sx={{
        width: "1136px",
        height: "632px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* Employment Details Heading */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: "Mukta",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: "32px",
          color: "#2A77D5",
          textTransform: "capitalize",
        }}
      >
        EMPLOYMENT DETAILS
      </Typography>
      {/* Section 1 - Duty Details */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "20px",
            color: "#707070",
            textTransform: "capitalize",
            mb: 1,
          }}
        >
          DUTY DETAILS
          <Box component="span" sx={{ color: "red", ml: "2px" }}>
            *
          </Box>
        </Typography>
        <Divider />

        <Box sx={{ mt: 2 }}>
          {/* Row 1 - Company ID, Date of Joining, Designation */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ width: "352px" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: hasError("companyId") ? "error.main" : "#707070",
                }}
              >
                Company ID <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={user?.agencyId || ""}
                disabled
                placeholder="Agency ID will be auto-filled"
                {...register("employmentDetails.companyId", {
                  required: "Company ID is required",
                  pattern: {
                    value: /^[a-zA-Z0-9-_]+$/,
                    message: "Invalid Company ID format",
                  },
                })}
                error={hasError("companyId")}
                helperText={getErrorMessage("companyId") || "This field is automatically filled with your Agency ID"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    backgroundColor: "#F5F5F5",
                  },
                  "& .MuiInputBase-input": {
                    padding: "8.5px 14px",
                    height: "20px",
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Date Of Joining"
                name="employmentDetails.dateOfJoining"
                placeholder="DD/MM/YYYY"
                type="date"
                register={register}
                validation={{
                  required: "Date of Joining is required",
                  validate: {
                    notInFuture: (value: string) => {
                      if (!value) return true;
                      return new Date(value) <= new Date() || "Date of Joining cannot be in the future";
                    },
                  },
                }}
                error={hasError("dateOfJoining")}
                helperText={getErrorMessage("dateOfJoining")}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Designation"
                name="employmentDetails.designation"
                placeholder="Enter Designation"
                register={register}
                validation={{
                  required: "Designation is required",
                  pattern: {
                    value: /^[a-zA-Z\s.]+$/,
                    message: "Invalid characters in Designation",
                  },
                }}
                error={hasError("designation")}
                helperText={getErrorMessage("designation")}
              />
            </Box>
          </Box>

          {/* Row 2 - Assigned Duty Area and Area Manager */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "352px" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: hasError("assignedDutyArea") ? "error.main" : "#707070",
                }}
              >
                Assigned Duty Area <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={assignedDutyArea}
                {...register("employmentDetails.assignedDutyArea", {
                  required: "Assigned Duty Area is required",
                })}
                error={hasError("assignedDutyArea")}
                helperText={getErrorMessage("assignedDutyArea")}
                onChange={(e) => setValue && setValue("employmentDetails.assignedDutyArea", e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Mukta",
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    fontFamily: "Mukta",
                  },
                }}
              >
                <MenuItem value="">Select Duty Area</MenuItem>
                {areaOptions.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: "352px" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: hasError("areaManager") ? "error.main" : "#707070",
                }}
              >
                Area Manager <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={areaManager}
                {...register("employmentDetails.areaManager", {
                  required: "Area Manager is required",
                })}
                error={hasError("areaManager")}
                helperText={getErrorMessage("areaManager")}
                onChange={(e) => setValue && setValue("employmentDetails.areaManager", e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "Mukta",
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    fontFamily: "Mukta",
                  },
                }}
              >
                <MenuItem value="">Select Area Manager</MenuItem>
                {areaManagerOptions.map((manager) => (
                  <MenuItem key={manager} value={manager}>
                    {manager}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Section 2 - Referral Information (Optional) */}
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "20px",
            color: "#707070",
            textTransform: "capitalize",
            mb: 1,
          }}
        >
          REFERRAL INFORMATION (Optional)
        </Typography>
        <Divider />

        <Box sx={{ mt: 2 }}>
          {/* Row for Referred By, Contact Number, and Relationship - All Optional */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Referred By"
                name="employmentDetails.referredBy"
                placeholder="Enter Referrer's Full Name (Optional)"
                register={register}
                validation={{
                  pattern: {
                    value: /^[a-zA-Z\s.]*$/,
                    message: "Invalid characters in Referrer's Name",
                  },
                }}
                error={hasError("referredBy")}
                helperText={getErrorMessage("referredBy")}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Referral Contact Number"
                name="employmentDetails.referralContactNumber"
                placeholder="Enter 10-digit Contact Number (Optional)"
                register={register}
                validation={{
                  validate: {
                    exactTenDigits: (value: string) => {
                      if (!value) return true; // Optional field

                      if (!/^\d{10}$/.test(value)) {
                        return "Please enter exactly 10 digits";
                      }

                      // Check if first digit is valid (6-9)
                      if (!/^[6-9]/.test(value)) {
                        return "Mobile number must start with 6, 7, 8, or 9";
                      }

                      return true;
                    },
                  },
                }}
                error={hasError("referralContactNumber")}
                helperText={
                  getErrorMessage("referralContactNumber") || "Optional. Enter 10 digits only (6-9 first digit)"
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePhoneChange("employmentDetails.referralContactNumber", e.target.value);
                }}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Relationship With Officer"
                name="employmentDetails.relationshipWithOfficer"
                placeholder="Enter Relationship (Optional)"
                register={register}
                validation={{
                  pattern: {
                    value: /^[a-zA-Z\s-]*$/,
                    message: "Invalid characters or format",
                  },
                }}
                error={hasError("relationshipWithOfficer")}
                helperText={getErrorMessage("relationshipWithOfficer")}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Optional: Add a form-level error message area */}
      {errors?.employmentDetails?.root && (
        <Box
          sx={{
            backgroundColor: "#FFEBEE",
            color: "#D32F2F",
            p: 2,
            borderRadius: 1,
            mt: 2,
            fontFamily: "Mukta",
          }}
        >
          {errors.employmentDetails.root.message}
        </Box>
      )}
    </Box>
  );
};

export default OfficerEmploymentDetailsForm;
