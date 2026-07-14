import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getRestaurantOrders, subscribeToRestaurantOrders } from "../../src/services/orders";
import { RESTAURANT_ID } from "../../src/config";
import { StatusBadge, EmptyState, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";
import { OrderStatus } from "../../src/types/database";

const FILTERS: { key: OrderStatus | "active" | "all"; label: string }[] = [
  { key: "active", label: "Actives" },
  { key: "pending", label: "En attente" },
  { key: "delivered", label: "Livrées" },
  { key: "all", label: "Toutes" },
];

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "out_for_delivery"];

export default function OrderManagementScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("active");

  const ordersQ = useQuery({
    queryKey: ["restaurant-orders", filter],
    queryFn: () =>
      getRestaurantOrders(
        RESTAURANT_ID,
        filter === "all" ? undefined : filter === "active" ? ACTIVE_STATUSES : [filter as OrderStatus]
      ),
  });

  useEffect(() => {
    const unsubscribe = subscribeToRestaurantOrders(RESTAURANT_ID, () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[typography.h1, { color: theme.textPrimary, padding: spacing.lg, paddingBottom: spacing.sm }]}>
        Commandes
      </Text>

      <View style={{ flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[
              styles.chip,
              { backgroundColor: filter === f.key ? theme.primary : theme.surface, borderColor: filter === f.key ? theme.primary : theme.border },
            ]}
          >
            <Text style={{ color: filter === f.key ? theme.onPrimary : theme.textPrimary, fontWeight: "600", fontSize: 13 }}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {ordersQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={ordersQ.data ?? []}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          ListEmptyComponent={<EmptyState icon="receipt-outline" title="Aucune commande" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(restaurant)/order/${item.id}`)}
              style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>#{item.short_code}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
                {item.profiles?.full_name ?? "Client"} · {format(new Date(item.created_at), "HH:mm")}
              </Text>
              <Text style={[typography.bodyBold, { color: theme.primary, marginTop: spacing.sm }]}>
                {item.total.toFixed(2)} DT
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  card: { borderRadius: radius.lg, padding: spacing.md, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
});
