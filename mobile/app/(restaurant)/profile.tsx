import React from "react";
import { View, Text, ScrollView, StyleSheet, Platform, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme, useThemeToggle } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function RestaurantProfileScreen() {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useThemeToggle();
  const { profile, signOut } = useAuth();

  const onLogout = () => {
    const performSignOut = async () => {
      await signOut();
    };

    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
      if (confirmLogout) {
        performSignOut();
      }
    } else {
      Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: performSignOut },
      ]);
    }
  };

  const roleLabel = profile?.role === "restaurant_owner" ? "Propriétaire" : "Personnel";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Mon profil</Text>

      <Card style={{ gap: 4 }}>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.xs, fontSize: 16 }]}>Informations</Text>
        <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>{profile?.full_name ?? "Personnel"}</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Rôle : {roleLabel}</Text>
        {profile?.phone ? <Text style={{ color: theme.textSecondary, fontSize: 14 }}>📞 {profile.phone}</Text> : null}
      </Card>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Apparence</Text>
        <Text style={[typography.caption, { color: theme.textSecondary, marginBottom: spacing.md }]}>
          Choisissez le mode d'affichage de l'application.
        </Text>
        <View style={styles.themeToggleRow}>
          {(["light", "dark", "system"] as const).map((mode) => {
            const active = themeMode === mode;
            const label = mode === "light" ? "Clair ☀️" : mode === "dark" ? "Sombre 🌙" : "Système 📱";
            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    {
                      color: active ? "#FFFFFF" : theme.textPrimary,
                      fontSize: 13,
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Button label="Se déconnecter" variant="danger" onPress={onLogout} style={{ marginBottom: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  themeToggleRow: { flexDirection: "row", gap: spacing.sm, justifyContent: "space-between", marginTop: spacing.xs },
  themeButton: { flex: 1, height: 42, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
