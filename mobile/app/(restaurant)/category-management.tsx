import React, { useState } from "react";
import { View, Text, FlatList, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "../../src/contexts/ThemeContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../src/services/menu";
import { RESTAURANT_ID } from "../../src/config";
import { Button } from "../../src/components/Button";
import { EmptyState, LoadingSpinner } from "../../src/components/Common";
import { spacing, typography, radius } from "../../src/lib/theme";

export default function CategoryManagementScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => getCategories(RESTAURANT_ID) });

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const onAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await createCategory(RESTAURANT_ID, newName.trim(), categoriesQ.data?.length ?? 0);
    setNewName("");
    setSaving(false);
    refresh();
  };

  const onStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const onSaveEdit = async () => {
    if (!editingId) return;
    await updateCategory(editingId, { name: editingName.trim() });
    setEditingId(null);
    refresh();
  };

  const onDelete = (id: string) => {
    Alert.alert(
      "Supprimer la catégorie",
      "Les plats de cette catégorie ne seront pas supprimés, mais deviendront non classés.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: async () => { await deleteCategory(id); refresh(); } },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[typography.h1, { color: theme.textPrimary, padding: spacing.lg, paddingBottom: spacing.sm }]}>Catégories</Text>

      {categoriesQ.isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={categoriesQ.data ?? []}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
          ListEmptyComponent={<EmptyState title="Aucune catégorie" />}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: theme.card }]}>
              {editingId === item.id ? (
                <TextInput
                  value={editingName}
                  onChangeText={setEditingName}
                  autoFocus
                  onSubmitEditing={onSaveEdit}
                  style={[styles.editInput, { color: theme.textPrimary, borderColor: theme.border }]}
                />
              ) : (
                <Text style={[typography.bodyBold, { color: theme.textPrimary, flex: 1 }]}>{item.name}</Text>
              )}
              {editingId === item.id ? (
                <Pressable onPress={onSaveEdit}>
                  <Ionicons name="checkmark" size={22} color={theme.success} />
                </Pressable>
              ) : (
                <Pressable onPress={() => onStartEdit(item.id, item.name)}>
                  <Ionicons name="pencil-outline" size={20} color={theme.textSecondary} />
                </Pressable>
              )}
              <Pressable onPress={() => onDelete(item.id)} style={{ marginLeft: spacing.sm }}>
                <Ionicons name="trash-outline" size={20} color={theme.error} />
              </Pressable>
            </View>
          )}
        />
      )}

      <View style={{ flexDirection: "row", gap: spacing.sm, padding: spacing.lg }}>
        <TextInput
          placeholder="Nouvelle catégorie"
          placeholderTextColor={theme.textSecondary}
          value={newName}
          onChangeText={setNewName}
          style={[styles.newInput, { borderColor: theme.border, color: theme.textPrimary }]}
        />
        <Button label="Ajouter" onPress={onAdd} loading={saving} style={{ width: 110 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  editInput: { flex: 1, borderBottomWidth: 1.5, paddingVertical: 2, fontSize: 15, marginRight: spacing.sm },
  newInput: { flex: 1, borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 52 },
});
