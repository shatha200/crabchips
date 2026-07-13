import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAppTheme } from "../contexts/ThemeContext";
import { radius, spacing, typography } from "../lib/theme";
import { Dish } from "../types/database";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60";

export function DishCard({ dish, compact }: { dish: Dish; compact?: boolean }) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={[
        styles.card,
        { backgroundColor: theme.card, shadowColor: theme.shadow, width: compact ? 160 : "100%" },
      ]}
    >
      <Image
        source={{ uri: dish.image_url ?? PLACEHOLDER }}
        style={[styles.image, { height: compact ? 110 : 140 }]}
        contentFit="cover"
        transition={200}
      />
      {!dish.is_available && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Indisponible</Text>
        </View>
      )}
      <View style={{ padding: spacing.sm }}>
        <Text numberOfLines={1} style={[typography.bodyBold, { color: theme.textPrimary }]}>
          {dish.name}
        </Text>
        {dish.description ? (
          <Text numberOfLines={2} style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]}>
            {dish.description}
          </Text>
        ) : null}
        <Text style={[typography.price, { color: theme.primary, marginTop: 6 }]}>
          {dish.price.toFixed(2)} DT
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  image: { width: "100%" },
  unavailableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableText: { color: "#fff", fontWeight: "700" },
});
