import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { spacing, typography, radius } from "../../src/lib/theme";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const theme = useAppTheme();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setServerError(null);
    const { error } = await signIn(values.email, values.password);
    setLoading(false);
    if (error) setServerError(error);
    else router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
            <Text style={{ fontSize: 32 }}>🦀</Text>
          </View>
          <Text style={[typography.h1, { color: theme.textPrimary, marginTop: spacing.md }]}>
            Bon retour !
          </Text>
          <Text style={[typography.body, { color: theme.textSecondary }]}>
            Connectez-vous pour commander
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

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

        <Link href="/(auth)/forgot-password" style={{ alignSelf: "flex-end", marginBottom: spacing.md }}>
          <Text style={[typography.caption, { color: theme.primary }]}>Mot de passe oublié ?</Text>
        </Link>

        <Button label="Se connecter" onPress={handleSubmit(onSubmit)} loading={loading} />

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.lg }}>
          <Text style={{ color: theme.textSecondary }}>Pas encore de compte ? </Text>
          <Link href="/(auth)/register">
            <Text style={{ color: theme.primary, fontWeight: "700" }}>S'inscrire</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: spacing.lg },
  logoCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
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
