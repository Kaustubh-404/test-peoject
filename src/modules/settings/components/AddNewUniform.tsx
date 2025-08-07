import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// Import form components
import AccessoriesForm from "../components/AddNewUniform-subComponents/AccessoriesForm";
import BasicDetailsForm from "../components/AddNewUniform-subComponents/BasicDetailsForm";
import UniformBottomForm from "../components/AddNewUniform-subComponents/UniformBottomForm";
import UniformTopForm from "../components/AddNewUniform-subComponents/UniformTopForm";
import UniformProgressStepper from "../components/UniformProgressStepper";

// Steps configuration - matches your Figma specifications
const steps = [
  { id: 1, label: "Basic Details Form" },
  { id: 2, label: "Uniform-Top" },
  { id: 3, label: "Uniform-Bottom" },
  { id: 4, label: "Accessories" },
];

// Interface for Uniform form data
interface UniformDetails {
  basicDetails: {
    uniformName: string;
    uniformTop: boolean;
    uniformBottom: boolean;
    accessories: boolean;
  };
  uniformTop: {
    // Add uniform top fields as needed
    placeholder?: string;
  };
  uniformBottom: {
    // Add uniform bottom fields as needed
    placeholder?: string;
  };
  accessories: {
    // Add accessories fields as needed
    placeholder?: string;
  };
}

