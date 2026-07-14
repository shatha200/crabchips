import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";
import { radius, spacing, typography, elevation, fonts } from "../lib/theme";
import { Dish } from "../types/database";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60";

export function DishCard({ dish, compact }: { dish: Dish; compact?: boolean }) {
  const theme = useAppTheme();
  const imageHeight = compact ? 116 : 148;

  return (
    <Pressable
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          width: compact ? 164 : "100%",
          opacity: pressed ? 0.92 : 1,
          ...elevation.low,
        },
      ]}
    >
      <View>
        <Image
          source={{ uri: dish.image_url ?? PLACEHOLDER }}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
          transition={200}
        />

        {!dish.is_available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Indisponible</Text>
          </View>
        )}

        {dish.is_popular && dish.is_available && (
          <View style={[styles.popularTag, { backgroundColor: theme.accent }]}>
            <Ionicons name="flame" size={11} color="#fff" />
            <Text style={styles.popularText}>Populaire</Text>
          </View>
        )}

        {/* Price tag overlapping the image's bottom-right corner, like an
            actual price tag rather than plain inline text. */}
        <View style={[styles.priceTag, { backgroundColor: theme.primary, shadowColor: theme.shadow }]}>
          <Text style={styles.priceTagText}>{dish.price.toFixed(2)} DT</Text>
        </View>
      </View>

      <View style={{ padding: spacing.sm, paddingTop: spacing.sm + 4, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg, backgroundColor: theme.card }}>
        <Text numberOfLines={1} style={[typography.bodyBold, { color: theme.textPrimary }]}>
          {dish.name}
        </Text>
        {dish.description ? (
          <Text numberOfLines={2} style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]}>
            {dish.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "visible",
  },
  image: {
    width: "100%",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  unavailableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  unavailableText: { color: "#fff", fontFamily: fonts.bodyBold },
  popularTag: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  popularText: { color: "#fff", fontSize: 11, fontFamily: fonts.bodyBold },
  priceTag: {
    position: "absolute",
    bottom: -10,
    right: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  priceTagText: { color: "#fff", fontSize: 13, fontFamily: fonts.bodyBold },
});
