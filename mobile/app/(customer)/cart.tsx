import React from "react";
import { View, Text, FlatList, Pressable, TextInput, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useCartStore } from "../../src/store/cartStore";
import { Button } from "../../src/components/Button";
import { EmptyState } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function CartScreen() {
  const theme = useAppTheme();
  const { items, note, setNote, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: "center" }}>
        <EmptyState icon="cart-outline" title="Votre panier est vide" message="Ajoutez des plats depuis le menu pour commencer." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.dishId}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
            <Image source={{ uri: item.imageUrl ?? undefined }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 15 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[typography.price, { color: theme.primary, fontSize: 14 }]}>
                {item.price.toFixed(2)} DT
              </Text>
            </View>
            <View style={[styles.stepper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <Pressable onPress={() => updateQuantity(item.dishId, item.quantity - 1)} style={styles.stepperBtn} hitSlop={4}>
                <Ionicons name="remove" size={14} color={theme.textPrimary} />
              </Pressable>
              <Text style={{ color: theme.textPrimary, minWidth: 20, textAlign: "center", fontWeight: "700", fontSize: 13 }}>{item.quantity}</Text>
              <Pressable onPress={() => updateQuantity(item.dishId, item.quantity + 1)} style={styles.stepperBtn} hitSlop={4}>
                <Ionicons name="add" size={14} color={theme.textPrimary} />
              </Pressable>
            </View>
            <Pressable onPress={() => removeItem(item.dishId)} style={{ marginLeft: spacing.sm }} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={theme.error} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: spacing.md }}>
            <Text style={[typography.bodyBold, { color: theme.textPrimary, marginBottom: spacing.xs, fontSize: 14 }]}>
              Instructions spéciales
            </Text>
            <TextInput
              placeholder="Note pour le restaurant (optionnel, ex: sans oignon...)"
              placeholderTextColor={theme.textSecondary}
              value={note}
              onChangeText={setNote}
              multiline
              style={[styles.noteInput, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.card }]}
            />
          </View>
        }
      />

      <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md }}>
          <Text style={[typography.h3, { color: theme.textPrimary, fontSize: 16 }]}>Total</Text>
          <Text style={[typography.h3, { color: theme.primary, fontSize: 18, fontWeight: "800" }]}>{subtotal().toFixed(2)} DT</Text>
        </View>
        <Button label="Passer la commande" onPress={() => router.push("/(customer)/checkout")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.sm + 2,
    borderWidth: 1,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: "#eee" },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  stepperBtn: { padding: 2 },
  noteInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
  },
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
