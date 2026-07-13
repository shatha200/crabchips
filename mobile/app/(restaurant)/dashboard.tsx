import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getDashboardStats } from "../../src/services/restaurantStats";
import { RESTAURANT_ID } from "../../src/config";
import { Card, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, brand } from "../../src/lib/theme";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const statsQ = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(RESTAURANT_ID),
    refetchInterval: 30_000, // light polling; order-management screen has realtime for live updates
  });

  if (statsQ.isLoading || !statsQ.data) return <LoadingSpinner />;
  const stats = statsQ.data;

  const tiles = [
    { label: "Commandes aujourd'hui", value: stats.todayOrders, color: brand.orange },
    { label: "Revenu aujourd'hui", value: `${stats.todayRevenue.toFixed(2)} DT`, color: brand.green },
    { label: "En attente", value: stats.pendingOrders, color: brand.orange },
    { label: "Livrées aujourd'hui", value: stats.deliveredOrders, color: brand.green },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={[typography.h1, { color: theme.textPrimary, marginBottom: spacing.lg }]}>Tableau de bord</Text>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Card key={tile.label} style={styles.tile}>
            <Text style={[typography.h2, { color: tile.color }]}>{tile.value}</Text>
            <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]}>{tile.label}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: { width: "47%" },
});