const AddNewUniform: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saveProgressOpen, setSaveProgressOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<UniformDetails>({
    mode: "onChange",
    defaultValues: {
      basicDetails: {
        uniformName: "",
        uniformTop: false,
        uniformBottom: false,
        accessories: false,
      },
      uniformTop: {
        placeholder: "",
      },
      uniformBottom: {
        placeholder: "",
      },
      accessories: {
        placeholder: "",
      },
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["basicDetails.uniformName"];
        break;
      case 2:
        // Add validation for uniform top fields as needed
        break;
      case 3:
        // Add validation for uniform bottom fields as needed
        break;
      case 4:
        // Add validation for accessories fields as needed
        break;
    }

    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      setSaveProgressOpen(true);
    }
  };

  const handleSaveProgressConfirm = () => {
    setSaveProgressOpen(false);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: UniformDetails) => {
    console.log("Uniform form submitted:", data);
    alert("Uniform created successfully!");
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      navigate("/settings");
    }
  };

  const handleSaveDraft = () => {
    handleSubmit((data: any) => {
      console.log("Saving uniform draft:", data);
      alert("Draft saved successfully!");
    })();
  };

  const handleCancelSaveProgress = () => {
    setSaveProgressOpen(false);
  };

  // Styles for submit button when disabled
  const disabledSubmitBtnStyle = {
    width: "149px",
    height: "33px",
    padding: "8px 16px",
    borderRadius: "8px",
    backgroundColor: "#F0F0F0",
    boxShadow: "0px 1px 4px 0px #70707033",
    color: "#A3A3A3",
    fontFamily: "Mukta",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    textTransform: "uppercase",
    cursor: "not-allowed",
  };

  return (
    <div className="h-full">
      {/* Header - Fixed outer part that doesn't change */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center text-xl gap-2 font-semibold mb-2">
          <ArrowBackIcon className="cursor-pointer" onClick={() => navigate("/uniforms")} />
          <h2 className="">Add New Uniform</h2>
        </div>

        {currentStep < 5 && (
          <div className="flex flex-row gap-4">
            <Button
              variant="contained"
              onClick={handleDiscard}
              sx={{
                display: "flex",
                width: "105px",
                height: "32px",
                borderRadius: "8px",
                padding: "8px 16px",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
                gap: "4px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              <DeleteOutlineOutlinedIcon
                fontSize="small"
                sx={{
                  width: "16px",
                  height: "16px",
                  color: "#2A77D5",
                }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Mukta",
                  color: "#2A77D5",
                  textTransform: "uppercase",
                }}
              >
                DISCARD
              </Typography>
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveDraft}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                width: "125px",
                height: "32px",
                borderRadius: "8px",
                padding: "8px 16px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
            >
              <DraftsOutlinedIcon
                fontSize="small"
                sx={{
                  width: "16px",
                  height: "16px",
                  color: "#2A77D5",
                }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Mukta",
                  color: "#2A77D5",
                  textTransform: "uppercase",
                }}
              >
                SAVE DRAFT
              </Typography>
            </Button>
            <Button
              variant="contained"
              onClick={currentStep === 4 ? handleSubmit(onSubmit) : undefined}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                width: "149px",
                height: "33px",
                borderRadius: "8px",
                padding: "8px 16px",
                backgroundColor: currentStep === 4 ? "#FFFFFF" : "#F0F0F0",
                boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
                "&:hover": {
                  backgroundColor: currentStep === 4 ? "#F5F5F5" : "#F0F0F0",
                },
                ...(currentStep < 4 && disabledSubmitBtnStyle),
              }}
              disabled={currentStep < 4}
            >
              <CheckOutlinedIcon
                fontSize="small"
                sx={{
                  color: currentStep === 4 ? "#2A77D5" : "#A3A3A3",
                }}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontFamily: "Mukta",
                  color: currentStep === 4 ? "#2A77D5" : "#A3A3A3",
                  textTransform: "uppercase",
                }}
              >
                SUBMIT FORM
              </Typography>
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area - Changes based on current step */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: "10px",
          backgroundColor: "#F1F7FE",
          width: "1240px",
          height: "792px",
          gap: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Progress Stepper - Uniform specific */}
        <UniformProgressStepper currentStep={currentStep} steps={steps} />

        {/* Dynamic Form Content - This changes */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1 }}>
          {currentStep === 1 && (
            <BasicDetailsForm register={register} errors={errors as any} watch={watch} setValue={setValue} />
          )}
          {currentStep === 2 && (
            <UniformTopForm register={register} errors={errors as any} watch={watch} setValue={setValue} />
          )}
          {currentStep === 3 && (
            <UniformBottomForm register={register} errors={errors as any} watch={watch} setValue={setValue} />
          )}
          {currentStep === 4 && (
            <AccessoriesForm register={register} errors={errors as any} watch={watch} setValue={setValue} />
          )}

          {/* Navigation Buttons - Fixed */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 3,
              mt: 2,
              px: 2,
            }}
          >
            {currentStep > 1 && (
              <Button
                variant="contained"
                onClick={prevStep}
                sx={{
                  width: "101px",
                  height: "36px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <ChevronLeftIcon sx={{ color: "#2A77D5", width: "16px", height: "16px" }} />
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      fontFamily: "Mukta",
                      color: "#2A77D5",
                      fontWeight: "500",
                      textTransform: "uppercase",
                    }}
                  >
                    Previous
                  </Typography>
                </Box>
              </Button>
            )}
            {currentStep < 4 && (
              <Button
                variant="contained"
                onClick={nextStep}
                endIcon={<ChevronRightIcon sx={{ color: "#2A77D5", width: "20px", height: "20px" }} />}
                sx={{
                  width: "101px",
                  height: "36px",
                  padding: "8px 16px 8px 20px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 1px 4px 0px rgba(112, 112, 112, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontFamily: "Mukta",
                    color: "#2A77D5",
                    fontWeight: "500",
                    textTransform: "uppercase",
                  }}
                >
                  Next
                </Typography>
              </Button>
            )}
            {currentStep === 4 && (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  borderRadius: "8px",
                  fontFamily: "Mukta",
                  textTransform: "uppercase",
                  backgroundColor: "#FFFFFF",
                  color: "#2A77D5",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Submit
              </Button>
            )}
          </Box>
        </form>
      </Box>

      {/* Save Progress Dialog */}
      <Dialog open={saveProgressOpen} onClose={handleCancelSaveProgress} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#707070" }}>
              Your progress has been saved.
            </Typography>
            <Typography sx={{ mb: 3, color: "#707070" }}>Do you want to continue to the next step?</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveProgressConfirm}
                sx={{
                  backgroundColor: "#2A77D5",
                  "&:hover": {
                    backgroundColor: "#1E5AA3",
                  },
                }}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelSaveProgress}
                sx={{
                  color: "#2A77D5",
                  borderColor: "#2A77D5",
                  "&:hover": {
                    borderColor: "#1E5AA3",
                    backgroundColor: "rgba(42, 119, 213, 0.04)",
                  },
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewUniform;
