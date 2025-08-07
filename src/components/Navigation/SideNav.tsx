import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import { AppBar, Avatar, IconButton, InputBase, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = "7rem";

interface SdieNavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const sideNavItems: SdieNavItem[] = [
  { label: "Dashboard", icon: <GridViewOutlinedIcon />, path: "/dashboard" },
  { label: "Clients", icon: <HandshakeOutlinedIcon />, path: "/clients" },
  {
    label: "Guards",
    icon: <AdminPanelSettingsOutlinedIcon />,
    path: "/guards",
  },
  {
    label: "Officers",
    icon: <SupervisorAccountOutlinedIcon />,
    path: "/officers",
  },
  { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/settings" },
];

export default function SideNav({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        mb: 2,
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth})`,
          ml: drawerWidth,
          bgcolor: "transparent",
          boxShadow: 0,
        }}
      >
        <Toolbar>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
              height: 40,
              borderRadius: "0.2rem",
              bgcolor: "#F0F0F0A3",
              ml: "auto",
              border: "1px solid #C2DBFA",
              boxShadow: 0,
            }}
          >
            <IconButton type="button" sx={{ p: "10px", color: "#2A77D5" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                typography: {
                  fontSize: "0.8rem",
                },
              }}
              placeholder="Type Name or ID of Client, Site, or Person to Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Paper>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0 }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            height: "100%",
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "relative",
              height: "100%",
              bgcolor: "#F0F0F0A3",
              borderTopLeftRadius: "1rem",
              borderBottomLeftRadius: "1rem",
              border: 0,
              p: 2,
            },
          }}
          variant="permanent"
          anchor="left"
          open
        >
          <div className="flex flex-col items-center text-center gap-2">
            <Avatar />
            <Typography
              sx={{
                typography: {
                  fontSize: "0.8rem",
                  fontWeight: 600,
                },
              }}
            >
              Gabbar Securities
            </Typography>
          </div>
          <Divider
            sx={{
              my: 4,
              borderColor: "#FFFFFF",
            }}
          />
          <List>
            {sideNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1,
                      bgcolor: isActive ? "white" : "transparent",
                      borderRadius: "0.5rem",
                      "&:hover": {
                        bgcolor: isActive ? "white" : "rgba(255, 255, 255, 0.3)",
                      },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        marginInline: "auto",
                        minWidth: "auto",
                        mb: 1,
                        color: isActive ? "#2A77D5" : "#A3A3A3",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          align: "center",
                          fontSize: "0.8rem",
                          color: isActive ? "#2A77D5" : "#A3A3A3",
                        },
                      }}
                      sx={{ margin: 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider
            sx={{
              my: 2,
              borderColor: "#FFFFFF",
            }}
          />
          <div className="text-[0.6rem] text-[#A3A3A3] flex flex-col items-center mt-auto text-center">
            <span>22/2/2025</span>
            <span>Version v1</span>
            <br />
            <span>© May 2025</span>
            <br />
            <span>ALAN SCOTT UPANDUP LIFE PRIVATE LIMITED</span>
          </div>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#F0F0F0A3",
          p: 1,
          pl: 0,
          borderTopRightRadius: "1rem",
          borderBottomRightRadius: "1rem",
          display: "flex",
          minHeight: "80vh",
          pt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
