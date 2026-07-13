import React, { useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getCategories, getDishes, DishFilters } from "../../src/services/menu";
import { RESTAURANT_ID } from "../../src/config";
import { DishCard } from "../../src/components/DishCard";
import { EmptyState, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

const SORT_OPTIONS: { key: NonNullable<DishFilters["sortBy"]>; label: string }[] = [
  { key: "popularity", label: "Popularité" },
  { key: "price_asc", label: "Prix ↑" },
  { key: "price_desc", label: "Prix ↓" },
];

export default function MenuScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams<{ categoryId?: string; q?: string }>();

  const [categoryId, setCategoryId] = useState<string | undefined>(params.categoryId);
  const [search, setSearch] = useState(params.q ?? "");
  const [sortBy, setSortBy] = useState<DishFilters["sortBy"]>(undefined);

  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => getCategories(RESTAURANT_ID) });
  const dishesQ = useQuery({
    queryKey: ["dishes", categoryId, search, sortBy],
    queryFn: () => getDishes(RESTAURANT_ID, { categoryId, search: search || undefined, sortBy }),
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm }}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: theme.textPrimary, paddingVertical: 10 }}
          />
        </View>

        {/* Category filter chips */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: undefined, name: "Tout" }, ...(categoriesQ.data ?? [])]}
          keyExtractor={(c, i) => c.id ?? `all-${i}`}
          contentContainerStyle={{ gap: spacing.sm }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setCategoryId(item.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: categoryId === item.id ? theme.primary : theme.surface,
                  borderColor: categoryId === item.id ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: categoryId === item.id ? theme.onPrimary : theme.textPrimary, fontWeight: "600" }}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />

        {/* Sort options */}
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setSortBy(sortBy === opt.key ? undefined : opt.key)}
              style={[
                styles.sortChip,
                { borderColor: sortBy === opt.key ? theme.primary : theme.border },
              ]}
            >
              <Text style={{ color: sortBy === opt.key ? theme.primary : theme.textSecondary, fontSize: 13 }}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {dishesQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={dishesQ.data ?? []}
          keyExtractor={(d) => d.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <DishCard dish={item} />
            </View>
          )}
          ListEmptyComponent={<EmptyState title="Aucun plat trouvé" message="Essayez une autre recherche ou catégorie." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  sortChip: { paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1 },
});
