import { CustomSwitch } from "@components/CustomSwitch";
import FileUpload from "@components/FileUpload";
import LabeledDropdown from "@components/LabeledDropdown";
import LabeledInput from "@components/LabeledInput";
import { Add, Check } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { ClientSite } from "../forms/add_client_site/types";

interface PatrolModalProps {
  open: boolean;
  onClose: () => void;
}

interface CheckpointFile {
  qrFile: File | null;
  photoFile: File | null;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  width: "90vw",
  maxHeight: "95vh",
  overflow: "auto",
};

// Dummy data for initial routes
const dummyRoutes = [
  {
    name: "Backgate Patrol",
    routeCode: "BP001",
    patrolFrequency: {
      type: "time" as const,
      hours: 2,
      minutes: 30,
      numberOfPatrols: 8,
    },
    patrolCheckpoints: [
      {
        type: "qr code" as const,
        qrCode: "QR001",
        photo: "photo1.jpg",
      },
      {
        type: "photo" as const,
        qrCode: "",
        photo: "photo2.jpg",
      },
      {
        type: "qr code" as const,
        qrCode: "QR003",
        photo: "photo3.jpg",
      },
    ],
  },
  {
    name: "Gowdown Patrol",
    routeCode: "GP002",
    patrolFrequency: {
      type: "count" as const,
      hours: 1,
      minutes: 0,
      numberOfPatrols: 4,
    },
    patrolCheckpoints: [
      {
        type: "qr code" as const,
        qrCode: "QR004",
        photo: "photo4.jpg",
      },
      {
        type: "qr code" as const,
        qrCode: "QR005",
        photo: "photo5.jpg",
      },
    ],
  },
  {
    name: "Main Entrance Patrol",
    routeCode: "MEP003",
    patrolFrequency: {
      type: "time" as const,
      hours: 1,
      minutes: 30,
      numberOfPatrols: 6,
    },
    patrolCheckpoints: [
      {
        type: "photo" as const,
        qrCode: "",
        photo: "photo6.jpg",
      },
    ],
  },
];

// Mock GPS coordinates
const mockGPSCoordinates = [
  "41.40338, 2.17403",
  "41.40338, 2.12303",
  "41.40338, 2.17403",
  "40.7128, -74.0060",
  "34.0522, -118.2437",
  "51.5074, -0.1278",
];

