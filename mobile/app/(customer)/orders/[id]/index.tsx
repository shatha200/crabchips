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
        <Card style={{ paddingVertical: spacing.lg }}>
          {TIMELINE_STEPS.map((step, i) => {
            const meta = orderStatusMeta[step];
            const done = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <View key={step} style={styles.timelineRow}>
                <View style={styles.timelineIconCol}>
                  <View style={[
                    styles.iconOuter,
                    {
                      backgroundColor: done ? (isCurrent ? brand.orange + "1A" : brand.green + "10") : theme.border + "30",
                      borderColor: done ? (isCurrent ? brand.orange : brand.green) : theme.border,
                      borderWidth: 1,
                    }
                  ]}>
                    <Ionicons
                      name={done ? (isCurrent ? "reload-outline" : "checkmark-sharp") : "ellipse"}
                      size={14}
                      color={done ? (isCurrent ? brand.orange : brand.green) : theme.textSecondary + "40"}
                    />
                  </View>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: i < currentStepIndex ? brand.green : theme.border }]} />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: i < TIMELINE_STEPS.length - 1 ? spacing.md : 0, minHeight: 28, justifyContent: "center" }}>
                  <Text style={[
                    typography.bodyBold,
                    {
                      color: done ? theme.textPrimary : theme.textSecondary,
                      fontSize: 15,
                      fontWeight: isCurrent ? "700" : done ? "600" : "400"
                    }
                  ]}>
                    {meta.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {/* Items */}
      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.md, fontSize: 16 }]}>Articles</Text>
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

      {/* Delivery info */}
      <Card style={{ gap: 4 }}>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.xs, fontSize: 16 }]}>Livraison</Text>
        <Text style={[typography.body, { color: theme.textSecondary, fontSize: 14 }]}>{order.delivery_address}</Text>
        <Text style={[typography.body, { color: theme.textSecondary, fontSize: 14 }]}>{order.phone}</Text>
        {order.note ? <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4, fontStyle: "italic" }]}>Note : {order.note}</Text> : null}
      </Card>

      {/* Review CTA */}
      {order.status === "delivered" && !reviewQ.data && (
        <Button label="Laisser un avis" onPress={() => router.push(`/(customer)/orders/${order.id}/review`)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timelineRow: { flexDirection: "row", gap: spacing.md },
  timelineIconCol: { alignItems: "center", width: 28 },
  timelineLine: { width: 3, flex: 1, marginVertical: 4, borderRadius: 1.5 },
  divider: { height: 1, marginVertical: spacing.sm },
  iconOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
});
