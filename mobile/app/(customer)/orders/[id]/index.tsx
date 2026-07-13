import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { getOrder, subscribeToOrder } from "../../../../src/services/orders";
import { getReviewForOrder } from "../../../../src/services/reviews";
import { useAppTheme } from "../../../../src/contexts/ThemeContext";
import { StatusBadge, LoadingSpinner, Card } from "../../../../src/components/Common";
import { Button } from "../../../../src/components/Button";
import { spacing, typography, orderStatusMeta, brand } from "../../../../src/lib/theme";
import { OrderStatus } from "../../../../src/types/database";

const TIMELINE_STEPS: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];

export default function OrderDetailsScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const orderQ = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(id) });
  const reviewQ = useQuery({
    queryKey: ["review", id],
    queryFn: () => getReviewForOrder(id),
    enabled: orderQ.data?.status === "delivered",
  });

  useEffect(() => {
    const unsubscribe = subscribeToOrder(id, () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    });
    return unsubscribe;
  }, [id]);

  if (orderQ.isLoading || !orderQ.data) return <LoadingSpinner />;
  const order = orderQ.data;
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);
  const isTerminalNegative = order.status === "rejected" || order.status === "cancelled";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <View>
        <Text style={[typography.h1, { color: theme.textPrimary }]}>Commande #{order.short_code}</Text>
        <View style={{ marginTop: spacing.xs }}>
          <StatusBadge status={order.status} />
        </View>
      </View>

      {/* Status timeline */}
      {!isTerminalNegative && (
        <Card>
          {TIMELINE_STEPS.map((step, i) => {
            const meta = orderStatusMeta[step];
            const done = i <= currentStepIndex;
            return (
              <View key={step} style={styles.timelineRow}>
                <View style={styles.timelineIconCol}>
                  <Ionicons
                    name={done ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={done ? brand.green : theme.textSecondary}
                  />
                  {i < TIMELINE_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: i < currentStepIndex ? brand.green : theme.border }]} />
                  )}
                </View>
                <Text style={[typography.body, { color: done ? theme.textPrimary : theme.textSecondary, marginBottom: spacing.md }]}>
                  {meta.label}
                </Text>
              </View>
            );
          })}
        </Card>
      )}

      {/* Items */}
      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Articles</Text>
        {order.order_items?.map((item) => (
          <View key={item.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
            <Text style={{ color: theme.textPrimary }}>
              {item.quantity}× {item.name_snapshot}
            </Text>
            <Text style={{ color: theme.textSecondary }}>{(item.price_snapshot * item.quantity).toFixed(2)} DT</Text>
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>Total</Text>
          <Text style={[typography.bodyBold, { color: theme.primary }]}>{order.total.toFixed(2)} DT</Text>
        </View>
      </Card>

      {/* Delivery info */}
      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Livraison</Text>
        <Text style={{ color: theme.textSecondary }}>{order.delivery_address}</Text>
        <Text style={{ color: theme.textSecondary, marginTop: 2 }}>{order.phone}</Text>
        {order.note ? <Text style={{ color: theme.textSecondary, marginTop: 2 }}>Note : {order.note}</Text> : null}
      </Card>

      {/* Review CTA */}
      {order.status === "delivered" && !reviewQ.data && (
        <Button label="Laisser un avis" onPress={() => router.push(`/(customer)/orders/${order.id}/review`)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timelineRow: { flexDirection: "row", gap: spacing.sm },
  timelineIconCol: { alignItems: "center" },
  timelineLine: { width: 2, flex: 1, marginVertical: 2 },
  divider: { height: 1, marginVertical: spacing.sm },
});
