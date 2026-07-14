import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useAppTheme } from "../contexts/ThemeContext";
import { spacing, typography, radius } from "../lib/theme";

interface AuthCardProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// On a wide browser window, a form stretched edge-to-edge looks broken —
// this caps the card at a phone-like width and centers it, with a subtle
// elevated surface, so the web build reads as an intentional layout rather
// than an unstyled page. On native it just fills the screen as normal.
export function AuthCard({ emoji = "🦀", title, subtitle, children }: AuthCardProps) {
  const theme = useAppTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            Platform.OS === "web" && {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
              <Text style={{ fontSize: 30 }}>{emoji}</Text>
            </View>
            <Text style={[typography.h1, { color: theme.textPrimary, marginTop: spacing.md, textAlign: "center" }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[typography.body, { color: theme.textSecondary, marginTop: 4, textAlign: "center" }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    ...Platform.select({
      web: {
        borderRadius: radius.xl,
        padding: spacing.xl,
        shadowOpacity: 1,
        shadowRadius: 40,
        shadowOffset: { width: 0, height: 20 },
      },
      default: {},
    }),
  },
});
