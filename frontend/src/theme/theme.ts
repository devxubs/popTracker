import { createTheme, ThemeOptions } from "@mui/material/styles";
import typography from "./typography";
import { lightShadows, darkShadows } from "./shadow";
import darkPalette from "./darkPalette";
import lightPalette from "./lightPalette";

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
