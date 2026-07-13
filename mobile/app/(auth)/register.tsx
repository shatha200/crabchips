import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { spacing, typography, radius } from "../../src/lib/theme";

const schema = z.object({
  fullName: z.string().min(2, "Nom requis"),
  phone: z.string().min(8, "Numéro invalide"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const theme = useAppTheme();
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setServerError(null);
    const { error } = await signUp(values);
    setLoading(false);
    if (error) setServerError(error);
    else setSuccess(true);
  };

  if (success) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: "center" }]}>
        <Text style={[typography.h2, { color: theme.textPrimary, textAlign: "center" }]}>
          Vérifiez votre email 📧
        </Text>
        <Text style={[typography.body, { color: theme.textSecondary, textAlign: "center", marginTop: spacing.sm }]}>
          Un lien de confirmation vous a été envoyé. Confirmez-le puis connectez-vous.
        </Text>
        <Button label="Aller à la connexion" onPress={() => router.replace("/(auth)/login")} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[typography.h1, { color: theme.textPrimary, marginBottom: spacing.xs }]}>
          Créer un compte
        </Text>
        <Text style={[typography.body, { color: theme.textSecondary, marginBottom: spacing.lg }]}>
          Commandez vos plats préférés
        </Text>

        {(
          [
            { name: "fullName" as const, placeholder: "Nom complet", keyboardType: "default" as const },
            { name: "phone" as const, placeholder: "Téléphone", keyboardType: "phone-pad" as const },
            { name: "email" as const, placeholder: "Email", keyboardType: "email-address" as const },
          ]
        ).map((f) => (
          <View key={f.name}>
            <Controller
              control={control}
              name={f.name}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={f.placeholder}
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="none"
                  keyboardType={f.keyboardType}
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
                />
              )}
            />
            {errors[f.name] && <Text style={styles.error}>{errors[f.name]?.message}</Text>}
          </View>
        ))}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={value}
              onChangeText={onChange}
              style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        {serverError && <Text style={styles.error}>{serverError}</Text>}

        <Button label="S'inscrire" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.sm }} />

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.lg }}>
          <Text style={{ color: theme.textSecondary }}>Déjà un compte ? </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: theme.primary, fontWeight: "700" }}>Se connecter</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  error: { color: "#D64545", marginBottom: spacing.sm, fontSize: 13 },
});
