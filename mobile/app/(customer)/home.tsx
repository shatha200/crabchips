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
import { ScallopDivider } from "../../src/components/ScallopDivider";
import { StarRating, LoadingSpinner, ErrorState, Eyebrow } from "../../src/components/Common";
import { spacing, typography, radius, fonts } from "../../src/lib/theme";

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
      {/* Hero: cover photo, scalloped shell-edge signature divider, floating
          rating pill, and the restaurant name set in the display face. */}
      <View>
        <Image
          source={{ uri: restaurant.cover_url ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=60" }}
          style={{ width: "100%", height: 200 }}
          contentFit="cover"
        />
        <View style={styles.dividerWrap}>
          <ScallopDivider height={18} />
        </View>

        <View style={[styles.ratingPill, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <StarRating rating={restaurant.rating} size={13} />
          <Text style={[typography.caption, { color: theme.textPrimary, fontFamily: fonts.bodyBold }]}>
            {restaurant.rating.toFixed(1)}
          </Text>
        </View>

        {!restaurant.is_open && (
          <View style={[styles.closedPill, { backgroundColor: theme.error }]}>
            <Text style={{ color: "#fff", fontFamily: fonts.bodyBold, fontSize: 12 }}>Fermé actuellement</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 4 }}>
        <Text style={[typography.h1, { color: theme.textPrimary }]}>{restaurant.name}</Text>
        <Text style={[typography.body, { color: theme.textSecondary }]}>{restaurant.description}</Text>
        <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]}>
          {restaurant.review_count} avis
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Rechercher un plat..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={submitSearch}
            style={{ flex: 1, color: theme.textPrimary, paddingVertical: 10, fontFamily: fonts.body, fontSize: 15 }}
          />
        </View>
      </View>

      {/* Categories */}
      {categoriesQ.data && categoriesQ.data.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <SectionHeader eyebrow="Explorer" title="Catégories" />
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
                <Text style={{ color: theme.textPrimary, fontFamily: fonts.bodySemiBold }}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Featured */}
      {featuredQ.data && featuredQ.data.length > 0 && (
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeader eyebrow="Sélection du chef" title="Nos coups de cœur" />
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
        <View style={{ marginBottom: spacing.xxl }}>
          <SectionHeader eyebrow="Tendance" title="Les plus populaires" />
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

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const theme = useAppTheme();
  return (
    <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Text style={[typography.h2, { color: theme.textPrimary }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerWrap: { position: "absolute", bottom: -1, left: 0, right: 0 },
  ratingPill: {
    position: "absolute",
    bottom: 14,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  closedPill: {
    position: "absolute",
    top: 14,
    left: spacing.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
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
