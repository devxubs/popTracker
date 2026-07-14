"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Box, Avatar, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "@/theme/ThemeProvider";
import { SIDEBAR_WIDTH } from "./Sidebar";

export default function Topbar() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", gap: 1 }}>
        <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
        <Box>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>P</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
