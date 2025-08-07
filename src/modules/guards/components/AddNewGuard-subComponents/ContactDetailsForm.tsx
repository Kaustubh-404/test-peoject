import { Box, Divider, FormControl, FormHelperText, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import LabeledInput from "../LabeledInput";

// Define nested error types for better TypeScript support
interface ContactDetailsErrors {
  mobileNumber?: { message?: string };
  alternateNumber?: { message?: string };
  emergencyContact?: {
    firstName?: { message?: string };
    middleName?: { message?: string };
    lastName?: { message?: string };
    relationship?: { message?: string };
    contactNumber?: { message?: string };
  };
}

interface FormErrors {
  contactDetails?: ContactDetailsErrors;
}

interface ContactDetailsFormProps {
  register: UseFormRegister<any>;
  errors: FormErrors;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ register, errors, watch, setValue }) => {
  // Get the current value for the relationship select - with better fallback handling
  const relationshipValue = watch ? (watch("contactDetails.emergencyContact.relationship") ?? "") : "";

  // Handle relationship change
  const handleRelationshipChange = (value: string) => {
    if (setValue) {
      setValue("contactDetails.emergencyContact.relationship", value);
    }
  };

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

  // Enhanced phone number validation for 10 digits (backend adds +91 automatically)
  const phoneValidation = {
    required: "Mobile number is required",
    validate: {
      exactTenDigits: (value: string) => {
        if (!value) return "Mobile number is required";

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
  };

  // Alternate number validation (optional but if provided, must be 10 digits)
  const alternatePhoneValidation = {
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
      differentFromPrimary: (value: string, formValues: { contactDetails: { mobileNumber: string } }) => {
        if (!value) return true; // Optional field
        if (value === formValues.contactDetails?.mobileNumber) {
          return "Alternate number cannot be the same as the primary number";
        }
        return true;
      },
    },
  };

  // Emergency contact validation (required and must be 10 digits)
  const emergencyContactValidation = {
    required: "Emergency contact number is required",
    validate: {
      exactTenDigits: (value: string) => {
        if (!value) return "Emergency contact number is required";

        if (!/^\d{10}$/.test(value)) {
          return "Please enter exactly 10 digits";
        }

        // Check if first digit is valid (6-9)
        if (!/^[6-9]/.test(value)) {
          return "Mobile number must start with 6, 7, 8, or 9";
        }

        return true;
      },
      differentFromPrimary: (value: string, formValues: { contactDetails: { mobileNumber: string } }) => {
        if (!value) return "Emergency contact number is required";
        if (value === formValues.contactDetails?.mobileNumber) {
          return "Emergency contact number cannot be the same as the primary number";
        }
        return true;
      },
    },
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
        gap: "16px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* Contact Details Heading */}
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
        CONTACT DETAILS
      </Typography>

      {/* Section 1 - Contact Number */}
      <Box sx={{ mt: 1 }}>
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
          CONTACT NUMBER
        </Typography>
        <Divider />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Mobile Number"
              name="contactDetails.mobileNumber"
              placeholder="Enter 10-digit Mobile Number"
              required
              register={register}
              validation={phoneValidation}
              error={!!errors?.contactDetails?.mobileNumber}
              helperText={errors?.contactDetails?.mobileNumber?.message || "Enter 10 digits only (6-9 first digit)"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handlePhoneChange("contactDetails.mobileNumber", e.target.value);
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Alternate Phone Number"
              name="contactDetails.alternateNumber"
              placeholder="Enter 10-digit Alternate Number"
              register={register}
              validation={alternatePhoneValidation}
              error={!!errors?.contactDetails?.alternateNumber}
              helperText={errors?.contactDetails?.alternateNumber?.message || "Optional. Enter 10 digits only"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handlePhoneChange("contactDetails.alternateNumber", e.target.value);
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Section 2 - Emergency Contact Person Details */}
      <Box sx={{ mt: 2 }}>
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
          EMERGENCY CONTACT PERSON DETAILS
        </Typography>
        <Divider />

        {/* Name Fields */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="First Name"
              name="contactDetails.emergencyContact.firstName"
              placeholder="Enter First Name"
              required
              register={register}
              validation={{
                required: "First name is required",
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "First name should contain only letters and spaces",
                },
              }}
              error={!!errors?.contactDetails?.emergencyContact?.firstName}
              helperText={errors?.contactDetails?.emergencyContact?.firstName?.message}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Middle Name"
              name="contactDetails.emergencyContact.middleName"
              placeholder="Enter Middle Name (if applicable)"
              register={register}
              validation={{
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: "Middle name should contain only letters and spaces",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Last Name"
              name="contactDetails.emergencyContact.lastName"
              placeholder="Enter Last Name"
              required
              register={register}
              validation={{
                required: "Last name is required",
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Last name should contain only letters and spaces",
                },
              }}
              error={!!errors?.contactDetails?.emergencyContact?.lastName}
              helperText={errors?.contactDetails?.emergencyContact?.lastName?.message}
            />
          </Box>
        </Box>

        {/* Relationship and Contact Number */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {/* Relationship Dropdown */}
          <Box sx={{ flex: 0.75 }}>
            <FormControl fullWidth size="small" error={!!errors?.contactDetails?.emergencyContact?.relationship}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: errors?.contactDetails?.emergencyContact?.relationship ? "error.main" : "#707070",
                }}
              >
                Relationship <span style={{ color: "red" }}>*</span>
              </Typography>
              <Select
                value={relationshipValue}
                displayEmpty
                sx={{ borderRadius: "4px" }}
                onChange={(e) => {
                  const value = e.target.value as string;
                  handleRelationshipChange(value);
                }}
                inputProps={{
                  ...register("contactDetails.emergencyContact.relationship", {
                    required: "Please select a relationship",
                  }),
                }}
              >
                <MenuItem value="" disabled>
                  Select Relationship
                </MenuItem>
                <MenuItem value="Father">Father</MenuItem>
                <MenuItem value="Mother">Mother</MenuItem>
                <MenuItem value="Brother">Brother</MenuItem>
                <MenuItem value="Sister">Sister</MenuItem>
                <MenuItem value="Brother-in-Law">Brother-in-Law</MenuItem>
                <MenuItem value="Sister-in-Law">Sister-in-Law</MenuItem>
                <MenuItem value="Son">Son</MenuItem>
                <MenuItem value="Daughter">Daughter</MenuItem>
                <MenuItem value="Spouse">Spouse</MenuItem>
                <MenuItem value="Relative">Relative</MenuItem>
                <MenuItem value="Neighbour">Neighbour</MenuItem>
                <MenuItem value="Friend">Friend</MenuItem>
                <MenuItem value="Colleague">Colleague</MenuItem>
              </Select>
              {errors?.contactDetails?.emergencyContact?.relationship && (
                <FormHelperText>{errors?.contactDetails?.emergencyContact?.relationship?.message}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Emergency Contact Number */}
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Contact Number"
              name="contactDetails.emergencyContact.contactNumber"
              placeholder="Enter 10-digit Emergency Contact"
              required
              register={register}
              validation={emergencyContactValidation}
              error={!!errors?.contactDetails?.emergencyContact?.contactNumber}
              helperText={
                errors?.contactDetails?.emergencyContact?.contactNumber?.message ||
                "Enter 10 digits only (6-9 first digit)"
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handlePhoneChange("contactDetails.emergencyContact.contactNumber", e.target.value);
              }}
            />
          </Box>

          {/* Empty box to maintain grid alignment */}
          <Box sx={{ flex: 1 }}></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactDetailsForm;
