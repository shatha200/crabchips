import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, updateOrderStatus } from "../../../src/services/orders";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { StatusBadge, Card, LoadingSpinner } from "../../../src/components/Common";
import { Button } from "../../../src/components/Button";
import { spacing, typography } from "../../../src/lib/theme";
import { OrderStatus } from "../../../src/types/database";

// Defines the next legal action(s) for each current status.
const NEXT_ACTIONS: Partial<Record<OrderStatus, { label: string; status: OrderStatus; variant?: "primary" | "danger" }[]>> = {
  pending: [
    { label: "Accepter", status: "accepted" },
    { label: "Refuser", status: "rejected", variant: "danger" },
  ],
  accepted: [{ label: "Marquer en préparation", status: "preparing" }],
  preparing: [{ label: "Marquer prête", status: "ready" }],
  ready: [{ label: "En livraison", status: "out_for_delivery" }],
  out_for_delivery: [{ label: "Marquer livrée", status: "delivered" }],
};

export default function RestaurantOrderDetailScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  const orderQ = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(id) });

  if (orderQ.isLoading || !orderQ.data) return <LoadingSpinner />;
  const order = orderQ.data;

  const onUpdateStatus = async (status: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, status);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      if (status === "rejected") router.back();
    } finally {
      setUpdating(false);
    }
  };

  const actions = NEXT_ACTIONS[order.status] ?? [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <View>
        <Text style={[typography.h1, { color: theme.textPrimary }]}>Commande #{order.short_code}</Text>
        <View style={{ marginTop: spacing.xs }}>
          <StatusBadge status={order.status} />
        </View>
      </View>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Client</Text>
        <Text style={{ color: theme.textPrimary }}>{order.profiles?.full_name ?? "—"}</Text>
        <Text style={{ color: theme.textSecondary, marginTop: 2 }}>{order.phone}</Text>
        <Text style={{ color: theme.textSecondary, marginTop: 2 }}>{order.delivery_address}</Text>
        {order.note ? <Text style={{ color: theme.textSecondary, marginTop: spacing.sm }}>Note : {order.note}</Text> : null}
      </Card>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Articles</Text>
        {order.order_items?.map((item) => (
          <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
            <Text style={{ color: theme.textPrimary }}>{item.quantity}× {item.name_snapshot}</Text>
            <Text style={{ color: theme.textSecondary }}>{(item.price_snapshot * item.quantity).toFixed(2)} DT</Text>
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>Total</Text>
          <Text style={[typography.bodyBold, { color: theme.primary }]}>{order.total.toFixed(2)} DT</Text>
        </View>
      </Card>

      {actions.length > 0 && (
        <View style={{ gap: spacing.sm }}>
          {actions.map((action) => (
            <Button
              key={action.status}
              label={action.label}
              variant={action.variant ?? "primary"}
              loading={updating}
              onPress={() => onUpdateStatus(action.status)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, marginVertical: spacing.sm },
});
