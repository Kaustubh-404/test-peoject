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
import { useCreatePatrolRoute, useUpdatePatrolRoute } from "../../apis/hooks/useUpdatePatrolRoute";
import type { ClientSite } from "../forms/add_client_site/types";

interface PatrolModalProps {
  open: boolean;
  onClose: () => void;
  siteData?: any;
  refetch?: () => void;
}

interface CheckpointFile {
  qrFile: File | null;
  photoFile: File | null;
  locationFile: File | null;
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

export const PatrolModal: React.FC<PatrolModalProps> = ({ open, onClose, siteData, refetch }) => {
  const [patrolFrequency, setPatrolFrequency] = useState<boolean>(false);
  const [checkpointFiles, setCheckpointFiles] = useState<CheckpointFile[]>([
    { qrFile: null, photoFile: null, locationFile: null },
  ]);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const updatePatrolRoute = useUpdatePatrolRoute();
  const createPatrolRoute = useCreatePatrolRoute();
  const isLoading = updatePatrolRoute.isPending || createPatrolRoute.isPending;

  const transformRouteData = (apiRoute: any) => ({
    id: apiRoute.id,
    name: apiRoute.routeName,
    routeCode: apiRoute.patrolRouteCode,
    patrolFrequency: {
      type: apiRoute.patrolFrequency === "COUNT" ? "count" : "time",
      hours: apiRoute.hours || 0,
      minutes: apiRoute.minutes || 0,
      count: apiRoute.count || 0,
      numberOfPatrols: apiRoute.roundsInShift || 1,
    },
    patrolCheckpoints:
      apiRoute.checkpoints?.map((checkpoint: any) => ({
        id: checkpoint.id,
        type: checkpoint.checkType === "QR_CODE" ? "qr code" : "photo",
        qrCode: checkpoint.qrCodeUrl || "",
        photo: checkpoint.photoUrl || "",
        qrlocationImageUrl: checkpoint.qrlocationImageUrl || "",
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
      })) || [],
  });

  const initialRoutes =
    siteData?.patrolRoutes?.length > 0
      ? siteData.patrolRoutes.map(transformRouteData)
      : [
          {
            name: "",
            routeCode: "",
            patrolFrequency: {
              type: "time",
              hours: 1,
              minutes: 0,
              numberOfPatrols: 1,
            },
            patrolCheckpoints: [
              {
                type: "qr code",
                qrCode: "",
                photo: "",
              },
            ],
          },
        ];

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
        patrolRouteDetails: initialRoutes,
      },
    },
  });

  const { fields: routeFields, append: appendRoute } = useFieldArray({
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

  useEffect(() => {
    if (routeFields.length === 0) {
      reset({
        patroling: {
          patrolRouteDetails: initialRoutes,
        },
      });
      if (initialRoutes.length > 0 && initialRoutes[0].patrolCheckpoints) {
        const checkpointCount = initialRoutes[0].patrolCheckpoints.length;
        const initialFiles = Array(checkpointCount).fill({ qrFile: null, photoFile: null, locationFile: null });
        setCheckpointFiles(initialFiles);
      }
    }
  }, [reset, routeFields.length, initialRoutes]);

  useEffect(() => {
    if (open) {
      const freshRoutes =
        siteData?.patrolRoutes?.length > 0
          ? siteData.patrolRoutes.map(transformRouteData)
          : [
              {
                name: "",
                routeCode: "",
                patrolFrequency: {
                  type: "time",
                  hours: 1,
                  minutes: 0,
                  numberOfPatrols: 1,
                },
                patrolCheckpoints: [
                  {
                    type: "qr code",
                    qrCode: "",
                    photo: "",
                  },
                ],
              },
            ];

      reset({
        patroling: {
          patrolRouteDetails: freshRoutes,
        },
      });

      if (freshRoutes.length > 0 && freshRoutes[0]?.patrolCheckpoints) {
        const checkpointCount = freshRoutes[0].patrolCheckpoints.length;
        const resetFiles = Array(checkpointCount).fill({ qrFile: null, photoFile: null, locationFile: null });
        setCheckpointFiles(resetFiles);
      }

      setActiveRouteIndex(0);
      setPatrolFrequency(freshRoutes[0]?.patrolFrequency?.type === "count");
    }
  }, [open, siteData, reset]);

  useEffect(() => {
    if (routeFields.length > 0) {
      const currentRoute = watch(`patroling.patrolRouteDetails.${activeRouteIndex}`);
      if (currentRoute?.patrolFrequency?.type) {
        setPatrolFrequency(currentRoute.patrolFrequency.type === "count");
      }
    }
  }, [activeRouteIndex, watch, routeFields.length]);

  useEffect(() => {
    const currentRoute = watch(`patroling.patrolRouteDetails.${activeRouteIndex}`);
    if (currentRoute && !currentRoute.name && !currentRoute.routeCode) {
      setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.type`, "time");
      setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.hours`, 1);
      setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.minutes`, 0);
      setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolFrequency.numberOfPatrols`, 1);
      setPatrolFrequency(false);
    }
  }, [activeRouteIndex, setValue, watch]);

  const handleQrUpload = (file: File | null, index: number) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, and PNG files are allowed.");
        return;
      }
    }
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qrFile: file };
      return updated;
    });
  };

  const handlePhotoUpload = (file: File | null, index: number) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, and PNG files are allowed.");
        return;
      }
    }
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], photoFile: file };
      return updated;
    });
  };

  const handleLocationUpload = (file: File | null, index: number) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, and PNG files are allowed.");
        return;
      }
    }
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], locationFile: file };
      return updated;
    });
  };

  const handleRemovePhoto = (index: number) => {
    setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}.photo`, "");
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], photoFile: null };
      return updated;
    });
  };

  const handleRemoveQrCode = (index: number) => {
    setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}.qrCode`, "");
  };

  const handleRemoveQrLocation = (index: number) => {
    const currentCheckpoints = watch(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints`);
    if (currentCheckpoints && currentCheckpoints[index]) {
      const updatedCheckpoint = { ...currentCheckpoints[index], qrlocationImageUrl: "" };
      setValue(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}`, updatedCheckpoint);
    }
    setCheckpointFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], locationFile: null };
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
      qrCode: "",
      photo: "",
    });
    setCheckpointFiles((prev) => [...prev, { qrFile: null, photoFile: null, locationFile: null }]);
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
      name: "",
      routeCode: "",
      patrolFrequency: {
        type: "time",
        hours: 1,
        minutes: 0,
        numberOfPatrols: 1,
      },
      patrolCheckpoints: [
        {
          type: "qr code",
          qrCode: "",
          photo: "",
        },
      ],
    });
    setActiveRouteIndex(newRouteIndex);
    setCheckpointFiles([{ qrFile: null, photoFile: null, locationFile: null }]);
    setPatrolFrequency(false);
  };

  const switchToRoute = (index: number) => {
    setActiveRouteIndex(index);
    const currentRoute = routeFields[index];
    if (currentRoute) {
      const checkpointCount = watch(`patroling.patrolRouteDetails.${index}.patrolCheckpoints`)?.length || 1;
      setCheckpointFiles(Array(checkpointCount).fill({ qrFile: null, photoFile: null, locationFile: null }));
    }
    const frequencyType = watch(`patroling.patrolRouteDetails.${index}.patrolFrequency.type`);
    setPatrolFrequency(frequencyType === "count");
  };

  const handlePatrolRouteSave = async () => {
    const routeData = watch(`patroling.patrolRouteDetails.${activeRouteIndex}`);
    const isExistingRoute = (routeData as any)?.id;

    try {
      if (!routeData || !siteData?.id) return;
      if (!routeData.name?.trim()) return;

      const checkpoints =
        routeData.patrolCheckpoints?.map((checkpoint: any) => ({
          id: checkpoint.id,
          checkType: (checkpoint.type === "qr code" ? "QR_CODE" : "PHOTO") as "QR_CODE" | "PHOTO",
          latitude: parseFloat(checkpoint.latitude) || 0,
          longitude: parseFloat(checkpoint.longitude) || 0,
        })) || [];

      const files: { [key: string]: File } = {};
      const checkpointCount = routeData.patrolCheckpoints?.length || 0;
      const currentFilesCount = checkpointFiles.length;

      if (currentFilesCount < checkpointCount) {
        const additionalFiles = Array(checkpointCount - currentFilesCount).fill({
          qrFile: null,
          photoFile: null,
          locationFile: null,
        });
        setCheckpointFiles((prev) => [...prev, ...additionalFiles]);
      }

      const filesToProcess =
        checkpointFiles.length >= checkpointCount
          ? checkpointFiles
          : [
              ...checkpointFiles,
              ...Array(checkpointCount - checkpointFiles.length).fill({
                qrFile: null,
                photoFile: null,
                locationFile: null,
              }),
            ];

      filesToProcess.slice(0, checkpointCount).forEach((checkpointFile, index) => {
        if (checkpointFile?.qrFile) {
          files[`checkpoint_${index}_qrCodeFile`] = checkpointFile.qrFile;
        }
        if (checkpointFile?.locationFile) {
          files[`checkpoint_${index}_qrlocationImageFile`] = checkpointFile.locationFile;
        }
        if (checkpointFile?.photoFile) {
          files[`checkpoint_${index}_photoFile`] = checkpointFile.photoFile;
        }
      });

      if (isExistingRoute) {
        const updateData = {
          siteId: siteData.id,
          routeId: (routeData as any).id,
          routeName: routeData.name,
          patrolRouteCode: routeData.routeCode,
          patrolFrequency: (routeData.patrolFrequency?.type === "count" ? "COUNT" : "TIME") as "COUNT" | "TIME",
          hours: routeData.patrolFrequency?.hours,
          minutes: routeData.patrolFrequency?.minutes,
          count: routeData.patrolFrequency?.count,
          roundsInShift: routeData.patrolFrequency?.numberOfPatrols,
          checkpoints,
        };
        await updatePatrolRoute.mutateAsync({ data: updateData, files });
      } else {
        const createData = {
          siteId: siteData.id,
          routeName: routeData.name,
          patrolRouteCode: routeData.routeCode,
          patrolFrequency: (routeData.patrolFrequency?.type === "count" ? "COUNT" : "TIME") as "COUNT" | "TIME",
          hours: routeData.patrolFrequency?.hours,
          minutes: routeData.patrolFrequency?.minutes,
          count: routeData.patrolFrequency?.count,
          roundsInShift: routeData.patrolFrequency?.numberOfPatrols,
          checkpoints,
        };
        await createPatrolRoute.mutateAsync({ data: createData, files });
      }

      if (refetch) {
        await refetch();
      }

      onClose();
    } catch (error: any) {
      if (error.message?.includes("File") && error.message?.includes("exceeds")) {
        alert("One or more files exceed the maximum size of 10MB. Please compress your images and try again.");
      } else if (error.message?.includes("unsupported type")) {
        alert("One or more files have unsupported types. Only JPEG, JPG, and PNG files are allowed.");
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        alert("Network error occurred. Please check your connection and try again.");
      } else {
        const errorMsg = error.response?.data?.message || error.message || "Unknown error";
        const action = isExistingRoute ? "save" : "create";
        alert(
          `Failed to ${action} patrol route: ${errorMsg}. Please try again or contact support if the issue persists.`
        );
      }
    }
  };

  const handleAddAnotherPatrolRoute = () => {
    addNewPatrolRoute();
  };

  const renderCheckpoint = (field: any, index: number) => {
    const checkpointType =
      watch(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}.type`) || "qr code";
    const isPhotoType = checkpointType === "photo";
    const checkpoint = watch(`patroling.patrolRouteDetails.${activeRouteIndex}.patrolCheckpoints.${index}`) as any;
    const gpsCoordinate =
      checkpoint?.latitude && checkpoint?.longitude
        ? `${checkpoint.latitude}, ${checkpoint.longitude}`
        : "GPS coordinates not available";
    const qrCodeImage = checkpoint?.qrCode;
    const qrLocationImage = checkpoint?.qrlocationImageUrl;
    const photoImage = checkpoint?.photo;
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
        <div className="flex flex-row gap-4 min-h-36 ">
          <div>
            <Typography
              sx={{
                typography: { fontSize: "12px" },
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
          {!isPhotoType && (
            <div className="flex flex-row gap-4">
              {qrCodeImage && (
                <div>
                  <span className="text-sm mb-1 text-[#707070]">QR Code</span>
                  <div className="h-24 w-24 border rounded bg-gray-100 flex items-center justify-center relative">
                    <img src={qrCodeImage} className="h-20 w-20 object-cover rounded" alt={`QR Code ${index + 1}`} />
                    <button
                      onClick={() => handleRemoveQrCode(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              {qrLocationImage && (
                <div>
                  <span className="text-sm mb-1 text-[#707070]">QR Location</span>
                  <div className="h-24 w-24 border rounded bg-gray-100 flex items-center justify-center relative">
                    <img
                      src={qrLocationImage}
                      className="h-20 w-20 object-cover rounded"
                      alt={`QR Location ${index + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveQrLocation(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isPhotoType && (
            <div className="flex flex-row gap-4">
              {photoImage && (
                <div>
                  <span className="text-sm mb-1 text-[#707070]">Checkpoint Photo</span>
                  <div className="h-24 w-24 border rounded bg-gray-100 flex items-center justify-center relative">
                    <img src={photoImage} className="h-20 w-20 object-cover rounded" alt={`Photo ${index + 1}`} />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              {!photoImage && (
                <div className="w-[10vw] h-20">
                  <FileUpload
                    label="Checkpoint Photo"
                    maxSize={2}
                    acceptedFileTypes=".jpeg,.jpg,.png"
                    onFileChange={(file) => handlePhotoUpload(file, index)}
                    placeholder="Upload Photo"
                  />
                </div>
              )}
            </div>
          )}
          {!isPhotoType && (
            <div className="flex flex-row gap-2">
              {!qrCodeImage && (
                <div className="w-[10vw] h-20">
                  <FileUpload
                    label="QR Code Image"
                    maxSize={2}
                    acceptedFileTypes=".jpeg,.jpg,.png"
                    onFileChange={(file) => handleQrUpload(file, index)}
                    placeholder="Upload QR Code"
                  />
                </div>
              )}
              {!qrLocationImage && (
                <div className="w-[10vw] h-20">
                  <FileUpload
                    label="QR Location Photo"
                    maxSize={2}
                    acceptedFileTypes=".jpeg,.jpg,.png"
                    onFileChange={(file) => handleLocationUpload(file, index)}
                    placeholder="Upload Location Photo"
                  />
                </div>
              )}
            </div>
          )}
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
                      key={`route-name-${activeRouteIndex}`}
                      label="Patrol Route Name"
                      name={`patroling.patrolRouteDetails.${activeRouteIndex}.name`}
                      placeholder="Enter Patrol Route"
                      register={register}
                      validation={{ required: "Patrol Route Name is required" }}
                      error={!!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.name}
                      helperText={errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.name?.message}
                    />
                    <LabeledInput
                      key={`route-code-${activeRouteIndex}`}
                      label="Enter Patrol Route Code (Optional)"
                      name={`patroling.patrolRouteDetails.${activeRouteIndex}.routeCode`}
                      placeholder="Enter Route Code"
                      register={register}
                    />
                    <div>
                      <Typography
                        sx={{
                          typography: { fontSize: "12px" },
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
                          validation={{ required: "Hours is required" }}
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
                          validation={{ required: "Minutes is required" }}
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
                      placeholder={patrolFrequency ? "Enter number of rounds" : "Enter number of rounds in a shift"}
                      register={register}
                      validation={{
                        required: "Number of patrols is required",
                        min: { value: 1, message: "At least 1 patrol round is required" },
                      }}
                      error={
                        !!errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.numberOfPatrols
                      }
                      helperText={
                        errors.patroling?.patrolRouteDetails?.[activeRouteIndex]?.patrolFrequency?.numberOfPatrols
                          ?.message
                      }
                      type="number"
                      disabled={false}
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
        </div>
        <div className="flex flex-row justify-between items-center w-full mt-6">
          <Button onClick={handleAddAnotherPatrolRoute} variant="contained" disabled={isLoading}>
            <Add /> ADD ANOTHER PATROL ROUTE
          </Button>
          <Button onClick={handlePatrolRouteSave} variant="contained" disabled={isLoading}>
            <Check /> {isLoading ? "SAVING..." : "SAVE Changes"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
