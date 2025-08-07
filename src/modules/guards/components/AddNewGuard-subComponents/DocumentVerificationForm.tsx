import { Box, Checkbox, Divider, FormControlLabel, FormHelperText, Typography } from "@mui/material";
import React, { useState } from "react";
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

interface DocumentVerificationFormProps {
  register: UseFormRegister<any>;
  errors: any;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
}

interface DocumentType {
  type: string;
  label: string;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentType[] = [
  { type: "aadhaar", label: "Aadhaar Card", required: true },
  { type: "birth", label: "Birth Certificate", required: true },
  { type: "education", label: "Education Certificate/Degree", required: true },
  { type: "pan", label: "PAN Card", required: true }, // Made PAN Card mandatory
  { type: "driving", label: "Driving License", required: false },
  { type: "passport", label: "Passport", required: false },
];

const DocumentVerificationForm: React.FC<DocumentVerificationFormProps> = ({ register, errors, setValue }) => {
  const [documents, setDocuments] = useState<
    Array<{
      type: string;
      isSelected: boolean;
    }>
  >(
    DOCUMENT_TYPES.map((docType) => ({
      type: docType.type,
      isSelected: false,
    }))
  );

  // Initialize form values
  React.useEffect(() => {
    if (setValue) {
      setValue("documentVerification.documents", documents);
    }
  }, [documents, setValue]);

  // Handle checkbox change - Allow proper toggling on/off
  const handleCheckboxChange = (docType: string, checked: boolean) => {
    const updatedDocuments = documents.map((doc) => (doc.type === docType ? { ...doc, isSelected: checked } : doc));

    setDocuments(updatedDocuments);

    if (setValue) {
      // Update the documents array
      setValue("documentVerification.documents", updatedDocuments);
      // Trigger validation for the required document check
      setValue("documentVerification.hasRequiredDocument", hasRequiredDocument());
    }
  };

  // Get document by type
  const getDocumentByType = (docType: string) => {
    return documents.find((doc) => doc.type === docType);
  };

  // Check if at least one required document is selected
  const hasRequiredDocument = () => {
    return documents.some((doc) => doc.isSelected && DOCUMENT_TYPES.find((dt) => dt.type === doc.type)?.required);
  };

  // Check if all mandatory documents are selected
  const hasMandatoryDocuments = () => {
    const mandatoryDocTypes = DOCUMENT_TYPES.filter((dt) => dt.required).map((dt) => dt.type);
    return mandatoryDocTypes.every((docType) => documents.find((doc) => doc.type === docType)?.isSelected);
  };

  // Custom checkbox style
  const customCheckboxStyle = {
    color: "#FFFFFF",
    padding: "0px",
    border: "1px solid #2A77D5",
    borderRadius: "2px",
    width: "16px",
    height: "16px",
    marginRight: "8px",
    "&.Mui-checked": {
      color: "#2A77D5",
      backgroundColor: "#FFFFFF",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
  };

  // Custom label style
  const customLabelStyle = {
    fontFamily: "Mukta",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "1.2",
    color: "#707070",
    marginLeft: "4px",
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
      {/* Document Verification Heading */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: "Mukta",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: "32px",
          color: "#2A77D5",
        }}
      >
        VERIFIED DOCUMENTS
      </Typography>

      {/* Section 1 - Document Selection */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#707070",
              mb: 1,
            }}
          >
            Which Of The Following Documents Have Been Verified During The Guard's Recruitment? (Select All That Apply)
          </Typography>
          <Divider />
        </Box>

        {/* Document Checkboxes - No file upload */}
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {DOCUMENT_TYPES.map((docType) => {
            const document = getDocumentByType(docType.type);

            return (
              <Box key={docType.type} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Checkbox and Label */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={document?.isSelected || false}
                      onChange={(e) => {
                        handleCheckboxChange(docType.type, e.target.checked);
                      }}
                      sx={customCheckboxStyle}
                    />
                  }
                  label={
                    <Typography sx={customLabelStyle}>
                      {docType.label}
                      {docType.required && <span style={{ color: "#FF0000" }}>*</span>}
                    </Typography>
                  }
                  sx={{ margin: 0, alignItems: "flex-start" }}
                />

                {/* Verification status indicator */}
                {document?.isSelected && (
                  <Box sx={{ ml: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#4CAF50",
                      }}
                    />
                    <Typography sx={{ fontSize: "11px", color: "#4CAF50", fontFamily: "Mukta" }}>
                      Marked as verified - {docType.label}
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Validation Error for missing mandatory documents */}
        {!hasMandatoryDocuments() && (
          <FormHelperText
            error
            sx={{
              fontFamily: "Mukta",
              fontSize: "12px",
              mt: 1,
              ml: 1,
            }}
          >
            Please select all mandatory documents (marked with *)
          </FormHelperText>
        )}

        {/* Validation Error for at least one document */}
        {!hasRequiredDocument() && (
          <FormHelperText
            error
            sx={{
              fontFamily: "Mukta",
              fontSize: "12px",
              mt: 1,
              ml: 1,
            }}
          >
            Please select at least one mandatory document (marked with *)
          </FormHelperText>
        )}
      </Box>

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        {...register("documentVerification.hasRequiredDocument", {
          validate: () => {
            if (!hasRequiredDocument()) {
              return "Please select at least one mandatory document (marked with *)";
            }
            if (!hasMandatoryDocuments()) {
              return "Please select all mandatory documents (marked with *)";
            }
            return true;
          },
        })}
      />

      {/* Form-level error message */}
      {errors?.documentVerification?.root?.message && (
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
          {errors.documentVerification.root.message}
        </Box>
      )}
    </Box>
  );
};

export default DocumentVerificationForm;
