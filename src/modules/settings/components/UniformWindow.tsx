import { Add as AddIcon, ChevronRight as ChevronRightIcon, Edit as EditIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Types for modular structure
type UniformType = "Standard" | "Gunman" | "Lady Guard";

interface UniformData {
  id: string;
  type: UniformType;
  photoCount: number;
  lastUpdated: string;
  uniformTop: string[];
  uniformBottom: string[];
  accessories: string[];
}

// Mock data - easily replaceable with API calls
const mockUniformData: UniformData[] = [
  {
    id: "1",
    type: "Standard",
    photoCount: 8,
    lastUpdated: "12/03/2025",
    uniformTop: ["uniform1.jpg", "uniform2.jpg", "uniform3.jpg", "uniform4.jpg", "uniform5.jpg"],
    uniformBottom: ["bottom1.jpg", "bottom2.jpg"],
    accessories: ["acc1.jpg", "acc2.jpg"],
  },
  {
    id: "2",
    type: "Gunman",
    photoCount: 12,
    lastUpdated: "10/03/2025",
    uniformTop: ["gunman1.jpg", "gunman2.jpg", "gunman3.jpg"],
    uniformBottom: ["gunbottom1.jpg"],
    accessories: ["gunacc1.jpg", "gunacc2.jpg"],
  },
  {
    id: "3",
    type: "Lady Guard",
    photoCount: 6,
    lastUpdated: "08/03/2025",
    uniformTop: ["lady1.jpg", "lady2.jpg"],
    uniformBottom: ["ladybottom1.jpg"],
    accessories: ["ladyacc1.jpg"],
  },
];

// UniformListItem Component
interface UniformListItemProps {
  uniformType: UniformType;
  photoCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const UniformListItem: React.FC<UniformListItemProps> = ({ uniformType, photoCount, isSelected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: "160px",
        height: "52px",
        padding: "8px",
        borderBottom: "1px solid #F0F0F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: isSelected ? "#F1F7FE" : "#ffffff",
        cursor: "pointer",
        "&:hover": {
          background: "#E3F2FD",
        },
      }}
    >
      <Box sx={{ width: "55px", height: "36px", gap: "4px", display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            width: "fit-content",
            height: "16px",
            paddingTop: "3px",
            paddingBottom: "4px",
            fontFamily: "Mukta",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "16px",
            textTransform: "capitalize",
            color: isSelected ? "#1D68C3" : "#707070",
            whiteSpace: "nowrap",
          }}
        >
          {uniformType}
        </Typography>
        <Box sx={{ width: "50px", height: "16px", gap: "8px", display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              width: "35px",
              height: "16px",
              paddingTop: "4px",
              paddingBottom: "4px",
              fontFamily: "Mukta",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: isSelected ? "#1D68C3" : "#707070",
            }}
          >
            Photos
          </Typography>
          <Typography
            sx={{
              width: "7px",
              height: "16px",
              paddingTop: "4px",
              paddingBottom: "4px",
              fontFamily: "Mukta",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: isSelected ? "#1D68C3" : "#707070",
            }}
          >
            {photoCount}
          </Typography>
        </Box>
      </Box>
      <ChevronRightIcon
        sx={{
          width: "20px",
          height: "20px",
          color: isSelected ? "#1D68C3" : "#707070",
        }}
      />
    </Box>
  );
};

// PhotoSection Component
interface PhotoSectionProps {
  title: string;
  photos: string[];
}

