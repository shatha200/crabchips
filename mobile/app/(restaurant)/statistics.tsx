import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getFullStatistics } from "../../src/services/restaurantStats";
import { RESTAURANT_ID } from "../../src/config";
import { Card, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, brand } from "../../src/lib/theme";

export default function StatisticsScreen() {
  const theme = useAppTheme();
  const statsQ = useQuery({ queryKey: ["full-stats"], queryFn: () => getFullStatistics(RESTAURANT_ID) });

  if (statsQ.isLoading || !statsQ.data) return <LoadingSpinner />;
  const stats = statsQ.data;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Statistiques</Text>

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Card style={{ flex: 1 }}>
          <Text style={[typography.h2, { color: brand.orange }]}>{stats.totalOrders}</Text>
          <Text style={[typography.caption, { color: theme.textSecondary }]}>Commandes totales</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={[typography.h2, { color: brand.green }]}>{stats.totalRevenue.toFixed(2)} DT</Text>
          <Text style={[typography.caption, { color: theme.textSecondary }]}>Revenu total</Text>
        </Card>
      </View>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Plats les plus populaires</Text>
        {stats.mostPopular.map((d, i) => (
          <View key={i} style={styles.statRow}>
            <Text style={{ color: theme.textPrimary }}>{d.name}</Text>
            <Text style={{ color: theme.textSecondary }}>{d.order_count} commandes</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Plats les moins populaires</Text>
        {stats.leastPopular.map((d, i) => (
          <View key={i} style={styles.statRow}>
            <Text style={{ color: theme.textPrimary }}>{d.name}</Text>
            <Text style={{ color: theme.textSecondary }}>{d.order_count} commandes</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
});
