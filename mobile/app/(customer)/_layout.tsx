import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useCartStore } from "../../src/store/cartStore";
import { brand } from "../../src/lib/theme";

function CartIcon({ color, size }: { color: string; size: number }) {
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 && (
        <View style={{
          position: "absolute", top: -4, right: -8, backgroundColor: brand.red,
          borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
        }}>
          <View />
        </View>
      )}
    </View>
  );
}

export default function CustomerLayout() {
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
      <Tabs.Screen name="home" options={{ title: "Accueil", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: "Menu", tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="cart" options={{ title: "Panier", tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} /> }} />
      <Tabs.Screen name="orders" options={{ title: "Commandes", tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profil", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
      {/* checkout + dish/order details are pushed from within tabs, hidden from the tab bar */}
      <Tabs.Screen name="checkout" options={{ href: null }} />
    </Tabs>
  );
}
