import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, AppTheme } from "../lib/theme";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: AppTheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "@theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    // Load persisted theme preference
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setThemeModeState(value as ThemeMode);
      }
    });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }
  };

  const activeTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): AppTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context.theme;
}

export function useThemeToggle() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeToggle must be used within a ThemeProvider");
  }
  return {
    themeMode: context.themeMode,
    setThemeMode: context.setThemeMode,
  };
}
