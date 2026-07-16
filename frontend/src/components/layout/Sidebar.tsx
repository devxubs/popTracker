"use client";

import React, { useState } from "react";
import {
   Drawer,
   List,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Toolbar,
   Box,
   Typography,
   Stack,
   useTheme,
   IconButton,
   useMediaQuery,
   Icon,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSaleOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import SavingsIcon from "@mui/icons-material/SavingsOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import AssessmentIcon from "@mui/icons-material/AssessmentOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import { usePathname, useRouter } from "next/navigation";
import { Close } from "@mui/icons-material";

export const SIDEBAR_WIDTH = 240;

const navItems = [
   {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <DashboardIcon />,
   },
   {
      label: "Products",
      href: "/admin/products",
      icon: <Inventory2Icon />,
   },
   {
      label: "Sales",
      href: "/admin/sales",
      icon: <PointOfSaleIcon />,
   },
   {
      label: "Expenses",
      href: "/admin/expenses",
      icon: <ReceiptLongIcon />,
   },
   {
      label: "Investments",
      href: "/admin/investments",
      icon: <SavingsIcon />,
   },
   {
      label: "Withdraws",
      href: "/admin/withdraws",
      icon: <PaymentsIcon />,
   },
   {
      label: "Reports",
      href: "/admin/reports",
      icon: <AssessmentIcon />,
   },
];

export default function Sidebar() {
   const pathname = usePathname();
   const router = useRouter();

   const theme = useTheme();
   const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

   const [mobileOpen, setMobileOpen] = useState(false);

   const handleDrawerToggle = () => {
      setMobileOpen((prev) => !prev);
   };

   const handleNavigate = (href: string) => {
      router.push(href);

      if (isMdDown) {
         setMobileOpen(false);
      }
   };

   return (
      <>
         {isMdDown && !mobileOpen && (
            <IconButton
               onClick={handleDrawerToggle}
               color={"inherit"}
               sx={{
                  position: "fixed",
                  top: 12,
                  left: 12,
                  zIndex: 1300,
                  transition: "left 0.3s ease-in-out",
               }}
            >
               <MenuIcon />
            </IconButton>
         )}

         <Drawer
            variant={isMdDown ? "temporary" : "permanent"}
            open={isMdDown ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
               keepMounted: true,
            }}
            slotProps={{
               backdrop: {
                  sx: {
                     zIndex: 1200,
                  },
               },
            }}
            sx={{
               width: SIDEBAR_WIDTH,
               flexShrink: 0,

               "& .MuiDrawer-paper": {
                  width: SIDEBAR_WIDTH,
                  boxSizing: "border-box",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  background: "#1c252e",
                  transition: theme.transitions.create("transform", {
                     easing: theme.transitions.easing.sharp,
                     duration: theme.transitions.duration.enteringScreen,
                  }),
                  "& .MuiDrawer-paper": {
                     zIndex: 1201,
                  },
                  // WebkitBackdropFilter: "blur(20px)",
                  // backgroundImage:
                  //    "radial-gradient(\n      circle at 20% 20%,\n      rgba(0, 184, 217, 0.15) 0%,\n      transparent 40%\n    ),\n    radial-gradient(\n      circle at 80% 80%,\n      rgba(255, 86, 48, 0.15) 0%,\n      transparent 40%\n    ),\n    radial-gradient(\n      circle at 50% 50%,\n      rgba(0, 167, 111, 0.08) 0%,\n      transparent 70%\n    )",
                  // backgroundRepeat: "no-repeat",
                  // backgroundSize: "cover",
                  // position: "relative",
                  // zIndex: -1,
               },
            }}
         >
            <Toolbar
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
               }}
            >
               <Typography variant="h6" fontWeight={700} color="primary">
                  POP Tracker
               </Typography>

               {isMdDown && (
                  <IconButton onClick={handleDrawerToggle}>
                     <Close />
                  </IconButton>
               )}
            </Toolbar>

            <Box sx={{ overflow: "auto" }}>
               <List>
                  {navItems.map((item) => {
                     const isActive = pathname === item.href;

                     return (
                        <ListItemButton
                           key={item.href}
                           selected={isActive}
                           onClick={() => handleNavigate(item.href)}
                           sx={{
                              mb: 0.5,

                              "&.Mui-selected": {
                                 bgcolor: "primary.main",
                                 color: "primary.contrastText",

                                 "&:hover": {
                                    bgcolor: "primary.dark",
                                 },

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
      </>
   );
}
