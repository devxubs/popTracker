import { createTheme, ThemeOptions } from "@mui/material/styles";
import typography from "./typography";
import { lightShadows, darkShadows } from "./shadow";
import darkPalette from "./darkPalette";
import lightPalette from "./lightPalette";

// Shared design tokens (typography, shape) used by both light and dark palettes
const baseOptions: ThemeOptions = {
   typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
   },
   shape: {
      borderRadius: 12,
   },
   components: {
      MuiCard: {
         styleOverrides: {
            root: {
               boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
               border: "1px solid",
            },
         },
      },
      MuiButton: {
         styleOverrides: {
            root: {
               textTransform: "none",
               fontWeight: 600,
            },
         },
      },
   },
};

export const getAppTheme = (mode: "light" | "dark") =>
   createTheme({
      palette: {
         ...(mode === "light" ? { ...lightPalette } : { ...darkPalette }),
         mode,
      },
      typography,
      shape: { borderRadius: 12 },
      shadows: mode === "light" ? lightShadows : darkShadows,
      components: {
         MuiTooltip: {
            styleOverrides: {
               tooltip: {
                  borderRadius: "6px",
               },
            },
         },
      },
   });
