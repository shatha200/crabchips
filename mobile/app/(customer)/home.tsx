import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, FlatList, Pressable, RefreshControl, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getRestaurant, getCategories, getFeaturedDishes, getPopularDishes } from "../../src/services/menu";
import { RESTAURANT_ID } from "../../src/config";
import { DishCard } from "../../src/components/DishCard";
import { StarRating, LoadingSpinner, ErrorState } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function HomeScreen() {
  const theme = useAppTheme();
  const [search, setSearch] = useState("");

  const restaurantQ = useQuery({ queryKey: ["restaurant"], queryFn: () => getRestaurant(RESTAURANT_ID) });
  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => getCategories(RESTAURANT_ID) });
  const featuredQ = useQuery({ queryKey: ["featured"], queryFn: () => getFeaturedDishes(RESTAURANT_ID) });
  const popularQ = useQuery({ queryKey: ["popular"], queryFn: () => getPopularDishes(RESTAURANT_ID) });

  const loading = restaurantQ.isLoading || categoriesQ.isLoading;
  const refreshing = restaurantQ.isRefetching;

  if (loading) return <LoadingSpinner />;
  if (restaurantQ.error) return <ErrorState message="Impossible de charger le restaurant" onRetry={() => restaurantQ.refetch()} />;

  const restaurant = restaurantQ.data!;

  const submitSearch = () => {
    if (search.trim()) router.push({ pathname: "/(customer)/menu", params: { q: search.trim() } });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => restaurantQ.refetch()} tintColor={theme.primary} />}
    >
      {/* Restaurant header */}
      <Image
        source={{ uri: restaurant.cover_url ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=60" }}
        style={{ width: "100%", height: 180 }}
        contentFit="cover"
      />
      <View style={{ padding: spacing.lg, gap: 4 }}>
        <Text style={[typography.h1, { color: theme.textPrimary }]}>{restaurant.name}</Text>
        <Text style={[typography.body, { color: theme.textSecondary }]}>{restaurant.description}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
          <StarRating rating={restaurant.rating} size={16} />
          <Text style={[typography.caption, { color: theme.textSecondary }]}>
            {restaurant.rating.toFixed(1)} ({restaurant.review_count} avis)
          </Text>
          {!restaurant.is_open && (
            <Text style={[typography.caption, { color: theme.error, marginLeft: spacing.sm }]}>Fermé actuellement</Text>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={submitSearch}
            style={{ flex: 1, color: theme.textPrimary, paddingVertical: 10 }}
          />
        </View>
      </View>

      {/* Categories */}
      {categoriesQ.data && categoriesQ.data.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionTitle title="Catégories" />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
            data={categoriesQ.data}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push({ pathname: "/(customer)/menu", params: { categoryId: item.id } })}
                style={[styles.categoryChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={{ color: theme.textPrimary, fontWeight: "600" }}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Featured */}
      {featuredQ.data && featuredQ.data.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionTitle title="Nos coups de cœur" />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
            data={featuredQ.data}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => <DishCard dish={item} compact />}
          />
        </View>
      )}

      {/* Popular */}
      {popularQ.data && popularQ.data.length > 0 && (
        <View style={{ marginBottom: spacing.xl }}>
          <SectionTitle title="Les plus populaires" />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
            data={popularQ.data}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => <DishCard dish={item} compact />}
          />
        </View>
      )}
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  const theme = useAppTheme();
  return (
    <Text style={[typography.h3, { color: theme.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.sm }]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
