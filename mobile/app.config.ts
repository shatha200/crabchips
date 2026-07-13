import "dotenv/config";
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Restaurant App",
  slug: "restaurant-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic", // supports light + dark mode
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#FF6B35",
  },
  scheme: "restaurantapp",
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#FF6B35",
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.chadha.restaurantapp",
  },
  android: {
    package: "com.chadha.restaurantapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FF6B35",
    },
    permissions: ["NOTIFICATIONS"],
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
};

export default config;
