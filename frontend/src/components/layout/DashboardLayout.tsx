"use client";

import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Wraps every page's content with the persistent Sidebar + Topbar,
 * so individual pages only need to render their own content.
 */
export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <Box
         sx={{
            display: "flex",
            background: "#1c252e",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundImage:
               "radial-gradient(\n      circle at 20% 20%,\n      rgba(0, 184, 217, 0.15) 0%,\n      transparent 40%\n    ),\n    radial-gradient(\n      circle at 80% 80%,\n      rgba(255, 86, 48, 0.15) 0%,\n      transparent 40%\n    ),\n    radial-gradient(\n      circle at 50% 50%,\n      rgba(0, 167, 111, 0.08) 0%,\n      transparent 70%\n    )",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
         }}
      >
         <Sidebar />
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               minHeight: "100vh",
               // bgcolor: "background.default",
            }}
         >
            <Topbar />
            <Toolbar />
            {/* {/* spacer so content starts below the fixed AppBar */}
            <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
         </Box>
      </Box>
   );
}
