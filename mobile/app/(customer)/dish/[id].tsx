import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { getDish } from "../../../src/services/menu";
import { getRestaurantReviews } from "../../../src/services/reviews";
import { useCartStore } from "../../../src/store/cartStore";
import { RESTAURANT_ID } from "../../../src/config";
import { Button } from "../../../src/components/Button";
import { LoadingSpinner, Card, StarRating } from "../../../src/components/Common";
import { spacing, typography, radius } from "../../../src/lib/theme";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=60";

export default function DishDetailsScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const dishQ = useQuery({ queryKey: ["dish", id], queryFn: () => getDish(id) });
  const reviewsQ = useQuery({
    queryKey: ["restaurant-reviews", RESTAURANT_ID],
    queryFn: () => getRestaurantReviews(RESTAURANT_ID),
  });

  if (dishQ.isLoading || !dishQ.data) return <LoadingSpinner />;
  const dish = dishQ.data;

  const handleAddToCart = () => {
    addItem(RESTAURANT_ID, {
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      imageUrl: dish.image_url,
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          <Image source={{ uri: dish.image_url ?? PLACEHOLDER }} style={{ width: "100%", height: 300 }} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.2)", theme.background]}
            style={styles.gradientOverlay}
          />
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: theme.mode === "dark" ? "rgba(22, 23, 27, 0.8)" : "rgba(255, 255, 255, 0.85)",
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <View>
            <Text style={[typography.h1, { color: theme.textPrimary, fontSize: 26 }]}>{dish.name}</Text>
            {dish.name_ar ? (
              <Text style={[typography.body, { color: theme.textSecondary, marginTop: 2, fontSize: 16 }]}>{dish.name_ar}</Text>
            ) : null}
          </View>

          <Text style={[typography.price, { color: theme.primary, fontSize: 24, fontWeight: "800", marginTop: spacing.xs }]}>
            {dish.price.toFixed(2)} <Text style={{ fontSize: 15, fontWeight: "500" }}>DT</Text>
          </Text>

          {dish.description ? (
            <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.xs, lineHeight: 22, fontSize: 15 }]}>
              {dish.description}
            </Text>
          ) : null}

          {!dish.is_available && (
            <View style={[styles.unavailableBanner, { backgroundColor: theme.errorBg, borderColor: theme.error + "33", borderWidth: 1 }]}>
              <Text style={{ color: theme.error, fontWeight: "700", textAlign: "center" }}>Ce plat est actuellement indisponible</Text>
            </View>
          )}

          {dish.is_available && (
            <View style={[styles.quantityRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[typography.h3, { color: theme.textPrimary, fontSize: 16 }]}>Quantité</Text>
              <View style={[styles.stepper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))} style={styles.stepperButton} hitSlop={6}>
                  <Ionicons name="remove" size={18} color={theme.textPrimary} />
                </Pressable>
                <Text style={[typography.bodyBold, { color: theme.textPrimary, minWidth: 26, textAlign: "center" }]}>
                  {quantity}
                </Text>
                <Pressable onPress={() => setQuantity((q) => q + 1)} style={styles.stepperButton} hitSlop={6}>
                  <Ionicons name="add" size={18} color={theme.textPrimary} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Customer Reviews Section */}
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Text style={[typography.h3, { color: theme.textPrimary, fontSize: 18, marginTop: spacing.sm }]}>Avis des clients</Text>
            {reviewsQ.isLoading ? (
              <LoadingSpinner />
            ) : reviewsQ.data && reviewsQ.data.length > 0 ? (
              <View style={{ gap: spacing.sm }}>
                {reviewsQ.data.map((rev) => (
                  <Card key={rev.id} style={{ gap: 6, padding: spacing.md }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <StarRating rating={rev.rating} size={14} />
                      <Text style={[typography.caption, { color: theme.textSecondary }]}>
                        {new Date(rev.created_at).toLocaleDateString("fr-FR")}
                      </Text>
                    </View>
                    {rev.comment ? (
                      <Text style={[typography.body, { color: theme.textPrimary, fontSize: 14, lineHeight: 18 }]}>
                        {rev.comment}
                      </Text>
                    ) : (
                      <Text style={[typography.caption, { color: theme.textSecondary, fontStyle: "italic" }]}>
                        Aucun commentaire laissé
                      </Text>
                    )}
                  </Card>
                ))}
              </View>
            ) : (
              <Text style={[typography.body, { color: theme.textSecondary, fontStyle: "italic", paddingVertical: 10 }]}>
                Aucun avis pour le moment
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {dish.is_available && (
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <Button label={`Ajouter au panier — ${(dish.price * quantity).toFixed(2)} DT`} onPress={handleAddToCart} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  unavailableBanner: { padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  stepperButton: { padding: 4 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
});