const PhotoSection: React.FC<PhotoSectionProps> = ({ title, photos }) => {
  return (
    <Box sx={{ width: "100%", height: "120px", gap: "24px", display: "flex", alignItems: "flex-start" }}>
      <Typography
        sx={{
          width: "100px",
          height: "16px",
          paddingTop: "4px",
          paddingBottom: "4px",
          fontFamily: "Mukta",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "16px",
          textTransform: "capitalize",
          color: "#3B3B3B",
          flexShrink: 0,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          flex: 1,
          height: "120px",
          gap: "8px",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
        }}
      >
        {photos.map((photo, index) => (
          <Box
            key={index}
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "8px",
              background: "#E0E0E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              "&:hover .edit-overlay": {
                opacity: 1,
              },
            }}
          >
            {/* Placeholder for actual image */}
            <Typography
              sx={{
                fontFamily: "Mukta",
                fontSize: "10px",
                color: "#707070",
                textAlign: "center",
              }}
            >
              {photo}
            </Typography>
            {/* Edit overlay that appears on hover */}
            <Box
              className="edit-overlay"
              sx={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              <EditIcon sx={{ fontSize: "12px", color: "#2A77D5" }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Main UniformWindow Component
const UniformWindow: React.FC = () => {
  const [selectedUniformType, setSelectedUniformType] = useState<UniformType>("Standard");
  const [uniformData] = useState<UniformData[]>(mockUniformData);
  const navigate = useNavigate();

  // Get selected uniform data
  const selectedUniform = uniformData.find((item) => item.type === selectedUniformType);

  const handleAddUniform = () => {
    // Navigate to Add New Uniform page
    navigate("/add-new-uniform");
  };

  const handleEditMode = () => {
    // API call to enable edit mode
    console.log("Edit mode enabled");
  };

  return (
    <Box
      sx={{
        width: "1052px",
        height: "840px",
        borderRadius: "12px",
        padding: "16px",
        background: "#F7F7F7",
        overflow: "hidden",
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
        <Box sx={{ width: "100%", height: "32px", gap: "8px", display: "flex", flexDirection: "column" }}>
          <Box sx={{ width: "1020px", height: "24px", gap: "16px", display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                width: "163px",
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
              Uniforms Setup
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "100%",
            height: "1px",
            background: "#FFFFFF",
          }}
        />

        {/* Main Card */}
        <Box
          sx={{
            width: "1020px",
            height: "752px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "16px",
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              width: "988px",
              height: "32px",
              paddingLeft: "8px",
              display: "flex",
              gap: "8px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "832px", flex: 1, height: "18px", gap: "16px" }}>
              <Typography
                sx={{
                  width: "128px",
                  height: "18px",
                  paddingTop: "5px",
                  paddingBottom: "3px",
                  fontFamily: "Mukta",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "20px",
                  textTransform: "capitalize",
                  color: "#3B3B3B",
                }}
              >
                Uploaded Uniform
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon sx={{ width: "16px", height: "16px", color: "#2A77D5" }} />}
              onClick={handleAddUniform}
              sx={{
                width: "140px",
                height: "32px",
                borderRadius: "8px",
                padding: "8px 16px",
                background: "#FFFFFF",
                boxShadow: "0px 1px 4px rgba(112, 112, 112, 0.2)",
                textTransform: "uppercase",
                fontFamily: "Mukta",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                color: "#2A77D5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  background: "#F8F9FA",
                },
              }}
            >
              Add Uniform
            </Button>
          </Box>

          {/* Content */}
          <Box
            sx={{
              width: "988px",
              height: "672px",
              flex: 1,
              borderRadius: "12px",
              border: "1px solid #F0F0F0",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Left Sidebar - List */}
            <Box
              sx={{
                width: "160px",
                height: "672px",
                border: "1px solid #F0F0F0",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {uniformData.map((uniform) => (
                <UniformListItem
                  key={uniform.id}
                  uniformType={uniform.type}
                  photoCount={uniform.photoCount}
                  isSelected={selectedUniformType === uniform.type}
                  onClick={() => setSelectedUniformType(uniform.type)}
                />
              ))}
            </Box>

            {/* Right Side - Overview */}
            <Box
              sx={{
                flex: 1,
                height: "672px",
                width: "828px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                padding: "16px",
                background: "#F1F7FE",
                boxShadow: "0px 1px 4px rgba(78, 81, 95, 0.06)",
              }}
            >
              <Box
                sx={{
                  width: "796px",
                  height: "640px",
                  gap: "12px",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "10px ",
                  background: "#FFFFFF",
                  padding: "8px 12px",
                }}
              >
                <Box
                  sx={{
                    width: "796px",
                    height: "640px",
                    gap: "16px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      width: "772px",
                      height: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "138px",
                        height: "16px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        fontFamily: "Mukta",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "16px",
                        textTransform: "capitalize",
                        color: "#707070",
                      }}
                    >
                      Last Uploaded : {selectedUniform?.lastUpdated}
                    </Typography>
                    <IconButton
                      onClick={handleEditMode}
                      sx={{
                        width: "12px",
                        height: "12px",
                        padding: 0,
                        minWidth: "12px",
                      }}
                    >
                      <EditIcon sx={{ fontSize: "12px", color: "#2A77D5" }} />
                    </IconButton>
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      width: "100%",
                      flex: 1,
                      paddingTop: "16px",
                      paddingBottom: "16px",
                      gap: "40px",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "auto",
                    }}
                  >
                    {selectedUniform && (
                      <>
                        <PhotoSection title="Uniform Top" photos={selectedUniform.uniformTop} />
                        <PhotoSection title="Uniform Bottom" photos={selectedUniform.uniformBottom} />
                        <PhotoSection title="Accessories" photos={selectedUniform.accessories} />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UniformWindow;
