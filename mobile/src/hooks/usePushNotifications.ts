import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Registers this device for push notifications and stores the Expo push
// token in Supabase (push_tokens table) so an Edge Function can send to it
// on order-status changes. Call this once near the app root, after login.
export function usePushNotifications() {
  const { session } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    if (!session || registered.current) return;
    registered.current = true;

    (async () => {
      if (!Device.isDevice) return; // push tokens require a physical device

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });

      await supabase.from("push_tokens").upsert(
        {
          user_id: session.user.id,
          expo_token: tokenResponse.data,
          platform: Platform.OS,
        },
        { onConflict: "expo_token" }
      );

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("order-updates", {
          name: "Order updates",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
    })();
  }, [session]);
}
