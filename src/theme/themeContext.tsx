"use client";

import React, { createContext, useMemo, useState, useContext, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  toggleTheme: () => void;
  mode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: "light",
});

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }: any) {

  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("app-theme") as ThemeMode) || "dark";
    }
    return "dark";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";

      localStorage.setItem("app-theme", newTheme);

      return newTheme;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#5B8CFF",
          },
        },
      }),
    [mode]
  );

  if (!mounted) {
    return null; // or a loading spinner, but null to avoid flash
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}