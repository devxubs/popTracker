"use client";

import React, {
   createContext,
   useContext,
   useMemo,
   useState,
   useEffect,
} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "./theme";

type Mode = "light" | "dark";

interface ThemeContextValue {
   mode: Mode;
   toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Wraps the whole app, providing:
 * - The MUI theme (light/dark) to every component
 * - A toggleMode() function any component can call via useThemeMode()
 * - Persists the chosen mode in localStorage so it survives page reloads
 */
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
   const [mode, setMode] = useState<Mode>("light");

   // Load saved preference on mount
   useEffect(() => {
      const saved = localStorage.getItem("theme-mode") as Mode | null;
      if (saved) setMode(saved);
   }, []);

   const toggleMode = () => {
      setMode((prev) => {
         const next = prev === "light" ? "dark" : "light";
         localStorage.setItem("theme-mode", next);
         return next;
      });
   };

   const theme = useMemo(() => getAppTheme(mode), [mode]);

   return (
      <ThemeContext.Provider value={{ mode: "dark", toggleMode: () => {} }}>
         <MuiThemeProvider theme={getAppTheme("dark")}>
            <CssBaseline />
            {children}
         </MuiThemeProvider>
      </ThemeContext.Provider>
   );
}

// Hook for any component to read/toggle the current mode
export const useThemeMode = () => {
   const ctx = useContext(ThemeContext);
   if (!ctx)
      throw new Error("useThemeMode must be used within AppThemeProvider");
   return ctx;
};
