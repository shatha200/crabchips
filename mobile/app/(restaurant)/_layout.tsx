import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../src/contexts/ThemeContext";

export default function RestaurantLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Tableau de bord", tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="order-management" options={{ title: "Commandes", tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="menu-management" options={{ title: "Menu", tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="customers" options={{ title: "Clients", tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="statistics" options={{ title: "Statistiques", tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="category-management" options={{ href: null }} />
      <Tabs.Screen name="dish-form/[id]" options={{ href: null }} />
    </Tabs>
  );
}
