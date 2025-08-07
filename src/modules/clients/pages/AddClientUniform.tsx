import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateClientUniform } from "../apis/hooks/useCreateClientUniform";
import ClientUniformDetails from "../components/forms/add_client_uniform/ClientUniformDetails";

interface ClientUniformForm {
  uniformName: string;
  top: boolean;
  bottom: boolean;
  accessories: boolean;
  topPhotos: (File | string)[];
  bottomPhotos: (File | string)[];
  accessoriesPhotos: (File | string)[];
}

export default function AddClientUniform() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const methods = useForm<ClientUniformForm>({
    mode: "onChange",
    defaultValues: {
      uniformName: "",
      top: false,
      bottom: false,
      accessories: false,
      topPhotos: [],
      bottomPhotos: [],
      accessoriesPhotos: [],
    },
  });

  const createUniformMutation = useCreateClientUniform((data) => {
    console.log("Uniform created successfully:", data);
    setIsSubmitted(true);
  });

  const {
    handleSubmit,
    formState: {},
    getValues,
    watch,
  } = methods;

  const uniformName = watch("uniformName");
  const top = watch("top");
  const bottom = watch("bottom");
  const accessories = watch("accessories");
  const topPhotos = watch("topPhotos") || [];
  const bottomPhotos = watch("bottomPhotos") || [];
  const accessoriesPhotos = watch("accessoriesPhotos") || [];

  const isUniformPartSelected = top || bottom || accessories;

  const arePhotosUploaded =
    (!top || (top && topPhotos.length > 0 && topPhotos.some((photo: any) => photo))) &&
    (!bottom || (bottom && bottomPhotos.length > 0 && bottomPhotos.some((photo: any) => photo))) &&
    (!accessories || (accessories && accessoriesPhotos.length > 0 && accessoriesPhotos.some((photo: any) => photo)));

  const isFormValid = Boolean(uniformName) && isUniformPartSelected && arePhotosUploaded;

  const onSubmit = async (data: ClientUniformForm) => {
    if (!clientId) {
      console.error("Client ID is missing");
      alert("Client ID is required");
      return;
    }

    console.log("Form submitted:", data);

    try {
      const topPartImages = data.topPhotos.filter((photo: any): photo is File => photo instanceof File);
      const bottomPartImages = data.bottomPhotos.filter((photo: any): photo is File => photo instanceof File);
      const accessoryImages = data.accessoriesPhotos.filter((photo: any): photo is File => photo instanceof File);

      const apiData = {
        clientId,
        uniformName: data.uniformName,
        topPartImages: data.top ? topPartImages : undefined,
        bottomPartImages: data.bottom ? bottomPartImages : undefined,
        accessoryImages: data.accessories ? accessoryImages : undefined,
      };

      console.log("API request data:", apiData);

      await createUniformMutation.mutateAsync(apiData);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      window.location.href = "/clients";
    }
  };

  const handleSaveDraft = () => {
    const data = getValues();
    console.log("Saving draft:", data);
    alert("Draft saved successfully!");
  };

  return (
    <div className="h-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center text-xl gap-2 font-semibold mb-2">
          <ArrowBackIcon onClick={() => navigate(-1)} className="cursor-pointer" />

          <h2 className="">Add New Client Uniforms</h2>
        </div>

        {!isSubmitted && (
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
            <Button variant="contained" color="success" onClick={handleSubmit(onSubmit)} disabled={!isFormValid}>
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
                SUBMIT UNIFORM
              </Typography>
            </Button>
          </div>
        )}
      </div>

      <div id="container" className="bg-[#F1F7FE] mt-2 rounded-xl p-4 flex flex-col h-[calc(100%-55px)]">
        <FormProvider {...methods}>
          {!isSubmitted ? (
            <ClientUniformDetails />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-8">
              <div className="flex flex-col items-center text-center max-w-lg">
                <CheckOutlinedIcon sx={{ fontSize: 64, color: "green", mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  Uniform Submitted Successfully!
                </Typography>
                <Typography variant="body1">
                  The uniform has been submitted successfully. The details will be processed by our team.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => (window.location.href = "/clients")}
                  sx={{ mt: 2 }}
                >
                  Back to Clients
                </Button>
              </div>
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  );
}
