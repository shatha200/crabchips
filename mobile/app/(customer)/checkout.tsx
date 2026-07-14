import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { useCartStore } from "../../src/store/cartStore";
import { getAddresses } from "../../src/services/addresses";
import { createOrder } from "../../src/services/orders";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function CheckoutScreen() {
  const theme = useAppTheme();
  const { profile, session } = useAuth();
  const { items, note, restaurantId, subtotal, clear } = useCartStore();

  const addressesQ = useQuery({
    queryKey: ["addresses", session?.user.id],
    queryFn: () => getAddresses(session!.user.id),
    enabled: !!session,
  });

  const defaultAddress = addressesQ.data?.find((a) => a.is_default) ?? addressesQ.data?.[0];

  const [address, setAddress] = useState(defaultAddress?.address_line ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (defaultAddress && !address) setAddress(defaultAddress.address_line);
  }, [defaultAddress]);

  const canSubmit = address.trim().length > 3 && phone.trim().length > 6 && !!restaurantId;

  const onConfirm = async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);
    try {
      const order = await createOrder({
        restaurantId,
        items,
        deliveryAddress: address.trim(),
        phone: phone.trim(),
        note,
      });
      clear();
      router.replace(`/(customer)/orders/${order.id}`);
    } catch (e: any) {
      setError(e.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h1, { color: theme.textPrimary, fontSize: 26, marginBottom: spacing.xs }]}>Livraison</Text>

      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 14 }]}>Adresse de livraison</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Ex: Rue Habib Bourguiba, Tunis"
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.card, minHeight: 70 }]}
        />
      </View>

      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 14 }]}>Numéro de téléphone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+216 ..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.card }]}
        />
      </View>

      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 14 }]}>Méthode de paiement</Text>
        <Card style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.md }}>
          <Text style={{ fontSize: 18 }}>💵</Text>
          <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>Paiement à la livraison</Text>
        </Card>
      </View>

      <Card style={{ gap: spacing.xs, marginTop: spacing.xs }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
          <Text style={[typography.caption, { color: theme.textSecondary, fontSize: 14 }]}>Sous-total</Text>
          <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 14 }]}>{subtotal().toFixed(2)} DT</Text>
        </View>
        <View style={{ height: 1, backgroundColor: theme.border, marginVertical: spacing.xs }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[typography.bodyBold, { color: theme.textPrimary, fontSize: 16 }]}>Total</Text>
          <Text style={[typography.h3, { color: theme.primary, fontSize: 18, fontWeight: "800" }]}>{subtotal().toFixed(2)} DT</Text>
        </View>
      </Card>

      {error && <Text style={{ color: theme.error, fontSize: 14, textAlign: "center" }}>{error}</Text>}

      <Button label="Confirmer la commande" onPress={onConfirm} loading={loading} disabled={!canSubmit} style={{ marginTop: spacing.sm }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
  },
});
