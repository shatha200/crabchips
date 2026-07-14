import { useEffect } from "react";
import { Platform } from "react-native";
import { useAppTheme } from "../contexts/ThemeContext";

const STYLE_ID = "web-global-overrides";

// Fixes things that only show up when this app runs as a web build:
// 1. Chrome/Safari/Firefox all paint autofilled inputs with their own pale
//    yellow/blue background + text color, ignoring our theme entirely — the
//    only reliable fix is a huge inset box-shadow trick that repaints over it.
// 2. Adds font smoothing + a slim custom scrollbar so it doesn't look like a
//    bare, unstyled web page around the mobile-shaped UI.
// 3. Smooths hover/press transitions on interactive elements.
export function WebGlobalStyles() {
  const theme = useAppTheme();

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      html, body, #root {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px ${theme.surface} inset !important;
        -webkit-text-fill-color: ${theme.textPrimary} !important;
        caret-color: ${theme.textPrimary};
        transition: background-color 5000s ease-in-out 0s;
      }

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: ${theme.border};
        border-radius: 8px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.textSecondary};
      }

      a, button, [role="button"] {
        transition: opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: ${theme.border} transparent;
      }
    `;
  }, [theme]);

  return null;
}
