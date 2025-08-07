import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOfficers } from "../../../context/OfficerContext";

// Types for Client Sites API
interface ClientSite {
  siteId: string;
  client: string;
  siteName: string;
  type: "Bank" | "ATM" | "Corporate" | "Retail";
  posts: number;
  guardCount: number;
}

// Types for Tasks API
interface ClientSiteTask {
  id: string;
  dueDate: string; // Format: "DD/MM/YY"
  dueTime: string; // Format: "HH:MM am/pm"
  assignedBy: string;
  taskType: "site_visit" | "training" | "document" | "inspection" | "other";
  status: "overdue" | "pending" | "done";
  clientSiteId: string;
}

type TaskStatus = "overdue" | "pending" | "done";

// Mock data service (replace with actual API calls)
const clientSitesService = {
  getClientSitesForOfficer: async (_officerId: string): Promise<ClientSite[]> => {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        siteId: "234",
        client: "Axis Bank",
        siteName: "Nehru Place",
        type: "Bank",
        posts: 3,
        guardCount: 6,
      },
      {
        siteId: "235",
        client: "HDFC Bank",
        siteName: "Greater Kailash 1",
        type: "Bank",
        posts: 2,
        guardCount: 4,
      },
      {
        siteId: "236",
        client: "Kotak",
        siteName: "Alaknanda",
        type: "ATM",
        posts: 1,
        guardCount: 2,
      },
      {
        siteId: "237",
        client: "SBI",
        siteName: "Greater Kailash 2",
        type: "Bank",
        posts: 2,
        guardCount: 4,
      },
    ];
  },

  getTasksForClientSite: async (clientSiteId: string): Promise<ClientSiteTask[]> => {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock tasks for different sites
    const mockTasks: { [key: string]: ClientSiteTask[] } = {
      "234": [
        {
          id: "task_1",
          dueDate: "23/01/25",
          dueTime: "04:35 pm",
          assignedBy: "Office",
          taskType: "site_visit",
          status: "overdue",
          clientSiteId: "234",
        },
        {
          id: "task_2",
          dueDate: "25/01/25",
          dueTime: "02:00 pm",
          assignedBy: "Manager",
          taskType: "inspection",
          status: "pending",
          clientSiteId: "234",
        },
        {
          id: "task_4",
          dueDate: "20/01/25",
          dueTime: "10:00 am",
          assignedBy: "Supervisor",
          taskType: "document",
          status: "done",
          clientSiteId: "234",
        },
      ],
      "237": [
        {
          id: "task_3",
          dueDate: "23/01/25",
          dueTime: "04:35 pm",
          assignedBy: "Office",
          taskType: "document",
          status: "overdue",
          clientSiteId: "237",
        },
      ],
    };

    return mockTasks[clientSiteId] || [];
  },
};

