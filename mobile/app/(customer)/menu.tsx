import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
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

  // Group dishes by category if browsing everything without active search or sort filters
  const groupedDishes = useMemo(() => {
    if (!dishesQ.data || !categoriesQ.data) return null;
    if (search.trim() || sortBy || categoryId) return null;

    return categoriesQ.data
      .map((cat) => {
        const dishes = dishesQ.data.filter((d) => d.category_id === cat.id);
        return { ...cat, dishes };
      })
      .filter((cat) => cat.dishes.length > 0);
  }, [dishesQ.data, categoriesQ.data, search, sortBy, categoryId]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.md }}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
          <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: theme.textPrimary, paddingVertical: 10, fontSize: 15 }}
          />
          {search.trim().length > 0 ? (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
            </Pressable>
          ) : (
            <Ionicons name="options-outline" size={18} color={theme.primary} />
          )}
        </View>

        {/* Category filter chips */}
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: undefined, name: "Tout" }, ...(categoriesQ.data ?? [])]}
            keyExtractor={(c, i) => c.id ?? `all-${i}`}
            contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setCategoryId(item.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: categoryId === item.id ? theme.primary : theme.card,
                    borderColor: categoryId === item.id ? theme.primary : theme.border,
                    shadowColor: theme.shadow,
                    shadowOpacity: categoryId === item.id ? 0.15 : 0.02,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 1,
                  },
                ]}
              >
                <Text style={{ color: categoryId === item.id ? theme.onPrimary : theme.textPrimary, fontWeight: "600", fontSize: 13 }}>
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Sort options */}
        <View style={{ flexDirection: "row", gap: spacing.sm, paddingBottom: 2 }}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setSortBy(sortBy === opt.key ? undefined : opt.key)}
              style={[
                styles.sortChip,
                {
                  backgroundColor: sortBy === opt.key ? theme.primary + "14" : "transparent",
                  borderColor: sortBy === opt.key ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={{ color: sortBy === opt.key ? theme.primary : theme.textSecondary, fontSize: 12, fontWeight: sortBy === opt.key ? "600" : "500" }}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {dishesQ.isLoading ? (
        <LoadingSpinner />
      ) : groupedDishes ? (
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl + 20 }}>
          {groupedDishes.length > 0 ? (
            groupedDishes.map((cat) => (
              <View key={cat.id} style={{ marginBottom: spacing.lg }}>
                <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
                  <Text style={[typography.h2, { color: theme.textPrimary, fontSize: 18 }]}>{cat.name}</Text>
                  {cat.name_ar ? (
                    <Text style={[typography.caption, { color: theme.textSecondary, fontSize: 13, marginTop: 1 }]}>
                      {cat.name_ar}
                    </Text>
                  ) : null}
                </View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingVertical: 4 }}
                  data={cat.dishes}
                  keyExtractor={(d) => d.id}
                  renderItem={({ item }) => <DishCard dish={item} compact />}
                />
              </View>
            ))
          ) : (
            <EmptyState title="Aucun plat trouvé" message="Le menu est vide pour le moment." />
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={dishesQ.data ?? []}
          keyExtractor={(d) => d.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl + 20 }}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sortChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
