import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";
import CalendarViewWeekOutlinedIcon from "@mui/icons-material/CalendarViewWeekOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Button, Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useClientContext, type ViewType } from "../context/ClientContext";
import { formatDate, getWeekRange } from "../utils/dateRangeUtils";

interface SideNavItem {
  label: string;
  link?: string;
  submenu?: SideNavItem[];
}

const drawerWidth = 240;

export default function ClientSidebar({ children }: { children: React.ReactNode }) {
  const [statsOpen, setStatsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { clientId } = useParams();

  const { selectedView, setSelectedView, selectedSite, currentDate, clientDetails, isLoadingClient } =
    useClientContext();

  const toggleStats = () => {
    setStatsOpen(!statsOpen);
  };

  const isActive = (item: SideNavItem): boolean => {
    if (item.link && location.pathname === item.link) {
      return true;
    }
    return false;
  };

  const isSubItemActive = (link: string): boolean => {
    return location.pathname === link;
  };

  const sideNav: SideNavItem[] = [
    {
      label: "PERFORMANCE",
      submenu: [
        {
          label: "Guards Defaults",
          link: `/clients/${clientId}/performance/guards-defaults`,
        },
        {
          label: "Incident Reports",
          link: `/clients/${clientId}/performance/incident-reports`,
        },
        {
          label: "Area officers Tasks",
          link: `/clients/${clientId}/performance/area-officers-tasks`,
        },
        {
          label: "Guards Tasks",
          link: `/clients/${clientId}/performance/guards-tasks`,
        },
      ],
    },
    {
      label: "GUARDS",
      link: `/clients/${clientId}/guards`,
    },
    {
      label: "AREA OFFICERS",
      link: `/clients/${clientId}/area-officers`,
    },
    {
      label: "SITES",
      link: `/clients/${clientId}/sites`,
    },
    {
      label: "PROFILE",
      link: `/clients/${clientId}/profile`,
    },
  ];

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
  };

  const handleSiteChange = () => {
    console.log("Site selector clicked");
  };

  const currentFormatted = formatDate(currentDate);
  const todayString = `${currentFormatted.dayName} ${currentFormatted.day}/${currentFormatted.month}/${currentFormatted.year}`;
  const weekString = getWeekRange(currentDate);
  const monthString = `${currentFormatted.monthName} ${currentFormatted.year}`;

  const getButtonStyles = (isSelected: boolean) => ({
    bgcolor: isSelected ? "#2A77D5" : "white",
    color: isSelected ? "white" : "#2A77D5",
    border: "1px solid #2A77D5",
    "&:hover": {
      bgcolor: isSelected ? "#1E5A96" : "#E3F2FD",
    },
  });

  const shouldShowViewButtons = location.pathname.includes("/performance/");

  return (
    <Box sx={{ display: "flex", position: "relative", height: "100%" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            height: "100%",
            border: 0,
            boxShadow: 0,
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <div className="flex flex-col items-center mt-4 gap-1">
          <Avatar
            src={clientDetails?.clientLogo || ""}
            alt={clientDetails?.clientName || ""}
            sx={{ width: "60px", height: "60px" }}
          />
          <span className="font-semibold">
            {isLoadingClient ? "Loading..." : clientDetails?.clientName || "Client Name"}
          </span>
          <span>Client ID: {clientId}</span>
        </div>
        <List sx={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {sideNav.map((item, index) => {
            const itemIsActive = isActive(item);
            return (
              <div key={index} style={{ marginRight: itemIsActive ? 0 : 16 }}>
                <ListItem
                  disablePadding
                  sx={{
                    display: "block",
                  }}
                >
                  <ListItemButton
                    onClick={item.submenu ? toggleStats : () => navigate(item.link!)}
                    sx={{
                      padding: 0,
                      bgcolor: "#F7F7F7",
                      ...(itemIsActive
                        ? {
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                            color: "#ffffff",
                          }
                        : {
                            borderRadius: "8px",
                          }),
                      p: 1,
                      pr: 2,
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          bgcolor: itemIsActive ? "#2A77D5" : "transparent",
                          px: 2,
                          py: 1,
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {item.submenu && (
                  <Collapse in={statsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4, bgcolor: "#F7F7F7" }}>
                      {item.submenu.map((subItem, subIndex) => {
                        const subItemIsActive = isSubItemActive(subItem.link!);
                        return (
                          <div key={subIndex} style={{ marginRight: subItemIsActive ? 0 : 16 }}>
                            <ListItem disablePadding sx={{ display: "block" }}>
                              <ListItemButton
                                onClick={() => navigate(subItem.link!)}
                                sx={{
                                  padding: 0,
                                  bgcolor: "transparent",
                                  ...(subItemIsActive
                                    ? {
                                        borderTopLeftRadius: "8px",
                                        borderBottomLeftRadius: "8px",
                                        color: "#ffffff",
                                      }
                                    : {
                                        borderRadius: "8px",
                                      }),
                                  p: 1,
                                  pr: 2,
                                }}
                              >
                                <ListItemText
                                  primary={`\u2022 ${subItem.label}`}
                                  slotProps={{
                                    primary: {
                                      whiteSpace: "nowrap",
                                      bgcolor: subItemIsActive ? "#2A77D5" : "transparent",
                                      px: 2,
                                      py: 1,
                                      borderRadius: "8px",
                                    },
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          </div>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </div>
            );
          })}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#F7F7F7",
          height: "100%",
          overflow: "auto",
          p: 2,
          borderRadius: "12px",
        }}
      >
        {shouldShowViewButtons && (
          <div className="inline-flex justify-between w-full">
            <Button variant="contained" size="small" onClick={handleSiteChange}>
              <HomeWorkOutlinedIcon sx={{ mr: 1 }} />
              {selectedSite}
              <KeyboardArrowDownIcon sx={{ ml: 1 }} />
            </Button>

            <div className="flex flex-row gap-4">
              <Button
                variant="outlined"
                size="small"
                sx={getButtonStyles(selectedView === "day")}
                onClick={() => handleViewChange("day")}
              >
                <EventOutlinedIcon sx={{ mr: 1 }} />
                {selectedView === "day" ? `DAY | ${todayString}` : "DAY"}
              </Button>

              <Button
                variant="outlined"
                size="small"
                sx={getButtonStyles(selectedView === "week")}
                onClick={() => handleViewChange("week")}
              >
                <CalendarViewWeekOutlinedIcon sx={{ mr: 1 }} />
                {selectedView === "week" ? `WEEK | ${weekString}` : "WEEK"}
              </Button>

              <Button
                variant="outlined"
                size="small"
                sx={getButtonStyles(selectedView === "month")}
                onClick={() => handleViewChange("month")}
              >
                <CalendarViewMonthOutlinedIcon sx={{ mr: 1 }} />
                {selectedView === "month" ? `MONTH | ${monthString}` : "MONTH"}
              </Button>

              <Button
                variant="outlined"
                size="small"
                sx={getButtonStyles(selectedView === "custom")}
                onClick={() => handleViewChange("custom")}
              >
                <CalendarMonthOutlinedIcon sx={{ mr: 1 }} />
                CUSTOM
              </Button>
            </div>
          </div>
        )}
        {children}
      </Box>
    </Box>
  );
}
