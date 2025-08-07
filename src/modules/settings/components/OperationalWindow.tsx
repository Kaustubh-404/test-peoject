import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

// Mock data for now - replace with useSettings when context is set up
const mockOperationalSettings = {
  securityGuardTypes: [
    { id: "1", name: "Security Guard", isActive: true },
    { id: "2", name: "Lady Guard", isActive: true },
    { id: "3", name: "Gun Man", isActive: true },
    { id: "4", name: "Post Supervisor", isActive: true },
    { id: "5", name: "Head Guard", isActive: true },
    { id: "6", name: "Personal Security Guard", isActive: true },
  ],
  areas: [
    { id: "1", name: "North Delhi", isActive: true },
    { id: "2", name: "South Delhi", isActive: true },
    { id: "3", name: "Jaipur", isActive: true },
    { id: "4", name: "Ghaziabad", isActive: true },
    { id: "5", name: "Gurgaon + Delhi Airport", isActive: true },
    { id: "6", name: "Greater Noida", isActive: true },
  ],
  areaManagers: [
    { id: "1", name: "Ramesh Garg", areaId: "1", isActive: true },
    { id: "2", name: "Chandan Tripathi", areaId: "4", isActive: true },
    { id: "3", name: "Kanta Sharma", areaId: "6", isActive: true },
  ],
  siteTypes: [
    { id: "1", name: "Commercial Building", category: "Commercial", isActive: true },
    { id: "2", name: "Corporate Office", category: "Corporate", isActive: true },
    { id: "3", name: "Warehouse", category: "Industrial", isActive: true },
    { id: "4", name: "Retail", category: "Retail", isActive: true },
    { id: "5", name: "Factory / Plant", category: "Industrial", isActive: true },
    { id: "6", name: "Bank / ATM", category: "Financial", isActive: true },
    { id: "7", name: "Residential Society", category: "Residential", isActive: true },
    { id: "8", name: "Individual Residence", category: "Residential", isActive: true },
    { id: "9", name: "Hospital / Clinic", category: "Healthcare", isActive: true },
    { id: "10", name: "Government Office", category: "Government", isActive: true },
    { id: "11", name: "School / College / University", category: "Education", isActive: true },
    { id: "12", name: "Religious Place", category: "Religious", isActive: true },
  ],
};

type ModalType = "guardTypes" | "areas" | "areaManagers" | "siteTypes" | null;

