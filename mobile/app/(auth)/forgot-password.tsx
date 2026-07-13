import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function ForgotPasswordScreen() {
  const theme = useAppTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Mot de passe oublié</Text>
      <Text style={[typography.body, { color: theme.textSecondary, marginBottom: spacing.lg }]}>
        Entrez votre email, nous vous enverrons un lien de réinitialisation.
      </Text>

      {sent ? (
        <Text style={[typography.body, { color: theme.success }]}>
          Email envoyé ! Vérifiez votre boîte de réception.
        </Text>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
          />
          {error && <Text style={{ color: theme.error, marginBottom: spacing.sm }}>{error}</Text>}
          <Button label="Envoyer le lien" onPress={onSubmit} loading={loading} />
        </>
      )}

      <Button label="Retour à la connexion" variant="ghost" onPress={() => router.replace("/(auth)/login")} style={{ marginTop: spacing.md }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 15,
  },
});
