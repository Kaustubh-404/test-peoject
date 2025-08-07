import AddIcon from "@mui/icons-material/Add";
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

interface Client {
  id: number;
  name: string;
  companyId: string;
  logo?: string;
}

interface TaskLocationData {
  selectedClients: number[];
  customLocation?: string;
}

interface TaskLocationFormProps {
  data: TaskLocationData;
  clients: Client[];
  loadingClients: boolean;
  onUpdate: (data: Partial<TaskLocationData>) => void;
}

const TaskLocationForm: React.FC<TaskLocationFormProps> = ({ data, clients, loadingClients, onUpdate }) => {
  const handleClientSelect = (clientId: number) => {
    const selectedClients = data.selectedClients.includes(clientId)
      ? data.selectedClients.filter((id) => id !== clientId)
      : [...data.selectedClients, clientId];

    onUpdate({ selectedClients });
  };

  const handleAddNewLocation = () => {
    // Navigate to add new location or open modal
    console.log("Add new location clicked");
  };

  return (
    <Box
      sx={{
        width: "1136px",
        height: "552px",
        padding: "24px",
        gap: "24px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: "Mukta",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: "32px",
          color: "#2A77D5",
          textTransform: "capitalize",
          mb: 3,
        }}
      >
        TASK LOCATION
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Label */}
        <Typography
          sx={{
            fontFamily: "Mukta",
            fontWeight: 500,
            fontSize: "16px",
            color: "#707070",
            textTransform: "capitalize",
          }}
        >
          Select a Task Location
        </Typography>

        {/* Add New Location Button */}
        <Box
          onClick={handleAddNewLocation}
          sx={{
            width: "112px",
            height: "90px",
            padding: "12px",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 1px 4px 0px #70707033",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            mb: 2,
            "&:hover": {
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <AddIcon sx={{ width: "32px", height: "32px", color: "#2A77D5", mb: 1 }} />
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "14px",
              textAlign: "center",
              textTransform: "uppercase",
              color: "#3B3B3B",
            }}
          >
            Add New Location
          </Typography>
        </Box>

        {/* Clients Section */}
        <Box>
          <Typography
            sx={{
              fontFamily: "Mukta",
              fontWeight: 500,
              fontSize: "12px",
              color: "#707070",
              textTransform: "capitalize",
              mb: 1,
            }}
          >
            Clients
          </Typography>

          {loadingClients ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(136px, 1fr))",
                gap: "16px",
                maxHeight: "318px",
                overflowY: "auto",
              }}
            >
              {clients.map((client) => (
                <Box
                  key={client.id}
                  onClick={() => handleClientSelect(client.id)}
                  sx={{
                    width: "136px",
                    height: "112px",
                    padding: "12px",
                    borderRadius: "12px",
                    backgroundColor: data.selectedClients.includes(client.id) ? "#E3F0FF" : "#FFFFFF",
                    border: data.selectedClients.includes(client.id) ? "2px solid #2A77D5" : "none",
                    boxShadow: "0px 1px 4px 0px #70707033",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: data.selectedClients.includes(client.id) ? "#E3F0FF" : "#F5F5F5",
                    },
                  }}
                >
                  {/* Client Logo */}
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#F0F0F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      fontSize: "20px",
                      border: "1.43px solid #F0F0F0",
                    }}
                  >
                    {client.logo || "🏢"}
                  </Box>

                  {/* Client Name */}
                  <Typography
                    sx={{
                      fontFamily: "Mukta",
                      fontWeight: 500,
                      fontSize: "14px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      color: "#3B3B3B",
                      lineHeight: "16px",
                    }}
                  >
                    {client.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskLocationForm;
