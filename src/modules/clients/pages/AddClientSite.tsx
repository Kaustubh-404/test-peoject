import { ProgressStepper, type Step } from "@components/ProgressStepper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import { Avatar, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSite } from "../apis/hooks/useCreateClientSite";
import ClientSiteInfoForm from "../components/forms/add_client_site/ClientSiteInfoForm";
import GuardSelection from "../components/forms/add_client_site/GuardSelectionForm";
import SiteLocationForm from "../components/forms/add_client_site/SiteLocationForm";
import SitePostForm from "../components/forms/add_client_site/SitePostForm";
import { transformClientSiteToAPI, type ClientSite } from "../components/forms/add_client_site/types";
import { DraftModal } from "../components/modals/DraftModal";
import { useClientContext } from "../context/ClientContext";

const progressSteps: Step[] = [
  { id: 1, label: "SITE INFORMATION" },
  { id: 2, label: "SITE LOCATION" },
  { id: 3, label: "SITE POSTS" },
  { id: 4, label: "GUARD SELECTION" },
];

export default function AddClientSite() {
  const [currentStep, setCurrentStep] = useState(1);
  const [disabledSteps, setDisabledSteps] = useState<number[]>([]);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const { clientId } = useParams<{ clientId: string }>();
  const { clientDetails } = useClientContext();
  const navigate = useNavigate();

  const methods = useForm<ClientSite>({
    mode: "onChange",
    defaultValues: {
      id: "",
      areaOfficerId: "",
      name: "",
      type: "",
      contactPerson: {
        fullName: "",
        designation: "",
        phoneNumber: "",
        email: "",
      },
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        district: "",
        pincode: "",
        state: "",
        landmark: "",
      },
      geoLocation: {
        mapLink: "",
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
        plusCode: "",
      },
      geoFencing: {
        type: "Circular Geofence",
      },
      patroling: {
        patrol: false,
        patrolRouteDetails: [],
      },
      sitePosts: [
        {
          name: "",
          geoFenceType: "Circular Geofence",
          shifts: [
            {
              days: [],
              publicHolidayGuardRequired: false,
              dutyStartTime: "",
              dutyEndTime: "",
              checkInTime: "",
              latenessFrom: "",
              latenessTo: "",
              guardRequirements: [
                {
                  guardType: "",
                  count: 1,
                  uniformBy: "PSA",
                  uniformType: "",
                  tasks: true,
                  alertnessChallenge: false,
                  alertnessChallengeOccurrence: 0,
                  patrolEnabled: false,
                  selectPatrolRoutes: [],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const createSiteMutation = useCreateSite(() => {
    console.log("Site created successfully");
    localStorage.removeItem("clientSiteDraft");
    navigate(`/clients/${clientId}/sites`);
  });

  const { handleSubmit, trigger, reset } = methods;

  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem("clientSiteDraft");
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          setDraftData(parsedDraft);
          setDraftModalOpen(true);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        localStorage.removeItem("clientSiteDraft");
      }
    };

    loadDraft();
  }, [reset]);

  const handleContinueDraft = () => {
    try {
      if (draftData) {
        reset(draftData);
        setCurrentStep(draftData.currentStep || 1);
      }
      setDraftModalOpen(false);
      setDraftData(null);
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("clientSiteDraft");
    setDraftModalOpen(false);
    setDraftData(null);
  };

  const handleSaveDraft = async () => {
    try {
      const formData = methods.getValues();
      const draftData = {
        ...formData,
        currentStep,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("clientSiteDraft", JSON.stringify(draftData));
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  const validateStep = async (step: number) => {
    let fieldsToValidate: string[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "id",
        "name",
        "type",
        "contactPerson.fullName",
        "contactPerson.designation",
        "contactPerson.phoneNumber",
        "contactPerson.email",
        "areaOfficer",
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        "address.addressLine1",
        "address.city",
        "address.district",
        "address.pincode",
        "address.state",
        "geoFencing.type",
      ];
    } else if (step === 3) {
      fieldsToValidate = ["sitePosts"];
    }
    const isStepValid = await trigger(fieldsToValidate as any);
    return isStepValid;
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId === currentStep) return;
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      return;
    }
    const valid = await validateStep(currentStep);
    if (valid && stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    let nextStepId = currentStep + 1;
    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "id",
          "name",
          "type",
          "contactPerson.fullName",
          "contactPerson.designation",
          "contactPerson.phoneNumber",
          "contactPerson.email",
          "areaOfficer",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "address.addressLine1",
          "address.city",
          "address.district",
          "address.pincode",
          "address.state",
          "geoFencing.type",
        ];
        break;
      case 3:
        fieldsToValidate = ["sitePosts"];
        break;
      default:
        fieldsToValidate = [];
    }
    const isStepValid = await trigger(fieldsToValidate as any);
    const newDisabledSteps: number[] = [];
    if (!isStepValid) {
      newDisabledSteps.push(nextStepId);
    }
    setDisabledSteps(newDisabledSteps);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: ClientSite) => {
    console.log("Form submitted:", data);

    try {
      const transformedData = transformClientSiteToAPI(data, clientId!);
      console.log("Transformed data for API:", transformedData);

      createSiteMutation.mutate(transformedData);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      navigate("/clients");
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center text-xl gap-2 font-semibold mb-2">
          <ArrowBackIcon onClick={() => navigate(-1)} className="cursor-pointer" />

          <h2 className="">Add New Client Site</h2>
        </div>

        {currentStep < 5 && (
          <div className="flex flex-row gap-4">
            <Button variant="contained" color="error" onClick={handleDiscard}>
              <DeleteOutlineOutlinedIcon
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              />
              <Typography
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              >
                DISCARD
              </Typography>
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveDraft}>
              <DraftsOutlinedIcon
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              />
              <Typography
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              >
                SAVE DRAFT
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit(onSubmit)}
              disabled={createSiteMutation.isPending}
            >
              <CheckOutlinedIcon
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              />
              <Typography
                sx={{
                  typography: {
                    fontSize: "14px",
                  },
                }}
              >
                {createSiteMutation.isPending ? "SUBMITTING..." : "SUBMIT FORM"}
              </Typography>
            </Button>
          </div>
        )}
      </div>

      <div id="container" className="bg-[#F1F7FE] mt-2 rounded-xl p-4 flex flex-col">
        {/* Client Info Header */}
        <div className="bg-white flex flex-row px-4 py-2 w-fit rounded-xl gap-6 items-center mx-auto mb-4">
          <Avatar src={clientDetails?.clientLogo!} alt="Logo" className="h-10 w-10" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <span className="text-gray-500">Client ID</span>
            <span>{clientDetails?.id}</span>
            <span className="text-gray-500">Client</span>
            <span>{clientDetails?.clientName}</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper
          currentStep={currentStep}
          steps={progressSteps}
          onStepClick={handleStepClick}
          disabledSteps={disabledSteps}
        />

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            {currentStep === 1 && <ClientSiteInfoForm />}

            {currentStep === 2 && <SiteLocationForm />}

            {currentStep === 3 && <SitePostForm />}

            {currentStep === 4 && <GuardSelection />}

            {/* Navigation Buttons */}
            <div className="flex flex-row mt-4 w-full justify-end gap-4">
              {currentStep > 1 && (
                <Button variant="outlined" onClick={prevStep}>
                  Previous
                </Button>
              )}

              {currentStep < 4 && (
                <Button variant="contained" onClick={nextStep}>
                  <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
                  Next
                </Button>
              )}

              {currentStep === 4 && (
                <Button variant="contained" color="success" type="submit" disabled={createSiteMutation.isPending}>
                  {createSiteMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>

        {/* Error Display */}
        {createSiteMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Typography color="error" variant="body2">
              Error: {createSiteMutation.error?.message || "Something went wrong"}
            </Typography>
          </div>
        )}
      </div>

      {/* Draft Modal */}
      <DraftModal
        open={draftModalOpen}
        onClose={() => setDraftModalOpen(false)}
        onContinue={handleContinueDraft}
        onDiscard={handleDiscardDraft}
        savedAt={draftData?.savedAt || ""}
      />
    </div>
  );
}
