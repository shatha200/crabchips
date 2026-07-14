import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, updateOrderStatus } from "../../../src/services/orders";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { StatusBadge, Card, LoadingSpinner } from "../../../src/components/Common";
import { Button } from "../../../src/components/Button";
import { spacing, typography, radius } from "../../../src/lib/theme";
import { OrderStatus } from "../../../src/types/database";

// Defines the next legal action(s) for each current status.
const NEXT_ACTIONS: Partial<Record<OrderStatus, { label: string; status: OrderStatus; variant?: "primary" | "danger" }[]>> = {
  pending: [
    { label: "Accepter la commande", status: "accepted" },
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
      if (status === "rejected" || status === "delivered") router.back();
    } finally {
      setUpdating(false);
    }
  };

  const actions = NEXT_ACTIONS[order.status] ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 100 }}>
        <View style={{ marginBottom: spacing.xs }}>
          <Text style={[typography.h1, { color: theme.textPrimary, fontSize: 26 }]}>Commande #{order.short_code}</Text>
          <View style={{ marginTop: spacing.xs }}>
            <StatusBadge status={order.status} />
          </View>
        </View>

        <Card style={{ gap: 4 }}>
          <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.xs, fontSize: 16 }]}>Client</Text>
          <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>{order.profiles?.full_name ?? "Client anonyme"}</Text>
          <Text style={[typography.body, { color: theme.textSecondary, fontSize: 14 }]}>📞 {order.phone}</Text>
          <Text style={[typography.body, { color: theme.textSecondary, fontSize: 14 }]}>📍 {order.delivery_address}</Text>
          {order.note ? (
            <View style={{ backgroundColor: theme.surface, padding: spacing.sm, borderRadius: radius.md, marginTop: spacing.sm }}>
              <Text style={[typography.caption, { color: theme.textSecondary, fontStyle: "italic" }]}>Note : {order.note}</Text>
            </View>
          ) : null}
        </Card>

        <Card>
          <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.md, fontSize: 16 }]}>Articles ordered</Text>
          {order.order_items?.map((item) => (
            <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }}>
              <Text style={[typography.body, { color: theme.textPrimary, fontSize: 14 }]}>
                {item.quantity}× {item.name_snapshot}
              </Text>
              <Text style={[typography.body, { color: theme.textSecondary, fontSize: 14 }]}>{(item.price_snapshot * item.quantity).toFixed(2)} DT</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 15 }]}>Total</Text>
            <Text style={[typography.h3, { color: theme.primary, fontSize: 18, fontWeight: "800" }]}>{order.total.toFixed(2)} DT</Text>
          </View>
        </Card>
      </ScrollView>

      {actions.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          {actions.map((action) => (
            <Button
              key={action.status}
              label={action.label}
              variant={action.variant ?? "primary"}
              loading={updating}
              onPress={() => onUpdateStatus(action.status)}
              style={{ marginTop: spacing.xs }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, marginVertical: spacing.sm },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
});
