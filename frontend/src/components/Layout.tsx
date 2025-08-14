import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppNavbar from "./AppNavbar";

// Drawer widths
const drawerWidth = 207;
const collapsedWidth = 60;

export interface MenuItem {
  label: string;
  action: "navigate" | "logout";
  path?: string;
  icon?: React.ReactNode;
  roles?: ("uploader" | "signer")[];
}

export const menuItems: MenuItem[] = [
  { label: "Home", action: "navigate", path: "/home", icon: <DescriptionIcon />, roles: ["uploader"] },
  // { label: "View PDF", action: "navigate", path: "/view-pdf", icon: <DescriptionIcon />, roles: ["uploader", "signer"] },
  { label: "Add new Doc", action: "navigate", path: "/pdf-sign-marker", icon: <DescriptionIcon />, roles: ["uploader"] },
  { label: "Uploader Dashboard", action: "navigate", path: "/dashboard-uploader", icon: <DashboardIcon />, roles: ["uploader"] },
  { label: "Signer Dashboard", action: "navigate", path: "/dashboard-signer", icon: <DashboardIcon />, roles: ["signer"] },
  { label: "Logout", action: "logout", icon: <ExitToAppIcon />, roles: ["uploader", "signer"] },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpen((prev) => !prev);

  if (!user?.token) return <Box>{children}</Box>;

  const filteredMenu = menuItems.filter((item) => item.roles?.includes(user.role));

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <AppNavbar
        open={open}
        toggleDrawer={toggleDrawer}
        role={user.role}
        // drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
      />

      <div style={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: open ? drawerWidth : collapsedWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: "width 0.3s",
            },
          }}
        >
          <List sx={{ mt: 10 }}>
            {filteredMenu.map((item) => (
              <Tooltip key={item.label} title={!open ? item.label : ""} placement="right">
                <ListItemButton
                  sx={{ justifyContent: open ? "initial" : "center", px: 2.5 }}
                  onClick={() => {
                    if (item.action === "logout") logout();
                    else if (item.action === "navigate" && item.path) navigate(item.path);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            border: "1px solid #e0e0e0",
            flexGrow: 1,
            marginTop: "64px",
            transition: "margin 0.3s",
          }}
        >
          {children}
        </Box>
      </div>


    </Box>
  );
};

export default Layout;
