import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { getDish } from "../../../src/services/menu";
import { useCartStore } from "../../../src/store/cartStore";
import { RESTAURANT_ID } from "../../../src/config";
import { Button } from "../../../src/components/Button";
import { LoadingSpinner } from "../../../src/components/Common";
import { spacing, typography, radius } from "../../../src/lib/theme";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=60";

export default function DishDetailsScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const dishQ = useQuery({ queryKey: ["dish", id], queryFn: () => getDish(id) });

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
      <ScrollView>
        <View>
          <Image source={{ uri: dish.image_url ?? PLACEHOLDER }} style={{ width: "100%", height: 280 }} contentFit="cover" />
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#1F2023" />
          </Pressable>
        </View>

        <View style={{ padding: spacing.lg }}>
          <Text style={[typography.h1, { color: theme.textPrimary }]}>{dish.name}</Text>
          {dish.name_ar ? (
            <Text style={[typography.body, { color: theme.textSecondary, marginTop: 2 }]}>{dish.name_ar}</Text>
          ) : null}
          <Text style={[typography.price, { color: theme.primary, fontSize: 22, marginTop: spacing.sm }]}>
            {dish.price.toFixed(2)} DT
          </Text>

          {dish.description ? (
            <Text style={[typography.body, { color: theme.textSecondary, marginTop: spacing.md, lineHeight: 22 }]}>
              {dish.description}
            </Text>
          ) : null}

          {!dish.is_available && (
            <View style={[styles.unavailableBanner, { backgroundColor: theme.errorBg }]}>
              <Text style={{ color: theme.error, fontWeight: "700" }}>Ce plat est actuellement indisponible</Text>
            </View>
          )}

          {dish.is_available && (
            <View style={styles.quantityRow}>
              <Text style={[typography.h3, { color: theme.textPrimary }]}>Quantité</Text>
              <View style={[styles.stepper, { borderColor: theme.border }]}>
                <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))} style={styles.stepperButton}>
                  <Ionicons name="remove" size={18} color={theme.textPrimary} />
                </Pressable>
                <Text style={[typography.bodyBold, { color: theme.textPrimary, minWidth: 24, textAlign: "center" }]}>
                  {quantity}
                </Text>
                <Pressable onPress={() => setQuantity((q) => q + 1)} style={styles.stepperButton}>
                  <Ionicons name="add" size={18} color={theme.textPrimary} />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {dish.is_available && (
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <Button label={`Ajouter — ${(dish.price * quantity).toFixed(2)} DT`} onPress={handleAddToCart} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute", top: 50, left: spacing.md,
    backgroundColor: "#fff", width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  unavailableBanner: { padding: spacing.md, borderRadius: radius.md, marginTop: spacing.lg },
  quantityRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xl,
  },
  stepper: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  stepperButton: { padding: 4 },
  footer: { padding: spacing.lg, borderTopWidth: 1 },
});