export const PatrolModal: React.FC<PatrolModalProps> = ({ open, onClose }) => {
  const [patrolFrequency, setPatrolFrequency] = useState<boolean>(false);
  const [checkpointFiles, setCheckpointFiles] = useState<CheckpointFile[]>([{ qrFile: null, photoFile: null }]);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const [savePatrolRoute, setSavePatrolRoute] = useState<boolean>(false);

  console.log("Checkpoint Files:", checkpointFiles);
  console.log(savePatrolRoute);
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ClientSite>({
    defaultValues: {
      patroling: {
        patrolRouteDetails: dummyRoutes,
      },
    },
  });

  const {
    fields: routeFields,
    append: appendRoute,
    // remove: removeRoute,
  } = useFieldArray({
    control,
    name: "patroling.patrolRouteDetails",
  });

  const {
    fields: checkpointFields,
    append: appendCheckpoint,
    remove: removeCheckpoint,
  } = useFieldArray({
    control,
    name: `patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints`,
  });

  // Initialize with dummy data
  useEffect(() => {
    if (routeFields.length === 0) {
      reset({
        patroling: {
          patrolRouteDetails: dummyRoutes,
        },
      });
    }
  }, [reset, routeFields.length]);

  // Update patrol frequency based on current route
  useEffect(() => {
    if (routeFields.length > 0) {
      const currentRoute = watch(`patroling.patrolRouteDetails.${activeRouteIndex}`);
      if (currentRoute?.patrolFrequency?.type) {
        setPatrolFrequency(currentRoute.patrolFrequency.type === "count");
      }
    }
  }, [activeRouteIndex, watch, routeFields.length]);

  const handleQrUpload = (file: File | null, index: number) => {
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qrFile: file };
      return updated;
    });
  };

  const handlePhotoUpload = (file: File | null, index: number) => {
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], photoFile: file };
      return updated;
    });
  };

  const handleCheckpointTypeChange = (checked: boolean, index: number) => {
    setValue(
      `patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}.type`,
      checked ? "photo" : "qr code"
    );
  };

  const addCheckpoint = () => {
    appendCheckpoint({
      type: "qr code",
      qrCode: `QR${Date.now()}`,
      photo: `photo${Date.now()}.jpg`,
    });
    setCheckpointFiles((prev) => [...prev, { qrFile: null, photoFile: null }]);
  };

  const removeCheckpointHandler = (index: number) => {
    if (checkpointFields.length > 1) {
      removeCheckpoint(index);
      setCheckpointFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addNewPatrolRoute = () => {
    const newRouteIndex = routeFields.length;
    appendRoute({
      name: `New Route ${newRouteIndex + 1}`,
      routeCode: `NR${String(newRouteIndex + 1).padStart(3, "0")}`,
      patrolFrequency: {
        type: "time",
        hours: 1,
        minutes: 0,
        numberOfPatrols: 1,
      },
      patrolCheckpoints: [
        {
          type: "qr code",
          qrCode: `QR${Date.now()}`,
          photo: `photo${Date.now()}.jpg`,
        },
      ],
    });
    setActiveRouteIndex(newRouteIndex);
    setCheckpointFiles([{ qrFile: null, photoFile: null }]);
    setPatrolFrequency(false);
  };

  const switchToRoute = (index: number) => {
    setActiveRouteIndex(index);
    const currentRoute = routeFields[index];
    if (currentRoute) {
      const checkpointCount = watch(`patroling.patrolRouteDetails.${index}.patrolCheckpoints`)?.length || 1;
      setCheckpointFiles(Array(checkpointCount).fill({ qrFile: null, photoFile: null }));
    }
    const frequencyType = watch(`patroling.patrolRouteDetails.${index}.patrolFrequency.type`);
    setPatrolFrequency(frequencyType === "count");
  };

  // const getGPSCoordinatesFromPhoto = (file: File): Promise<string> => {
  //   return new Promise((resolve) => {
  //     const randomCoord = mockGPSCoordinates[Math.floor(Math.random() * mockGPSCoordinates.length)];
  //     resolve(randomCoord);
  //   });
  // };

  const handlePatrolRouteSave = () => {
    onClose();
  };

  const handleAddAnotherPatrolRoute = () => {
    setSavePatrolRoute(false);
    addNewPatrolRoute();
  };

  const renderCheckpoint = (field: any, index: number) => {
    const checkpointType =
      watch(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}.type`) || "qr code";
    const isPhotoType = checkpointType === "photo";

    // Get GPS coordinate for this checkpoint
    const gpsCoordinate = mockGPSCoordinates[index % mockGPSCoordinates.length];

    return (
      <div key={field.id} className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#707070] font-semibold text-sm">CHECKPOINT {index + 1}</span>
          {checkpointFields.length > 1 && (
            <IconButton
              onClick={() => removeCheckpointHandler(index)}
              size="small"
              className="text-red-500 hover:bg-red-50"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        <div className="flex flex-row gap-4 min-h-36">
          <div>
            <Typography
              sx={{
                typography: {
                  fontSize: "12px",
                },
                mb: 0.5,
                color: "#707070",
              }}
            >
              Check Type
            </Typography>
            <CustomSwitch
              checked={isPhotoType}
              onChange={(checked: boolean) => handleCheckpointTypeChange(checked, index)}
              labelOff="QR Code"
              labelOn="Photo"
            />
          </div>

          {/* Show dummy QR code image */}
          {!isPhotoType && (
            <div>
              <span className="text-sm mb-1 text-[#707070]">QR Code</span>
              <div className="h-24 w-24 border rounded bg-gray-100 flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/96x96/000000/FFFFFF?text=QR"
                  className="h-20 w-20 object-cover rounded"
                  alt={`QR Code ${index + 1}`}
                />
              </div>
            </div>
          )}

          {/* Show dummy photo if photo type */}
          {isPhotoType && (
            <div>
              <span className="text-sm mb-1 text-[#707070]">Photo</span>
              <div className="h-24 w-24 border rounded bg-gray-100 flex items-center justify-center">
                <img
                  src={`https://via.placeholder.com/96x96/4A90E2/FFFFFF?text=Photo+${index + 1}`}
                  className="h-20 w-20 object-cover rounded"
                  alt={`Photo ${index + 1}`}
                />
              </div>
            </div>
          )}

          <div className="w-[10vw] h-20">
            <FileUpload
              label={isPhotoType ? "Photo Of Checkpoint" : "Photo Of QR Location"}
              maxSize={2}
              acceptedFileTypes="image/*"
              onFileChange={(file) => (isPhotoType ? handlePhotoUpload(file, index) : handleQrUpload(file, index))}
              placeholder={isPhotoType ? "Click to upload Photo" : "Click to upload QR Photo"}
            />
          </div>

          <div className="flex flex-row mt-auto">
            <div className="flex flex-col">
              <span className="text-sm mb-[0.5px] text-[#707070]">
                GPS Coordinate From {isPhotoType ? "Photo" : "QR Location"}
              </span>
              <span className="text-sm font-medium">{gpsCoordinate}</span>
            </div>
            <div className="h-10 w-10 flex justify-center items-center bg-white rounded-full ml-2">
              <PinDropOutlinedIcon sx={{ color: "#2A77D5" }} />
            </div>
          </div>
        </div>

        {index < checkpointFields.length - 1 && <Divider sx={{ borderColor: "#ffffff", mt: 2 }} />}
      </div>
    );
  };

  const Sidebar = () => (
    <div className="w-64 border bg-white border-[#F0F0F0] rounded-l-lg">
      <List dense disablePadding>
        {routeFields.map((route, index) => {
          const routeName = watch(`patroling.patrolRouteDetails.${index}.name`) || `Route ${index + 1}`;
          const checkPoints = watch(`patroling.patrolRouteDetails.${index}.patrolCheckpoints`)?.length || 0;
          return (
            <ListItem key={route.id} disablePadding>
              <ListItemButton
                selected={activeRouteIndex === index}
                onClick={() => switchToRoute(index)}
                sx={{
                  border: "1px solid #F0F0F0",
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "#E3F2FD",
                    borderColor: "#2A77D5",
                  },
                }}
              >
                <ListItemText
                  primary={routeName}
                  secondary={`Checkpoints ${checkPoints}`}
                  slotProps={{
                    primary: {
                      fontWeight: "bold",
                      color: activeRouteIndex === index ? "#2A77D5" : "#707070",
                    },
                    secondary: { color: "#A3A3A3" },
                  }}
                />
                <ArrowForwardIosIcon sx={{ color: "#707070", fontSize: "16px" }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const NewPatrolForm = () => {
    return (
      <div className="flex gap-0 h-full">
        <Sidebar />
        <div className="flex-1 p-4 bg-[#F1F7FE] rounded-r-lg">
          <h2 className="text-2xl font-semibold text-[#2A77D5] mb-2">Patrol Route</h2>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col gap-2 min-w-[300px]">
              <span className="text-[#707070] font-semibold text-sm">
                Patrol Route Details -{" "}
                {watch(`patroling.patrolRouteDetails.${activeRouteIndex}.name`) || `Route ${activeRouteIndex + 1}`}
              </span>
              <Divider />
              <div className="flex flex-col gap-4 mt-2">
                <LabeledInput
                  label="Patrol Route Name"
                  name={`patroling.patrolRouteDetails.${activeRouteIndex}.name`}
                  placeholder="Enter Patrol Route"
                  register={register}
                  validation={{
                    required: "Patrol Route Name is required",
                  }}
                  error={!!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.name}
                  helperText={errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.name?.message}
                />

                <LabeledInput
                  label="Enter Patrol Route Code (Optional)"
                  name={`patroling.patrolRouteDetails.${activeRouteIndex}.routeCode`}
                  placeholder="Enter Route Code"
                  register={register}
                />

                <div>
                  <Typography
                    sx={{
                      typography: {
                        fontSize: "12px",
                      },
                      mb: 0.5,
                      color: "#707070",
                    }}
                  >
                    Patrol Frequency
                  </Typography>
                  <CustomSwitch
                    checked={patrolFrequency}
                    onChange={(checked: boolean) => {
                      setPatrolFrequency(checked);
                      setValue(
                        `patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.type`,
                        checked ? "count" : "time"
                      );
                    }}
                    labelOff="Time"
                    labelOn="Count"
                  />
                </div>

                {!patrolFrequency && (
                  <div className="flex flex-row gap-4">
                    <LabeledDropdown
                      label="Hours"
                      name={`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.hours`}
                      placeholder="Select Hrs"
                      register={register}
                      validation={{
                        required: "Hours is required",
                      }}
                      options={Array.from({ length: 24 }, (_, i) => ({
                        value: i + 1,
                        label: `${i + 1} Hr${i + 1 > 1 ? "s" : ""}`,
                      }))}
                      error={!!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.hours}
                      helperText={
                        errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.hours?.message
                      }
                    />
                    <LabeledDropdown
                      label="Minutes"
                      name={`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.minutes`}
                      placeholder="Select Mins"
                      register={register}
                      validation={{
                        required: "Minutes is required",
                      }}
                      options={[0, 15, 30, 45].map((value) => ({
                        value,
                        label: `${value} Min${value !== 1 ? "s" : ""}`,
                      }))}
                      error={!!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.minutes}
                      helperText={
                        errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.minutes?.message
                      }
                    />
                  </div>
                )}

                <LabeledInput
                  label={patrolFrequency ? "No. of Patrol Rounds" : "No. of Patrol Rounds In A Shift"}
                  name={`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.numberOfPatrols`}
                  placeholder={patrolFrequency ? "Enter number of rounds" : "Auto-calculated"}
                  register={register}
                  validation={{
                    required: "Number of patrols is required",
                    min: { value: 1, message: "At least 1 patrol round is required" },
                  }}
                  error={!!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.numberOfPatrols}
                  helperText={
                    errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.numberOfPatrols?.message
                  }
                  type="number"
                  disabled={!patrolFrequency}
                />
              </div>
            </div>

            <div className="flex flex-col bg-[#F7F7F7] p-4 rounded-lg gap-2 w-full">
              <div className="flex flex-row justify-between">
                <span className="text-[#707070] font-semibold text-sm">Patrol Checkpoints</span>
                <Button variant="contained" className="w-fit" onClick={addCheckpoint} startIcon={<AddIcon />}>
                  ADD CHECKPOINT
                </Button>
              </div>
              <Divider sx={{ borderColor: "#ffffff" }} />

              <div className="flex flex-col mt-2">
                {checkpointFields.map((field, index) => renderCheckpoint(field, index))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const currentRouteName =
  //   watch(`patroling.patrolRouteDetails.${activeRouteIndex}.name`) || `Route ${activeRouteIndex + 1}`;
  // const currentCheckpointCount = checkpointFields.length;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-[#2A77D5]">Set up Patrol Route</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            type="button"
          >
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>
        <div>
          <NewPatrolForm />
        </div>
        <div className="flex flex-row justify-between items-center w-full mt-6">
          <Button onClick={handleAddAnotherPatrolRoute} variant="contained">
            <Add /> ADD ANOTHER PATROL ROUTE
          </Button>
          <Button onClick={handlePatrolRouteSave} variant="contained">
            <Check /> SAVE Changes
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
