import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Web build: deliberately does NOT import expo-secure-store. That package
// calls requireNativeModule('ExpoSecureStore') at import time, which on web
// resolves to a shim that's just `export default {}` — not a class — and
// Expo's web module registration crashes immediately on load ("Module
// implementation must be a class"), taking down the whole app before it can
// render anything. AsyncStorage (backed by localStorage on web) is fine here.

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env (see app.config.ts)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

export const localStorage = AsyncStorage;
