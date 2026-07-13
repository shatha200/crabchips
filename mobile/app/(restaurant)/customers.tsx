import React from "react";
import { View, Text, FlatList, Linking, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getRestaurantCustomers } from "../../src/services/restaurantStats";
import { RESTAURANT_ID } from "../../src/config";
import { EmptyState, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function CustomersScreen() {
  const theme = useAppTheme();
  const customersQ = useQuery({ queryKey: ["restaurant-customers"], queryFn: () => getRestaurantCustomers(RESTAURANT_ID) });

  if (customersQ.isLoading) return <LoadingSpinner />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[typography.h1, { color: theme.textPrimary, padding: spacing.lg, paddingBottom: spacing.sm }]}>Clients</Text>
      <FlatList
        data={customersQ.data ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.md }}
        ListEmptyComponent={<EmptyState icon="people-outline" title="Aucun client pour le moment" />}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>{item.name}</Text>
              <Text style={[typography.caption, { color: theme.textSecondary }]}>{item.orderCount} commande(s)</Text>
            </View>
            <Text style={{ color: theme.textSecondary, marginTop: 4 }}>{item.address}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${item.phone}`)} style={styles.phoneRow}>
              <Ionicons name="call-outline" size={16} color={theme.primary} />
              <Text style={{ color: theme.primary }}>{item.phone}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.md, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
});
