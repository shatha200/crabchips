import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme, useThemeToggle } from "../../src/contexts/ThemeContext";
import { useAuth } from "../../src/contexts/AuthContext";
import { getAddresses, addAddress, deleteAddress, updateProfile } from "../../src/services/addresses";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function ProfileScreen() {
  const theme = useAppTheme();
  const { themeMode, setThemeMode } = useThemeToggle();
  const { profile, session, signOut, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);

  const addressesQ = useQuery({
    queryKey: ["addresses", session?.user.id],
    queryFn: () => getAddresses(session!.user.id),
    enabled: !!session,
  });

  const onSaveProfile = async () => {
    if (!session) return;
    setSavingProfile(true);
    await updateProfile(session.user.id, { full_name: fullName, phone });
    await refreshProfile();
    setSavingProfile(false);
  };

  const onAddAddress = async () => {
    if (!session || !newAddressLine.trim()) return;
    setAddingAddress(true);
    await addAddress(session.user.id, newAddressLabel.trim() || "Adresse", newAddressLine.trim());
    setNewAddressLabel("");
    setNewAddressLine("");
    setAddingAddress(false);
    addressesQ.refetch();
  };

  const onLogout = () => {
    const performSignOut = async () => {
      await signOut();
    };

    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
      if (confirmLogout) {
        performSignOut();
      }
    } else {
      Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: performSignOut },
      ]);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>Mon profil</Text>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Informations</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nom complet"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        />
        <Button label="Enregistrer" onPress={onSaveProfile} loading={savingProfile} />
      </Card>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Adresses de livraison</Text>
        {(addressesQ.data ?? []).map((addr) => (
          <View key={addr.id} style={styles.addressRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>{addr.label}</Text>
              <Text style={{ color: theme.textSecondary }}>{addr.address_line}</Text>
            </View>
            <Pressable onPress={() => deleteAddress(addr.id).then(() => addressesQ.refetch())}>
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </Pressable>
          </View>
        ))}

        <TextInput
          value={newAddressLabel}
          onChangeText={setNewAddressLabel}
          placeholder="Libellé (ex: Domicile, Bureau)"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, marginTop: spacing.sm }]}
        />
        <TextInput
          value={newAddressLine}
          onChangeText={setNewAddressLine}
          placeholder="Adresse complète"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        />
        <Button label="Ajouter l'adresse" variant="outline" onPress={onAddAddress} loading={addingAddress} />
      </Card>

      <Card>
        <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.xs }]}>Apparence</Text>
        <Text style={[typography.caption, { color: theme.textSecondary, marginBottom: spacing.md }]}>
          Choisissez le mode d'affichage de l'application.
        </Text>
        <View style={styles.themeToggleRow}>
          {(["light", "dark", "system"] as const).map((mode) => {
            const active = themeMode === mode;
            const label = mode === "light" ? "Clair ☀️" : mode === "dark" ? "Sombre 🌙" : "Système 📱";
            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyBold,
                    {
                      color: active ? "#FFFFFF" : theme.textPrimary,
                      fontSize: 13,
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Button label="Se déconnecter" variant="danger" onPress={onLogout} style={{ marginBottom: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, fontSize: 15 },
  addressRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#00000010" },
  themeToggleRow: { flexDirection: "row", gap: spacing.sm, justifyContent: "space-between", marginTop: spacing.xs },
  themeButton: { flex: 1, height: 42, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
