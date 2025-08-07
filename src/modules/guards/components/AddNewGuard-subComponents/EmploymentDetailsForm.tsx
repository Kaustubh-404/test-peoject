import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useSettings } from "../../../settings/context/SettingsContext";
import LabeledInput from "../LabeledInput";

// Define props interface for the component
interface EmploymentDetailsFormProps {
  register: any;
  errors: any;
  watch?: any;
  setValue?: any;
}

// Define the guard type interface to match SettingsContext
interface SecurityGuardType {
  id: string;
  name: string;
  isActive: boolean;
}

const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({ register, errors, watch, setValue }) => {
  const { user } = useAuth(); // Get the logged-in user
  const { operationalSettings } = useSettings(); // Get settings for guard types

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

  // Get values from watch for conditional validation
  const guardType = watch ? watch("employmentDetails.guardType") || "" : "";
  const psaraCertificationStatus = watch ? watch("employmentDetails.psaraCertificationStatus") || "" : "";
  // status field removed - now set to ACTIVE by default
  const licenseNumber = watch ? watch("employmentDetails.licenseNumber") : "";
  const dateOfIssue = watch ? watch("employmentDetails.dateOfIssue") : "";

  // Check if guard type requires license
  const requiresLicense = ["Armed Security Guard", "Personal Security Officer", "Bouncer", "Gun Man"].includes(
    guardType
  );

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

  // Fallback guard types if settings not loaded
  const fallbackGuardTypes: SecurityGuardType[] = [
    { id: "security", name: "Security Guard", isActive: true },
    { id: "lady", name: "Lady Guard", isActive: true },
    { id: "gunman", name: "Gun Man", isActive: true },
    { id: "supervisor", name: "Post Supervisor", isActive: true },
    { id: "head", name: "Head Guard", isActive: true },
    { id: "personal", name: "Personal Security Guard", isActive: true },
  ];

  // Get guard types from settings or use fallback
  const guardTypes = operationalSettings?.securityGuardTypes || fallbackGuardTypes;

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
          {/* Row for Company ID and Date of Joining */}
          <Box sx={{ display: "flex", gap: 2 }}>
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
                label="Relationship With Guard"
                name="employmentDetails.relationshipWithGuard"
                placeholder="Enter Relationship (Optional)"
                register={register}
                validation={{
                  pattern: {
                    value: /^[a-zA-Z\s-]*$/,
                    message: "Invalid characters or format",
                  },
                }}
                error={hasError("relationshipWithGuard")}
                helperText={getErrorMessage("relationshipWithGuard")}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Section 3 - Guard Type & PSARA Status */}
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
          GUARD TYPE
          <Box component="span" sx={{ color: "red", ml: "2px" }}>
            *
          </Box>
        </Typography>
        <Divider />

        <Box sx={{ mt: 2 }}>
          {/* Row 1 - Guard Type and PSARA Certification Status (Guard Status removed) */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ width: "352px" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: hasError("guardType") ? "error.main" : "#707070",
                }}
              >
                Guard Type <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={guardType}
                {...register("employmentDetails.guardType", {
                  required: "Guard Type is required",
                })}
                error={hasError("guardType")}
                helperText={getErrorMessage("guardType")}
                onChange={(e) => setValue && setValue("employmentDetails.guardType", e.target.value)}
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
                <MenuItem value="">Select Guard Type</MenuItem>
                {guardTypes.map((guardTypeOption: SecurityGuardType) => (
                  <MenuItem key={guardTypeOption.id} value={guardTypeOption.name}>
                    {guardTypeOption.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ width: "352px" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: hasError("psaraCertificationStatus") ? "error.main" : "#707070",
                }}
              >
                PSARA Certification Status <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={psaraCertificationStatus}
                {...register("employmentDetails.psaraCertificationStatus", {
                  required: "Certification Status is required",
                })}
                error={hasError("psaraCertificationStatus")}
                helperText={getErrorMessage("psaraCertificationStatus")}
                onChange={(e) => setValue && setValue("employmentDetails.psaraCertificationStatus", e.target.value)}
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
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            </Box>
          </Box>

          {/* Ex-Defense Checkbox */}
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("employmentDetails.isExDefense")}
                  sx={{ color: "#2A77D5", "&.Mui-checked": { color: "#2A77D5" } }}
                />
              }
              label="Tick if the guard is Ex-Defense (Army/Navy/Air-Force etc.)"
              sx={{
                margin: 0,
                ".MuiFormControlLabel-label": {
                  fontFamily: "Mukta",
                  fontSize: "12px",
                  color: "#707070",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Section 4 - License Information */}
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
          LICENSE INFORMATION {requiresLicense ? "*" : "(If Applicable)"}
        </Typography>
        <Divider />

        <Box sx={{ mt: 2 }}>
          {/* License Number */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="License Number"
                name="employmentDetails.licenseNumber"
                placeholder="Enter License Number"
                register={register}
                validation={{
                  required: requiresLicense ? "License Number is required for selected Guard Type" : false,
                  pattern: {
                    value: /^[A-Z0-9-/]+$/i,
                    message: "Invalid license number format",
                  },
                }}
                error={hasError("licenseNumber")}
                helperText={getErrorMessage("licenseNumber")}
              />
            </Box>
          </Box>

          {/* Row for License Details */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Date Of Issue"
                name="employmentDetails.dateOfIssue"
                placeholder="DD/MM/YYYY"
                type="date"
                register={register}
                validation={{
                  required: licenseNumber ? "Date of Issue is required" : false,
                  validate: {
                    notInFuture: (value: string) => {
                      if (!value) return true;
                      return new Date(value) <= new Date() || "Issue Date cannot be in the future";
                    },
                  },
                }}
                error={hasError("dateOfIssue")}
                helperText={getErrorMessage("dateOfIssue")}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Valid Until"
                name="employmentDetails.validUntil"
                placeholder="DD/MM/YYYY"
                type="date"
                register={register}
                validation={{
                  required: licenseNumber ? "Validity Date is required" : false,
                  validate: {
                    afterIssueDate: (value: string) => {
                      if (!value || !dateOfIssue) return true;
                      return new Date(value) > new Date(dateOfIssue) || "Validity must be after Date of Issue";
                    },
                  },
                }}
                error={hasError("validUntil")}
                helperText={getErrorMessage("validUntil")}
              />
            </Box>
            <Box sx={{ width: "352px" }}>
              <LabeledInput
                label="Valid In (State/Region)"
                name="employmentDetails.validIn"
                placeholder="Enter State/Region"
                register={register}
                validation={{
                  required: licenseNumber ? "State or Region is required" : false,
                }}
                error={hasError("validIn")}
                helperText={getErrorMessage("validIn")}
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

export default EmploymentDetailsForm;
