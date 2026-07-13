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
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.imageUrl ?? undefined }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyBold, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[typography.price, { color: theme.primary, marginTop: 2 }]}>
                {item.price.toFixed(2)} DT
              </Text>
            </View>
            <View style={[styles.stepper, { borderColor: theme.border }]}>
              <Pressable onPress={() => updateQuantity(item.dishId, item.quantity - 1)} style={styles.stepperBtn}>
                <Ionicons name="remove" size={16} color={theme.textPrimary} />
              </Pressable>
              <Text style={{ color: theme.textPrimary, minWidth: 18, textAlign: "center" }}>{item.quantity}</Text>
              <Pressable onPress={() => updateQuantity(item.dishId, item.quantity + 1)} style={styles.stepperBtn}>
                <Ionicons name="add" size={16} color={theme.textPrimary} />
              </Pressable>
            </View>
            <Pressable onPress={() => removeItem(item.dishId)} style={{ marginLeft: spacing.sm }}>
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={
          <TextInput
            placeholder="Note pour le restaurant (optionnel)"
            placeholderTextColor={theme.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            style={[styles.noteInput, { borderColor: theme.border, color: theme.textPrimary }]}
          />
        }
      />

      <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md }}>
          <Text style={[typography.h3, { color: theme.textPrimary }]}>Total</Text>
          <Text style={[typography.h3, { color: theme.primary }]}>{subtotal().toFixed(2)} DT</Text>
        </View>
        <Button label="Passer la commande" onPress={() => router.push("/(customer)/checkout")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.md, padding: spacing.sm },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: "#eee" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 4 },
  stepperBtn: { padding: 2 },
  noteInput: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, minHeight: 70, textAlignVertical: "top" },
  footer: { padding: spacing.lg, borderTopWidth: 1 },
});
