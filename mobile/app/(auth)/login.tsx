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
import { spacing } from "../../src/lib/theme";

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
    <AuthCard title="Bon retour !" subtitle="Connectez-vous pour commander">
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

      <Link href="/(auth)/forgot-password" style={{ alignSelf: "flex-end", marginBottom: spacing.md }}>
        <Text style={{ color: theme.primary, fontSize: 13, fontWeight: "600" }}>Mot de passe oublié ?</Text>
      </Link>

      <Button label="Se connecter" onPress={handleSubmit(onSubmit)} loading={loading} />

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: spacing.lg }}>
        <Text style={{ color: theme.textSecondary }}>Pas encore de compte ? </Text>
        <Link href="/(auth)/register">
          <Text style={{ color: theme.primary, fontWeight: "700" }}>S'inscrire</Text>
        </Link>
      </View>
    </AuthCard>
  );
}
