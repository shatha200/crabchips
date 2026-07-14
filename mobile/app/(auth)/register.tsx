import React, { useState } from "react";
import { View, Text } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button } from "../../src/components/Button";
import { TextField } from "../../src/components/TextField";
import { AuthCard } from "../../src/components/AuthCard";
import { spacing, typography } from "../../src/lib/theme";

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
      <AuthCard emoji="📧" title="Vérifiez votre email" subtitle="Un lien de confirmation vous a été envoyé. Confirmez-le puis connectez-vous.">
        <Button label="Aller à la connexion" onPress={() => router.replace("/(auth)/login")} />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Créer un compte" subtitle="Commandez vos plats préférés">
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Nom complet"
            icon="person-outline"
            placeholder="Votre nom"
            value={value}
            onChangeText={onChange}
            error={errors.fullName?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Téléphone"
            icon="call-outline"
            placeholder="+216 ..."
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="vous@exemple.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Mot de passe"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      {serverError && <Text style={{ color: theme.error, marginBottom: spacing.sm, fontSize: 13 }}>{serverError}</Text>}

      <Button label="S'inscrire" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.xs }} />

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.lg }}>
        <Text style={{ color: theme.textSecondary }}>Déjà un compte ? </Text>
        <Link href="/(auth)/login">
          <Text style={{ color: theme.primary, fontWeight: "700" }}>Se connecter</Text>
        </Link>
      </View>
    </AuthCard>
  );
}
