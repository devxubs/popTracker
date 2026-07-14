import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "node_modules/@mui/material/esm/IconButton/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

interface ActionMenuProps {
   menuOptions: {
      label: string;
      color?: "primary" | "secondary" | "error" | "success";
      icon?: React.ReactNode;
      onClick: () => void;
   }[];
}

export default function ActionMenu({ menuOptions }: ActionMenuProps) {
   const theme = useTheme();
   const id = React.useId();
   const buttonId = `${id}-button`;
   const menuId = `${id}-menu`;
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <div>
         <IconButton
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            onClick={handleClick}
         >
            <MoreVertIcon />
         </IconButton>
         <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{
               horizontal: "left",
               vertical: "top",
            }}
            sx={{
               "& .MuiList-root": {
                  position: "relative",
                  overflow: "hidden",
                  background: theme.palette.background.paper,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow:
                     "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                  backgroundImage:
                     "radial-gradient(circle at 20% 20%, rgba(0, 184, 217, 0.15) 0%, transparent 40% ), radial-gradient( circle at 80% 80%, rgba(255, 86, 48, 0.15) 0%, transparent 40% ), radial-gradient( circle at 50% 50%, rgba(0, 167, 111, 0.08) 0%, transparent 70% )",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
               },
               "& .MuiList-root::before": {
                  content: '""',
                  position: "absolute",
                  inset: "0",
                  pointerEvents: "none",
                  background:
                     "radial-gradient(circle at top left,      rgba(0, 184, 217, 0.18),      transparent 45%),  radial-gradient(circle at bottom right,      rgba(255, 86, 48, 0.18),      transparent 45%),  radial-gradient(circle at center,      rgba(255, 255, 255, 0.08),      transparent 70%)",
                  mixBlendMode: "screen",
               },
            }}
         >
            {menuOptions.map((option, index) => {
               const { label, color = "primary", icon, onClick } = option;

               return (
                  <MenuItem
                     key={index}
                     onClick={() => {
                        handleClose();
                        onClick();
                     }}
                     sx={{ color: `${color}.main`, width: 200 }}
                  >
                     <ListItemIcon>{icon}</ListItemIcon>
                     <Typography variant="subtitle2">{label}</Typography>
                  </MenuItem>
               );
            })}
         </Menu>
      </div>
   );
}
