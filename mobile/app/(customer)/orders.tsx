import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { getCustomerOrders } from "../../src/services/orders";
import { StatusBadge, EmptyState, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function OrdersScreen() {
  const theme = useAppTheme();
  const { session } = useAuth();

  const ordersQ = useQuery({
    queryKey: ["customer-orders", session?.user.id],
    queryFn: () => getCustomerOrders(session!.user.id),
    enabled: !!session,
  });

  if (ordersQ.isLoading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[typography.h1, { color: theme.textPrimary, padding: spacing.lg, paddingBottom: 0 }]}>
        Mes commandes
      </Text>
      <FlatList
        data={ordersQ.data ?? []}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        refreshControl={<RefreshControl refreshing={ordersQ.isRefetching} onRefresh={() => ordersQ.refetch()} tintColor={theme.primary} />}
        ListEmptyComponent={<EmptyState icon="receipt-outline" title="Aucune commande" message="Vos commandes apparaîtront ici." />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(customer)/orders/${item.id}`)}
            style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow, borderColor: theme.border }]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ gap: 2 }}>
                <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 16 }]}>Commande #{item.short_code}</Text>
                <Text style={[typography.caption, { color: theme.textSecondary }]}>
                  {format(new Date(item.created_at), "d MMM yyyy, HH:mm")}
                </Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: spacing.sm }}>
              <Text style={[typography.caption, { color: theme.textSecondary }]}>
                {item.order_items?.length ?? 0} article(s)
              </Text>
              <Text style={[typography.price, { color: theme.primary, fontSize: 16 }]}>
                {item.total.toFixed(2)} DT
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
