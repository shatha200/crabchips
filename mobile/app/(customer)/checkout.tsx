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
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Livraison</Text>

      <View>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Adresse de livraison</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Ex: Rue Habib Bourguiba, Tunis"
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, minHeight: 60 }]}
        />
      </View>

      <View>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Numéro de téléphone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+216 ..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        />
      </View>

      <View>
        <Text style={[typography.bodyBold, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Méthode de paiement</Text>
        <Card>
          <Text style={{ color: theme.textPrimary }}>💵 Paiement à la livraison</Text>
        </Card>
      </View>

      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
          <Text style={{ color: theme.textSecondary }}>Sous-total</Text>
          <Text style={{ color: theme.textPrimary }}>{subtotal().toFixed(2)} DT</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>Total</Text>
          <Text style={[typography.bodyBold, { color: theme.primary }]}>{subtotal().toFixed(2)} DT</Text>
        </View>
      </Card>

      {error && <Text style={{ color: theme.error }}>{error}</Text>}

      <Button label="Confirmer la commande" onPress={onConfirm} loading={loading} disabled={!canSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, fontSize: 15 },
});
