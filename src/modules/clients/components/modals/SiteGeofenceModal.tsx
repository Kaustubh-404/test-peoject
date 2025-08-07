import { CustomSwitch } from "@components/CustomSwitch";
import LabeledInput from "@components/LabeledInput";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MapIcon from "@mui/icons-material/Map";
import { Box, Button, Divider, MenuItem, Modal, Select } from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ffffff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  maxHeight: "95vh",
  overflow: "auto",
  width: "60vw",
};

interface SiteGeofenceModalProps {
  open: boolean;
  onClose: () => void;
}

export const SiteGeofenceModal: React.FC<SiteGeofenceModalProps> = ({ open, onClose }) => {
  const [isOn, setIsOn] = useState(true);
  const [geofenceType, setGeofenceType] = useState("Circular Geofence");

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Geofencing data:", data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="geofencing-modal">
      <Box sx={style}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#2A77D5]">Geofencing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            type="button"
          >
            <X className="w-6 h-6 text-[#2A77D5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Geofence Status */}
          <div>
            <h2 className="text-gray-600 text-sm font-medium">Geofence Status</h2>
            <CustomSwitch checked={isOn} onChange={setIsOn} />
          </div>

          {/* GeoLocation Section */}
          <div className="space-y-4">
            <h2 className="text-gray-600 text-sm font-medium">GeoLocation</h2>
            <Divider sx={{ mb: 1 }} />
            <div className="space-y-4">
              <div className="inline-flex w-full gap-4 items-center">
                <LabeledInput
                  label="Site Location Map Link"
                  name="mapLink"
                  placeholder="https://www.google.com/maps?q=21.146633,79.088860"
                  register={register}
                />

                <Button variant="contained" startIcon={<MapIcon />} sx={{ height: "fit-content", mt: 2 }}>
                  OPEN ON MAP
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 w-[30vw]">
                <LabeledInput
                  label="Latitude Coordinates"
                  name="coordinates"
                  placeholder="21.146633, 79.088860"
                  register={register}
                />
                <LabeledInput label="Plus Code" name="plusCode" placeholder="7FG3+V3, XYZ12345)" register={register} />
              </div>
            </div>
          </div>

          {/* Geofence Type Section */}
          <div className="space-y-4">
            <h2 className="text-gray-600 text-sm font-medium">Geofence Type</h2>
            <Divider sx={{ mb: 1 }} />

            <div className="space-y-4">
              <div className="inline-flex gap-4 items-center">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Geofence</label>
                  <Select
                    value={geofenceType}
                    onChange={(e) => setGeofenceType(e.target.value)}
                    size="small"
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      borderRadius: "8px",
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                      },
                    }}
                  >
                    <MenuItem value="Circular Geofence">Circular Geofence</MenuItem>
                    <MenuItem value="Rectangular Geofence">Rectangular Geofence</MenuItem>
                    <MenuItem value="Polygon Geofence">Polygon Geofence</MenuItem>
                  </Select>
                </div>

                <Button
                  variant="contained"
                  startIcon={<MapIcon />}
                  sx={{
                    mt: 2,
                  }}
                >
                  MARK GEOFENCE ON MAP
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="contained" startIcon={<DeleteOutlineIcon />}>
              DELETE GEOFENCE
            </Button>

            <Button type="submit" variant="contained" startIcon={<CheckIcon />}>
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
