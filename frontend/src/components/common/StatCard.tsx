"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatCardProps {
   label: string;
   value: string;
   icon: React.ReactNode;
   color?: "primary" | "secondary" | "error" | "success";
}

/**
 * A single dashboard metric card (e.g. "Total Sales: ৳50,000").
 * Reused for every number shown on the Dashboard page.
 */
export default function StatCard({
   label,
   value,
   icon,
   color = "primary",
}: StatCardProps) {
   return (
      <Card
         sx={{
            border: 1,
            borderColor: "background.paper",
            "&:hover": { boxShadow: 15, border: 1, borderColor: "divider" },
         }}
      >
         <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
               sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${color}.main`,
                  color: `${color}.contrastText`,
                  opacity: 0.9,
               }}
            >
               {icon}
            </Box>
            <Box>
               <Typography variant="body2" color="text.secondary">
                  {label}
               </Typography>
               <Typography variant="h5">{value}</Typography>
            </Box>
         </CardContent>
      </Card>
   );
}
