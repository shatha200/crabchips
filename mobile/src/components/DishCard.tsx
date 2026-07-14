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
          borderColor: theme.border,
          borderWidth: 1,
          width: compact ? 164 : "100%",
          opacity: pressed ? 0.92 : 1,
          ...elevation.low,
        },
      ]}
    >
      <View style={{ overflow: "hidden", borderTopLeftRadius: radius.lg - 1, borderTopRightRadius: radius.lg - 1 }}>
        <Image
          source={{ uri: dish.image_url ?? PLACEHOLDER }}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
          transition={200}
        />

        {!dish.is_available && (
          <View style={[styles.unavailableOverlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
            <View style={{ backgroundColor: theme.error, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}>
              <Text style={{ color: "#fff", fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>Épuisé</Text>
            </View>
          </View>
        )}

        {dish.is_popular && dish.is_available && (
          <View style={[styles.popularTag, { backgroundColor: theme.accent }]}>
            <Ionicons name="flame" size={11} color="#fff" />
            <Text style={styles.popularText}>Populaire</Text>
          </View>
        )}

        {/* Price tag overlapping the image's bottom-right corner */}
        {dish.is_available && (
          <View style={[styles.priceTag, { backgroundColor: theme.primary, shadowColor: theme.shadow }]}>
            <Text style={styles.priceTagText}>{dish.price.toFixed(2)} DT</Text>
          </View>
        )}
      </View>

      <View style={{ padding: spacing.sm, paddingTop: spacing.sm + 6, borderBottomLeftRadius: radius.lg - 1, borderBottomRightRadius: radius.lg - 1, backgroundColor: theme.card, gap: 2 }}>
        <Text numberOfLines={1} style={[typography.bodyBold, { color: theme.textPrimary }]}>
          {dish.name}
        </Text>
        {dish.description ? (
          <Text numberOfLines={1} style={[typography.caption, { color: theme.textSecondary, fontSize: 12 }]}>
            {dish.description}
          </Text>
        ) : (
          <Text numberOfLines={1} style={[typography.caption, { color: "transparent", fontSize: 12 }]}>
            -
          </Text>
        )}
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
  },
  unavailableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
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
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  priceTagText: { color: "#fff", fontSize: 13, fontFamily: fonts.bodyBold },
});
