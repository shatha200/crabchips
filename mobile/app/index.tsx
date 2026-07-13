import { Redirect } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { LoadingSpinner } from "../src/components/Common";
import { usePushNotifications } from "../src/hooks/usePushNotifications";

export default function Index() {
  const { session, profile, loading } = useAuth();
  usePushNotifications();

  if (loading) return <LoadingSpinner />;
  if (!session) return <Redirect href="/(auth)/login" />;

  if (profile?.role === "restaurant_owner" || profile?.role === "restaurant_staff") {
    return <Redirect href="/(restaurant)/dashboard" />;
  }
  return <Redirect href="/(customer)/home" />;
}
