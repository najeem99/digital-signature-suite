import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface AppNavbarProps {
  open: boolean;
  toggleDrawer: () => void;
  role: "uploader" | "signer";
  drawerWidth: number;
  collapsedWidth: number;
}

const AppNavbar = ({ open, toggleDrawer, role, drawerWidth, collapsedWidth }: AppNavbarProps) => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
        transition: "margin 0.3s",
        backdropFilter: "blur(8px)", // frosted glass effect
        backgroundColor: "rgba(26, 115, 232, 0.85)", // semi-transparent corporate blue
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Time */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ mr: 3, fontWeight: 500 }}>
            {time}
          </Typography>

          {/* Drawer toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{
              mr: 2,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            Digital Signature Suite 
          </Typography>
        </Box>

        {/* Right placeholder: can add user avatar, notifications */}
        <Box>
          {/* Future: notifications or user menu */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
