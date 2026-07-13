import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, AppTheme } from "../lib/theme";

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => (scheme === "dark" ? darkTheme : lightTheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
