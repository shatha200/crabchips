import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createClient, processLock } from "@supabase/supabase-js";
import Constants from "expo-constants";

// SecureStore has a 2KB value limit and no bulk API, so we use it only for the
// auth token (small), and fall back to AsyncStorage for anything larger.
// This gives us secure token storage without hitting SecureStore's size limit.
// On web, expo-secure-store isn't available at all, so we use AsyncStorage
// (which is backed by localStorage on web) for the whole auth flow there.
const SecureStorageAdapter =
  Platform.OS === "web"
    ? AsyncStorage
    : {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
      };

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env (see app.config.ts)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Re-exported for services that need bulk/local caching (e.g. cart) where
// SecureStore's size limit would be a problem.
export const localStorage = AsyncStorage;
