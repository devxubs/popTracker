"use client";

import React from "react";
import {
   Drawer,
   List,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Toolbar,
   Box,
   Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSaleOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import SavingsIcon from "@mui/icons-material/SavingsOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import AssessmentIcon from "@mui/icons-material/AssessmentOutlined";
import { usePathname, useRouter } from "next/navigation";

export const SIDEBAR_WIDTH = 240;

// Single source of truth for nav items — add a module here and it shows up in the sidebar
const navItems = [
   { label: "Dashboard", href: "/", icon: <DashboardIcon /> },
   { label: "Products", href: "/products", icon: <Inventory2Icon /> },
   { label: "Sales", href: "/sales", icon: <PointOfSaleIcon /> },
   { label: "Expenses", href: "/expenses", icon: <ReceiptLongIcon /> },
   { label: "Investments", href: "/investments", icon: <SavingsIcon /> },
   { label: "Withdraws", href: "/withdraws", icon: <PaymentsIcon /> },
   { label: "Reports", href: "/reports", icon: <AssessmentIcon /> },
];

export default function Sidebar() {
   const pathname = usePathname();
   const router = useRouter();

   return (
      <Drawer
         variant="permanent"
         sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            display: { xs: "none", md: "block" }, // hidden on mobile, replaced by drawer toggle
            [`& .MuiDrawer-paper`]: {
               width: SIDEBAR_WIDTH,
               boxSizing: "border-box",
               borderRight: "1px solid",
               borderColor: "divider",
            },
         }}
      >
         <Toolbar sx={{ px: 3 }}>
            <Typography variant="h6" fontWeight={700} color="primary">
               POP Tracker
            </Typography>
         </Toolbar>
         <Box sx={{ overflow: "auto", px: 0 }}>
            <List>
               {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <ListItemButton
                        key={item.href}
                        selected={isActive}
                        onClick={() => router.push(item.href)}
                        sx={{
                           // borderRadius: 2,
                           mb: 0.5,
                           "&.Mui-selected": {
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": { bgcolor: "primary.dark" },
                              "& .MuiListItemIcon-root": {
                                 color: "primary.contrastText",
                              },
                           },
                        }}
                     >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                           {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                     </ListItemButton>
                  );
               })}
            </List>
         </Box>
      </Drawer>
   );
}
