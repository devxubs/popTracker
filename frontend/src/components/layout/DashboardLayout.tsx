"use client";

import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Wraps every page's content with the persistent Sidebar + Topbar,
 * so individual pages only need to render their own content.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
        <Topbar />
        <Toolbar /> {/* spacer so content starts below the fixed AppBar */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