const OfficerClientSitesWindow: React.FC = () => {
  const { officerName } = useParams<{ officerName: string }>();
  const navigate = useNavigate();
  const { getOfficerByName, loading: officerLoading } = useOfficers();

  // State management
  const [clientSites, setClientSites] = useState<ClientSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<ClientSite | null>(null);
  const [tasks, setTasks] = useState<ClientSiteTask[]>([]);
  const [loadingSites, setLoadingSites] = useState<boolean>(false);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TaskStatus>("overdue");

  // Get officer data
  const officerData = getOfficerByName(officerName || "");

  // Load client sites on component mount
  useEffect(() => {
    if (!officerData) return;

    setLoadingSites(true);
    clientSitesService
      .getClientSitesForOfficer(officerData.id)
      .then((sites) => {
        setClientSites(sites);
        // Auto-select first site
        if (sites.length > 0) {
          setSelectedSite(sites[0]);
        }
        setLoadingSites(false);
      })
      .catch((error) => {
        console.error("Error fetching client sites:", error);
        setClientSites([]);
        setLoadingSites(false);
      });
  }, [officerData]);

  // Load tasks when selected site changes
  useEffect(() => {
    if (!selectedSite) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);
    clientSitesService
      .getTasksForClientSite(selectedSite.siteId)
      .then((siteTasks) => {
        setTasks(siteTasks);
        setLoadingTasks(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        setLoadingTasks(false);
      });
  }, [selectedSite]);

  // Handle site selection
  const handleSiteClick = (site: ClientSite) => {
    setSelectedSite(site);
  };

  // Handle Add Task button click
  const handleAddNewTask = () => {
    navigate("/add-task");
  };

  // Get task icon based on type
  const getTaskIcon = (taskType: string) => {
    const iconProps = { sx: { width: 16, height: 16, color: "#2A77D5" } };

    switch (taskType) {
      case "site_visit":
        return <HomeWorkIcon {...iconProps} />;
      case "training":
        return <SearchIcon {...iconProps} />; // Using Search as substitute for frame_inspect
      case "document":
        return <DescriptionIcon {...iconProps} />;
      case "inspection":
        return <MilitaryTechIcon {...iconProps} />;
      case "other":
        return <DashboardCustomizeIcon {...iconProps} />;
      default:
        return <DashboardCustomizeIcon {...iconProps} />;
    }
  };

  // Filter tasks by status
  const overdueTasks = tasks.filter((task) => task.status === "overdue");
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const doneTasks = tasks.filter((task) => task.status === "done");

  // Get current tasks based on active tab
  const getCurrentTasks = () => {
    switch (activeTab) {
      case "overdue":
        return overdueTasks;
      case "pending":
        return pendingTasks;
      case "done":
        return doneTasks;
      default:
        return overdueTasks;
    }
  };

  const currentTasks = getCurrentTasks();

  // Show loading state
  if (officerLoading || !officerData) {
    return (
      <Box
        sx={{
          width: "1052px",
          height: "840px",
          padding: "16px",
          borderRadius: "12px",
          background: "#F7F7F7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "1052px",
          height: "840px",
          padding: "16px",
          borderRadius: "12px",
          background: "#F7F7F7",
          boxShadow: "0px 1px 4px 0px #4E515F0F",
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
          {/* Content Heading */}
          <Box
            sx={{
              width: "1020px",
              height: "32px",
              gap: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Frame 1 - Title */}
            <Box
              sx={{
                width: "766px",
                height: "24px",
                gap: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  width: "117px",
                  height: "24px",
                  paddingTop: "5px",
                  paddingBottom: "4px",
                  gap: "10px",
                  fontFamily: "Mukta",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0%",
                  textTransform: "capitalize",
                  color: "#3B3B3B",
                }}
              >
                Client Sites
              </Typography>
            </Box>

            {/* Frame 2 – Add Task Button */}
            <Box
              sx={{
                width: 246,
                height: 32,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                startIcon={<AddIcon sx={{ width: 16, height: 16, color: "#2A77D5" }} />}
                onClick={handleAddNewTask}
                sx={{
                  width: 112,
                  height: 32,
                  gap: 1.5,
                  borderRadius: 1.5,
                  px: 2,
                  bgcolor: "#FFFFFF",
                  boxShadow: "0px 1px 4px 0px #70707033",
                  textTransform: "uppercase",
                  fontFamily: "Mukta",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "16px",
                  color: "#2A77D5",
                  "&:hover": { bgcolor: "#F5F5F5" },
                }}
              >
                ADD&nbsp;TASK
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Divider
            sx={{
              width: "1020px",
              borderWidth: "1px",
              border: "1px solid #FFFFFF",
            }}
          />

          {/* Content */}
          <Box
            sx={{
              width: "1020px",
              height: "752px",
              display: "flex",
            }}
          >
            {/* Table */}
            <Box
              sx={{
                width: "536px",
                height: "752px",
                borderWidth: "1px",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                background: "#F7F7F7",
                border: "1px solid #F0F0F0",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                  backgroundColor: "#F7F7F7",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#dddddd",
                    borderRadius: "4px",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "60px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Site ID
                      </TableCell>
                      <TableCell sx={{ width: "80px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Client
                      </TableCell>
                      <TableCell sx={{ width: "120px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Site Name
                      </TableCell>
                      <TableCell sx={{ width: "60px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ width: "50px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Posts
                      </TableCell>
                      <TableCell sx={{ width: "80px", fontFamily: "Mukta", fontWeight: 600, fontSize: "12px" }}>
                        Guard Count
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingSites ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : clientSites.length > 0 ? (
                      clientSites.map((site) => (
                        <TableRow
                          key={site.siteId}
                          hover
                          selected={selectedSite?.siteId === site.siteId}
                          onClick={() => handleSiteClick(site)}
                          sx={{
                            cursor: "pointer",
                            "&.Mui-selected": {
                              backgroundColor: "rgba(42, 119, 213, 0.1)",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(42, 119, 213, 0.05)",
                            },
                          }}
                        >
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px" }}>{site.siteId}</TableCell>
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px" }}>{site.client}</TableCell>
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px" }}>{site.siteName}</TableCell>
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px" }}>{site.type}</TableCell>
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px", textAlign: "center" }}>
                            {site.posts}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "Mukta", fontSize: "14px", textAlign: "center" }}>
                            {site.guardCount}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography sx={{ color: "#707070", fontFamily: "Mukta" }}>No client sites found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Tasks Card */}
            <Box
              sx={{
                width: "482px",
                height: "752px",
                gap: "16px",
                padding: "16px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedSite ? (
                <>
                  {/* Heading */}
                  <Box
                    sx={{
                      width: "450px",
                      height: "16px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "44px",
                        height: "16px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        gap: "10px",
                        fontFamily: "Mukta",
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "20px",
                        letterSpacing: "0%",
                        textTransform: "capitalize",
                        color: "#3B3B3B",
                      }}
                    >
                      TASKS
                    </Typography>
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      width: "450px",
                      height: "688px",
                      gap: "12px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Tab Container */}
                    <Box
                      sx={{
                        width: "450px",
                        height: "56px",
                        gap: "40px",
                        borderRadius: "10px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Tab Frame */}
                      <Box
                        sx={{
                          width: "450px",
                          height: "48px",
                          padding: "8px",
                          gap: "8px",
                          borderRadius: "11px",
                          background: "#F7F7F7",
                          display: "flex",
                        }}
                      >
                        {/* OVERDUE Tab */}
                        <Box
                          onClick={() => setActiveTab("overdue")}
                          sx={{
                            width: "139.33px",
                            height: "32px",
                            borderRadius: "8px",
                            paddingTop: "8px",
                            paddingRight: "24px",
                            paddingBottom: "8px",
                            paddingLeft: "24px",
                            backgroundColor: activeTab === "overdue" ? "#1D68C3" : "#FFFFFF",
                            boxShadow: "0px 1px 4px 0px #70707033",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <WarningIcon
                            sx={{
                              width: "16px",
                              height: "16px",
                              color: activeTab === "overdue" ? "#FFFFFF" : "#2A77D5",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 500,
                                fontSize: "16px",
                                lineHeight: "24px",
                                textTransform: "uppercase",
                                color: activeTab === "overdue" ? "#FFFFFF" : "#2A77D5",
                              }}
                            >
                              OVERDUE
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: activeTab === "overdue" ? "#FFFFFF" : "#2A77D5",
                                paddingTop: "3px",
                                paddingBottom: "3px",
                              }}
                            >
                              ({overdueTasks.length.toString().padStart(2, "0")})
                            </Typography>
                          </Box>
                        </Box>

                        {/* PENDING Tab */}
                        <Box
                          onClick={() => setActiveTab("pending")}
                          sx={{
                            width: "139.33px",
                            height: "32px",
                            padding: "8px",
                            borderRadius: "8px",
                            backgroundColor: activeTab === "pending" ? "#1D68C3" : "#FFFFFF",
                            boxShadow: "0px 1px 4px 0px #70707033",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <AssignmentIcon
                            sx={{
                              width: "16px",
                              height: "16px",
                              color: activeTab === "pending" ? "#FFFFFF" : "#2A77D5",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 500,
                                fontSize: "16px",
                                lineHeight: "24px",
                                textTransform: "uppercase",
                                color: activeTab === "pending" ? "#FFFFFF" : "#2A77D5",
                              }}
                            >
                              PENDING
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: activeTab === "pending" ? "#FFFFFF" : "#2A77D5",
                                paddingTop: "3px",
                                paddingBottom: "3px",
                              }}
                            >
                              ({pendingTasks.length.toString().padStart(2, "0")})
                            </Typography>
                          </Box>
                        </Box>

                        {/* DONE Tab */}
                        <Box
                          onClick={() => setActiveTab("done")}
                          sx={{
                            width: "139.33px",
                            height: "32px",
                            borderRadius: "8px",
                            paddingTop: "8px",
                            paddingRight: "24px",
                            paddingBottom: "8px",
                            paddingLeft: "24px",
                            backgroundColor: activeTab === "done" ? "#1D68C3" : "#FFFFFF",
                            boxShadow: "0px 1px 4px 0px #70707033",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <CheckCircleIcon
                            sx={{
                              width: "16px",
                              height: "16px",
                              color: activeTab === "done" ? "#FFFFFF" : "#2A77D5",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 500,
                                fontSize: "16px",
                                lineHeight: "24px",
                                textTransform: "uppercase",
                                color: activeTab === "done" ? "#FFFFFF" : "#2A77D5",
                              }}
                            >
                              DONE
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Mukta",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: activeTab === "done" ? "#FFFFFF" : "#2A77D5",
                                paddingTop: "3px",
                                paddingBottom: "3px",
                              }}
                            >
                              ({doneTasks.length.toString().padStart(2, "0")})
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Table Heading */}
                    <Box
                      sx={{
                        width: "450px",
                        height: "16px",
                        gap: "8px",
                        borderRadius: "8px",
                        paddingRight: "16px",
                        paddingLeft: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          width: "201px",
                          height: "16px",
                          gap: "10px",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontFamily: "Mukta",
                          fontWeight: 500,
                          fontSize: "12px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                          textTransform: "capitalize",
                          color: "#3B3B3B",
                        }}
                      >
                        DUE ON
                      </Typography>

                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "16px",
                          gap: "10px",
                        }}
                      />

                      <Typography
                        sx={{
                          width: "201px",
                          height: "16px",
                          gap: "10px",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          fontFamily: "Mukta",
                          fontWeight: 500,
                          fontSize: "12px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                          textTransform: "capitalize",
                          color: "#3B3B3B",
                        }}
                      >
                        ASSIGNED BY
                      </Typography>
                    </Box>

                    {/* Tasks List */}
                    {loadingTasks ? (
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : currentTasks.length > 0 ? (
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {currentTasks.map((task) => (
                          <Box
                            key={task.id}
                            sx={{
                              width: "450px",
                              height: "72px",
                              gap: "8px",
                              borderRadius: "10px",
                              border: "1px solid #F0F0F0",
                              boxShadow: "0px 1px 4px 0px #70707033",
                            }}
                          >
                            <Box
                              sx={{
                                width: "450px",
                                height: "72px",
                                borderRadius: "16px",
                                background: "#FFFFFF",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* Info Row */}
                              <Box
                                sx={{
                                  width: "450px",
                                  height: "40px",
                                  paddingRight: "16px",
                                  paddingLeft: "16px",
                                  gap: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* Date & Time */}
                                <Box
                                  sx={{
                                    width: "205px",
                                    height: "40px",
                                    paddingTop: "12px",
                                    paddingBottom: "12px",
                                    gap: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "205px",
                                      height: "16px",
                                      gap: "8px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        width: "51px",
                                        height: "16px",
                                        paddingTop: "3px",
                                        paddingBottom: "4px",
                                        fontFamily: "Mukta",
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        color: "#3B3B3B",
                                      }}
                                    >
                                      {task.dueDate}
                                    </Typography>

                                    <Divider
                                      orientation="vertical"
                                      sx={{
                                        height: "16px",
                                        gap: "10px",
                                      }}
                                    />

                                    <Typography
                                      sx={{
                                        width: "55px",
                                        height: "16px",
                                        paddingTop: "3px",
                                        paddingBottom: "4px",
                                        fontFamily: "Mukta",
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        color: "#3B3B3B",
                                      }}
                                    >
                                      {task.dueTime}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Assigned By */}
                                <Box
                                  sx={{
                                    width: "205px",
                                    height: "40px",
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    gap: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      width: "205px",
                                      height: "16px",
                                      paddingTop: "3px",
                                      paddingBottom: "3px",
                                      gap: "10px",
                                      fontFamily: "Mukta",
                                      fontWeight: 400,
                                      fontSize: "16px",
                                      lineHeight: "24px",
                                      letterSpacing: "0%",
                                      textAlign: "center",
                                      color: "#3B3B3B",
                                    }}
                                  >
                                    {task.assignedBy}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Tasks (Icons) */}
                              <Box
                                sx={{
                                  width: "450px",
                                  height: "32px",
                                  paddingTop: "6px",
                                  paddingRight: "16px",
                                  paddingBottom: "6px",
                                  paddingLeft: "24px",
                                  gap: "32px",
                                  borderBottomRightRadius: "16px",
                                  borderBottomLeftRadius: "16px",
                                  background: "#F1F7FE",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {getTaskIcon(task.taskType)}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                        <Box
                          sx={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            backgroundColor: "#F0F0F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ fontSize: "32px", color: "#CCCCCC" }}>✓</Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: "Mukta",
                            fontWeight: 400,
                            fontSize: "16px",
                            color: "#CCCCCC",
                            textAlign: "center",
                          }}
                        >
                          NO {activeTab.toUpperCase()} TASKS
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Mukta",
                      fontSize: "16px",
                      color: "#CCCCCC",
                      textAlign: "center",
                    }}
                  >
                    Select a client site to view tasks
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OfficerClientSitesWindow;
