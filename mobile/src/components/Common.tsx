import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";
import { radius, spacing, typography, brand, orderStatusMeta, elevation, fonts } from "../lib/theme";
import { OrderStatus } from "../types/database";

// ---- Card: base rounded surface used across the app ----
export function Card({
  children,
  style,
  level = "low",
}: {
  children: React.ReactNode;
  style?: any;
  level?: keyof typeof elevation;
}) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          shadowColor: theme.shadow,
          ...elevation[level],
          borderWidth: 1,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---- Eyebrow: small uppercase label above a section title — the app's
// recurring structural device that gives sections a consistent rhythm
// instead of a plain unadorned header. The tick uses the teal accent.
export function Eyebrow({ children }: { children: string }) {
  const theme = useAppTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
      <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: theme.accent }} />
      <Text style={[typography.eyebrow, { color: theme.accent, textTransform: "uppercase" }]}>
        {children}
      </Text>
    </View>
  );
}

// ---- StatusBadge: order status pill, colored per theme.orderStatusMeta ----
export function StatusBadge({ status }: { status: OrderStatus }) {
  const theme = useAppTheme();
  const meta = orderStatusMeta[status] ?? { label: status, color: "textSecondary" };
  const color = meta.color === "textSecondary" ? theme.textSecondary : (brand as any)[meta.color];
  return (
    <View style={[styles.badge, { backgroundColor: color + "14", borderColor: color + "26", borderWidth: 1 }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[typography.caption, { color, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }]}>{meta.label}</Text>
    </View>
  );
}

// ---- StarRating: read-only display or interactive input ----
export function StarRating({
  rating,
  size = 18,
  onChange,
}: {
  rating: number;
  size?: number;
  onChange?: (value: number) => void;
}) {
  const theme = useAppTheme();
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} disabled={!onChange} onPress={() => onChange?.(i)} hitSlop={6}>
          <Ionicons
            name={i <= Math.round(rating) ? "star" : "star-outline"}
            size={size}
            color={i <= Math.round(rating) ? brand.orange : theme.textSecondary}
            style={{ transform: [{ scale: onChange ? 1 : 0.95 }] }}
          />
        </Pressable>
      ))}
    </View>
  );
}

// ---- EmptyState ----
export function EmptyState({
  icon = "fast-food-outline",
  title,
  message,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  message?: string;
}) {
  const theme = useAppTheme();
  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.sm }}>
      <View style={[styles.emptyIconWrap, { backgroundColor: theme.surface }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
      </View>
      <Text style={[typography.h3, { color: theme.textPrimary, textAlign: "center" }]}>{title}</Text>
      {message ? (
        <Text style={[typography.caption, { color: theme.textSecondary, textAlign: "center", maxWidth: 240, lineHeight: 18 }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

// ---- LoadingSpinner: full-area loading state ----
export function LoadingSpinner() {
  const theme = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}

// ---- ErrorState: for failed fetches, with retry ----
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const theme = useAppTheme();
  return (
    <View style={{ alignItems: "center", padding: spacing.xl, gap: spacing.sm }}>
      <Ionicons name="alert-circle-outline" size={40} color={theme.error} />
      <Text style={[typography.body, { color: theme.textPrimary, textAlign: "center" }]}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry}>
          <Text style={[typography.bodyBold, { color: theme.primary, textDecorationLine: "underline" }]}>Réessayer</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
});