const OperationalWindow: React.FC = () => {
  // Use mock data for now - replace with useSettings when context is properly set up
  const operationalSettings = mockOperationalSettings;
  const loading = false;

  const [openModal, setOpenModal] = useState<ModalType>(null);

  // Local state for editing
  const [editingGuardTypes, setEditingGuardTypes] = useState<string[]>([]);
  const [editingAreas, setEditingAreas] = useState<string[]>([]);
  const [editingAreaManagers, setEditingAreaManagers] = useState<Array<{ name: string; phone: string; area: string }>>(
    []
  );
  const [editingSiteTypes, setEditingSiteTypes] = useState<string[]>([]);

  // Initialize editing state when modal opens
  const handleOpenModal = (type: ModalType) => {
    if (!operationalSettings) return;

    switch (type) {
      case "guardTypes":
        setEditingGuardTypes(operationalSettings.securityGuardTypes.map((gt) => gt.name));
        break;
      case "areas":
        setEditingAreas(operationalSettings.areas.map((area) => area.name));
        break;
      case "areaManagers":
        setEditingAreaManagers(
          operationalSettings.areaManagers.map((am) => ({
            name: am.name,
            phone: "Contact Number", // Mock data
            area: operationalSettings.areas.find((a) => a.id === am.areaId)?.name || "",
          }))
        );
        break;
      case "siteTypes":
        setEditingSiteTypes(operationalSettings.siteTypes.map((st) => st.name));
        break;
    }
    setOpenModal(type);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  // Add new item functions
  const addGuardType = () => {
    setEditingGuardTypes([...editingGuardTypes, ""]);
  };

  const addArea = () => {
    setEditingAreas([...editingAreas, ""]);
  };

  const addAreaManager = () => {
    setEditingAreaManagers([...editingAreaManagers, { name: "", phone: "", area: "" }]);
  };

  const addSiteType = () => {
    setEditingSiteTypes([...editingSiteTypes, ""]);
  };

  // Delete item functions
  const deleteGuardType = (index: number) => {
    setEditingGuardTypes(editingGuardTypes.filter((_, i) => i !== index));
  };

  const deleteArea = (index: number) => {
    setEditingAreas(editingAreas.filter((_, i) => i !== index));
  };

  const deleteAreaManager = (index: number) => {
    setEditingAreaManagers(editingAreaManagers.filter((_, i) => i !== index));
  };

  const deleteSiteType = (index: number) => {
    setEditingSiteTypes(editingSiteTypes.filter((_, i) => i !== index));
  };

  // Save changes function
  const handleSaveChanges = async () => {
    if (!operationalSettings) return;

    // TODO: Implement actual save logic with API
    console.log("Saving changes:", {
      guardTypes: editingGuardTypes,
      areas: editingAreas,
      areaManagers: editingAreaManagers,
      siteTypes: editingSiteTypes,
    });

    // Mock implementation - replace with updateOperationalSettings when context is ready
    // await updateOperationalSettings({
    //   ...operationalSettings,
    //   lastModified: new Date().toLocaleDateString()
    // });

    handleCloseModal();
  };

  if (loading || !operationalSettings) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontFamily: "Mukta", fontSize: "18px", color: "#707070" }}>
          Loading operational settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "1052px",
        height: "840px",
        borderRadius: "12px",
        padding: "16px",
        background: "#F7F7F7",
      }}
    >
      <Box
        sx={{
          width: "1020px",
          height: "808px",
          gap: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: "1020px",
            height: "32px",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              width: "908px",
              height: "24px",
              gap: "16px",
            }}
          >
            <Typography
              sx={{
                width: "190px",
                height: "24px",
                paddingTop: "5px",
                paddingBottom: "4px",
                fontFamily: "Mukta",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "32px",
                textTransform: "capitalize",
                color: "#3B3B3B",
              }}
            >
              Operational Setup
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "1020px",
            height: "1px",
            border: "1px solid #FFFFFF",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            width: "1020px",
            height: "752px",
            gap: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Row 1 */}
          <Box sx={{ display: "flex", gap: "16px" }}>
            {/* Security Guard Types Card */}
            <Box
              sx={{
                width: "420px",
                minHeight: "208px",
                height: "auto",
                borderRadius: "10px",
                padding: "12px 16px 16px 16px",
                gap: "16px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  width: "388px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "20px",
                    textTransform: "capitalize",
                    color: "#3B3B3B",
                  }}
                >
                  Security Guard Types
                </Typography>
                <IconButton
                  onClick={() => handleOpenModal("guardTypes")}
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    boxShadow: "0px 1px 4px 0px #70707033",
                    "&:hover": {
                      background: "#F5F5F5",
                    },
                  }}
                >
                  <EditIcon sx={{ color: "#2A77D5", fontSize: "14px" }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  width: "388px",
                  minHeight: "152px",
                  gap: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                }}
              >
                {operationalSettings.securityGuardTypes.slice(0, 6).map((guardType, _index) => (
                  <Chip
                    key={guardType.id}
                    label={guardType.name}
                    sx={{
                      height: "36px",
                      borderRadius: "36px",
                      padding: "8px 16px",
                      background: "#F7F7F7",
                      color: "#629DE4",
                      fontFamily: "Mukta",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      "& .MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Areas Card */}
            <Box
              sx={{
                width: "420px",
                minHeight: "208px",
                height: "auto",
                borderRadius: "10px",
                padding: "12px 16px 16px 16px",
                gap: "16px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  width: "388px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "20px",
                    textTransform: "capitalize",
                    color: "#3B3B3B",
                  }}
                >
                  Areas
                </Typography>
                <IconButton
                  onClick={() => handleOpenModal("areas")}
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    boxShadow: "0px 1px 4px 0px #70707033",
                    "&:hover": {
                      background: "#F5F5F5",
                    },
                  }}
                >
                  <EditIcon sx={{ color: "#2A77D5", fontSize: "14px" }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  width: "388px",
                  minHeight: "152px",
                  gap: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                }}
              >
                {operationalSettings.areas.slice(0, 6).map((area) => (
                  <Chip
                    key={area.id}
                    label={area.name}
                    sx={{
                      height: "36px",
                      borderRadius: "36px",
                      padding: "8px 16px",
                      background: "#F7F7F7",
                      color: "#629DE4",
                      fontFamily: "Mukta",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      "& .MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Row 2 */}
          <Box sx={{ display: "flex", gap: "16px" }}>
            {/* Area Managers Card */}
            <Box
              sx={{
                width: "420px",
                minHeight: "208px",
                height: "auto",
                borderRadius: "10px",
                padding: "12px 16px 16px 16px",
                gap: "16px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  width: "388px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "20px",
                    textTransform: "capitalize",
                    color: "#3B3B3B",
                  }}
                >
                  Area Managers
                </Typography>
                <IconButton
                  onClick={() => handleOpenModal("areaManagers")}
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    boxShadow: "0px 1px 4px 0px #70707033",
                    "&:hover": {
                      background: "#F5F5F5",
                    },
                  }}
                >
                  <EditIcon sx={{ color: "#2A77D5", fontSize: "14px" }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  width: "388px",
                  minHeight: "152px",
                  gap: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                }}
              >
                {operationalSettings.areaManagers.map((manager) => (
                  <Chip
                    key={manager.id}
                    label={manager.name}
                    sx={{
                      height: "36px",
                      borderRadius: "36px",
                      padding: "8px 16px",
                      background: "#F7F7F7",
                      color: "#629DE4",
                      fontFamily: "Mukta",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      "& .MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Site Types Card */}
            <Box
              sx={{
                width: "420px",
                minHeight: "208px",
                height: "auto",
                borderRadius: "10px",
                padding: "12px 16px 16px 16px",
                gap: "16px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  width: "388px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Mukta",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "20px",
                    textTransform: "capitalize",
                    color: "#3B3B3B",
                  }}
                >
                  Site Types
                </Typography>
                <IconButton
                  onClick={() => handleOpenModal("siteTypes")}
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    boxShadow: "0px 1px 4px 0px #70707033",
                    "&:hover": {
                      background: "#F5F5F5",
                    },
                  }}
                >
                  <EditIcon sx={{ color: "#2A77D5", fontSize: "14px" }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  width: "388px",
                  minHeight: "152px",
                  gap: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                }}
              >
                {operationalSettings.siteTypes.slice(0, 12).map((siteType) => (
                  <Chip
                    key={siteType.id}
                    label={siteType.name}
                    sx={{
                      height: "36px",
                      borderRadius: "36px",
                      padding: "8px 16px",
                      background: "#F7F7F7",
                      color: "#629DE4",
                      fontFamily: "Mukta",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      "& .MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      {/* Security Guard Types Modal */}
      <Dialog open={openModal === "guardTypes"} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#2A77D5", fontFamily: "Mukta", fontWeight: 600 }}>
            SECURITY GUARD TYPE
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: 2 }}>
            {editingGuardTypes.map((guardType, index) => (
              <Box key={index} sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <TextField
                  fullWidth
                  value={guardType}
                  onChange={(e) => {
                    const newGuardTypes = [...editingGuardTypes];
                    newGuardTypes[index] = e.target.value;
                    setEditingGuardTypes(newGuardTypes);
                  }}
                  variant="outlined"
                  size="small"
                  label={`Guard Type ${index + 1}`}
                />
                <IconButton onClick={() => deleteGuardType(index)} sx={{ color: "#2A77D5" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addGuardType} sx={{ color: "#2A77D5", textTransform: "none" }}>
              ADD NEW GUARD TYPE
            </Button>
            <Button
              startIcon={<CheckIcon />}
              onClick={handleSaveChanges}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#2A77D5",
                borderColor: "#2A77D5",
                textTransform: "none",
                mt: 2,
                height: "40px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#2A77D5",
                },
              }}
            >
              SAVE CHANGES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Areas Modal */}
      <Dialog open={openModal === "areas"} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#2A77D5", fontFamily: "Mukta", fontWeight: 600 }}>
            AREAS
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: 2 }}>
            {editingAreas.map((area, index) => (
              <Box key={index} sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <TextField
                  fullWidth
                  value={area}
                  onChange={(e) => {
                    const newAreas = [...editingAreas];
                    newAreas[index] = e.target.value;
                    setEditingAreas(newAreas);
                  }}
                  variant="outlined"
                  size="small"
                  label={`Area ${index + 1}`}
                />
                <IconButton onClick={() => deleteArea(index)} sx={{ color: "#2A77D5" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addArea} sx={{ color: "#2A77D5", textTransform: "none" }}>
              ADD NEW AREA
            </Button>
            <Button
              startIcon={<CheckIcon />}
              onClick={handleSaveChanges}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#2A77D5",
                borderColor: "#2A77D5",
                textTransform: "none",
                mt: 2,
                height: "40px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#2A77D5",
                },
              }}
            >
              SAVE CHANGES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Area Managers Modal */}
      <Dialog open={openModal === "areaManagers"} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#2A77D5", fontFamily: "Mukta", fontWeight: 600 }}>
            Area Managers
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: 2 }}>
            {editingAreaManagers.map((manager, index) => (
              <Box key={index} sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <TextField
                  value={manager.name}
                  onChange={(e) => {
                    const newManagers = [...editingAreaManagers];
                    newManagers[index].name = e.target.value;
                    setEditingAreaManagers(newManagers);
                  }}
                  variant="outlined"
                  size="small"
                  label="Full Name"
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={manager.phone}
                  onChange={(e) => {
                    const newManagers = [...editingAreaManagers];
                    newManagers[index].phone = e.target.value;
                    setEditingAreaManagers(newManagers);
                  }}
                  variant="outlined"
                  size="small"
                  label="Contact Number"
                  sx={{ flex: 1 }}
                />
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Area</InputLabel>
                  <Select
                    value={manager.area}
                    onChange={(e) => {
                      const newManagers = [...editingAreaManagers];
                      newManagers[index].area = e.target.value;
                      setEditingAreaManagers(newManagers);
                    }}
                    label="Area"
                  >
                    {operationalSettings?.areas.map((area) => (
                      <MenuItem key={area.id} value={area.name}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton onClick={() => deleteAreaManager(index)} sx={{ color: "#2A77D5" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addAreaManager} sx={{ color: "#2A77D5", textTransform: "none" }}>
              ADD NEW AREA MANAGER
            </Button>
            <Button
              startIcon={<CheckIcon />}
              onClick={handleSaveChanges}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#2A77D5",
                borderColor: "#2A77D5",
                textTransform: "none",
                mt: 2,
                height: "40px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#2A77D5",
                },
              }}
            >
              SAVE CHANGES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Site Types Modal */}
      <Dialog open={openModal === "siteTypes"} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#2A77D5", fontFamily: "Mukta", fontWeight: 600 }}>
            SITE TYPES
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", mt: 2 }}>
            {editingSiteTypes.map((siteType, index) => (
              <Box key={index} sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <TextField
                  fullWidth
                  value={siteType}
                  onChange={(e) => {
                    const newSiteTypes = [...editingSiteTypes];
                    newSiteTypes[index] = e.target.value;
                    setEditingSiteTypes(newSiteTypes);
                  }}
                  variant="outlined"
                  size="small"
                  label={`Site Type ${index + 1}`}
                />
                <IconButton onClick={() => deleteSiteType(index)} sx={{ color: "#2A77D5" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addSiteType} sx={{ color: "#2A77D5", textTransform: "none" }}>
              ADD NEW SITE TYPE
            </Button>
            <Button
              startIcon={<CheckIcon />}
              onClick={handleSaveChanges}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#2A77D5",
                borderColor: "#2A77D5",
                textTransform: "none",
                mt: 2,
                height: "40px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#2A77D5",
                },
              }}
            >
              SAVE CHANGES
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OperationalWindow;
