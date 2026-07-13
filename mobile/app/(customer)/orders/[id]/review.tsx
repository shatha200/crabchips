import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../../../src/contexts/ThemeContext";
import { getOrder } from "../../../../src/services/orders";
import { submitReview } from "../../../../src/services/reviews";
import { StarRating, LoadingSpinner } from "../../../../src/components/Common";
import { Button } from "../../../../src/components/Button";
import { spacing, typography, radius } from "../../../../src/lib/theme";

export default function ReviewScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderQ = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(id) });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (orderQ.isLoading || !orderQ.data) return <LoadingSpinner />;

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitReview({
        orderId: id,
        restaurantId: orderQ.data!.restaurant_id,
        rating,
        comment: comment.trim() || undefined,
      });
      router.back();
    } catch (e: any) {
      setError(e.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Votre avis</Text>
      <Text style={[typography.body, { color: theme.textSecondary, marginBottom: spacing.lg }]}>
        Comment était votre commande #{orderQ.data.short_code} ?
      </Text>

      <View style={{ alignSelf: "center", marginBottom: spacing.lg }}>
        <StarRating rating={rating} size={40} onChange={setRating} />
      </View>

      <TextInput
        placeholder="Écrire un commentaire (optionnel)"
        placeholderTextColor={theme.textSecondary}
        value={comment}
        onChangeText={setComment}
        multiline
        style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
      />

      {error && <Text style={{ color: theme.error, marginTop: spacing.sm }}>{error}</Text>}

      <Button label="Envoyer l'avis" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  input: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, minHeight: 100, textAlignVertical: "top" },
});
