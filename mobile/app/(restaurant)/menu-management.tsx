import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Switch, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getCategories, getDishes, setDishAvailability, deleteDish } from "../../src/services/menu";
import { RESTAURANT_ID } from "../../src/config";
import { EmptyState, LoadingSpinner } from "../../src/components/Common";
import { Button } from "../../src/components/Button";
import { spacing, typography, radius } from "../../src/lib/theme";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60";

export default function MenuManagementScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => getCategories(RESTAURANT_ID) });
  const dishesQ = useQuery({
    queryKey: ["dishes-mgmt", categoryId],
    queryFn: () => getDishes(RESTAURANT_ID, { categoryId }),
  });

  const onToggleAvailability = async (dishId: string, next: boolean) => {
    await setDishAvailability(dishId, next);
    queryClient.invalidateQueries({ queryKey: ["dishes-mgmt"] });
  };

  const onDelete = async (dishId: string) => {
    await deleteDish(dishId);
    queryClient.invalidateQueries({ queryKey: ["dishes-mgmt"] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.lg, paddingBottom: spacing.sm }}>
        <Text style={[typography.h1, { color: theme.textPrimary }]}>Menu</Text>
        <Pressable onPress={() => router.push("/(restaurant)/category-management")}>
          <Text style={{ color: theme.primary, fontWeight: "600" }}>Catégories</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm }}
        data={[{ id: undefined, name: "Tout" }, ...(categoriesQ.data ?? [])]}
        keyExtractor={(c, i) => c.id ?? `all-${i}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setCategoryId(item.id)}
            style={[
              styles.chip,
              { backgroundColor: categoryId === item.id ? theme.primary : theme.surface, borderColor: categoryId === item.id ? theme.primary : theme.border },
            ]}
          >
            <Text style={{ color: categoryId === item.id ? theme.onPrimary : theme.textPrimary, fontWeight: "600" }}>{item.name}</Text>
          </Pressable>
        )}
      />

      {dishesQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={dishesQ.data ?? []}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingTop: 0 }}
          ListEmptyComponent={<EmptyState title="Aucun plat" message="Ajoutez votre premier plat." />}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Image source={{ uri: item.image_url ?? PLACEHOLDER }} style={styles.thumb} contentFit="cover" />
              <Pressable style={{ flex: 1 }} onPress={() => router.push(`/(restaurant)/dish-form/${item.id}`)}>
                <Text style={[typography.bodyBold, { color: theme.textPrimary }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[typography.price, { color: theme.primary }]}>{item.price.toFixed(2)} DT</Text>
              </Pressable>
              <Switch
                value={item.is_available}
                onValueChange={(v) => onToggleAvailability(item.id, v)}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
              <Pressable onPress={() => onDelete(item.id)} style={{ marginLeft: spacing.sm }}>
                <Ionicons name="trash-outline" size={20} color={theme.error} />
              </Pressable>
            </View>
          )}
        />
      )}

      <View style={{ padding: spacing.lg, paddingTop: 0 }}>
        <Button label="Ajouter un plat" onPress={() => router.push("/(restaurant)/dish-form/new")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.md, padding: spacing.sm, shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  thumb: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: "#eee" },
});
