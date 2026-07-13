import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Switch, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "../../../src/contexts/ThemeContext";
import { getDish, getCategories, createDish, updateDish, uploadDishImage } from "../../../src/services/menu";
import { RESTAURANT_ID } from "../../../src/config";
import { Button } from "../../../src/components/Button";
import { LoadingSpinner } from "../../../src/components/Common";
import { spacing, typography, radius } from "../../../src/lib/theme";

const PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=60";

export default function DishFormScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  const dishQ = useQuery({ queryKey: ["dish", id], queryFn: () => getDish(id), enabled: !isNew });
  const categoriesQ = useQuery({ queryKey: ["categories"], queryFn: () => getCategories(RESTAURANT_ID) });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dishQ.data) {
      setName(dishQ.data.name);
      setDescription(dishQ.data.description ?? "");
      setPrice(String(dishQ.data.price));
      setCategoryId(dishQ.data.category_id ?? undefined);
      setIsAvailable(dishQ.data.is_available);
      setIsFeatured(dishQ.data.is_featured);
      setImageUri(dishQ.data.image_url);
    }
  }, [dishQ.data]);

  if (!isNew && dishQ.isLoading) return <LoadingSpinner />;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [4, 3],
      allowsEditing: true,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const onSave = async () => {
    const priceNum = parseFloat(price);
    if (!name.trim() || Number.isNaN(priceNum)) {
      setError("Nom et prix valides requis");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let finalImageUrl = imageUri;
      const dishId = isNew ? crypto.randomUUID() : id;

      if (isNew) {
        await createDish({
          restaurant_id: RESTAURANT_ID,
          category_id: categoryId ?? null,
          name: name.trim(),
          name_ar: null,
          description: description.trim() || null,
          price: priceNum,
          image_url: null,
          is_available: isAvailable,
          is_popular: false,
          is_featured: isFeatured,
        } as any);
      } else {
        await updateDish(id, {
          name: name.trim(),
          category_id: categoryId ?? null,
          description: description.trim() || null,
          price: priceNum,
          is_available: isAvailable,
          is_featured: isFeatured,
        });
      }

      // Upload image after the dish exists (needs a stable path), only if it's a local file.
      if (imageUri && imageUri.startsWith("file")) {
        finalImageUrl = await uploadDishImage(RESTAURANT_ID, dishId, imageUri);
        await updateDish(dishId, { image_url: finalImageUrl });
      }

      router.back();
    } catch (e: any) {
      setError(e.message ?? "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={[typography.h1, { color: theme.textPrimary }]}>{isNew ? "Ajouter un plat" : "Modifier le plat"}</Text>

      <Pressable onPress={pickImage}>
        <Image source={{ uri: imageUri ?? PLACEHOLDER }} style={styles.imagePreview} contentFit="cover" />
        <Text style={{ color: theme.primary, textAlign: "center", marginTop: spacing.xs }}>Changer l'image</Text>
      </Pressable>

      <TextInput placeholder="Nom du plat" placeholderTextColor={theme.textSecondary} value={name} onChangeText={setName} style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]} />
      <TextInput placeholder="Description" placeholderTextColor={theme.textSecondary} value={description} onChangeText={setDescription} multiline style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, minHeight: 80 }]} />
      <TextInput placeholder="Prix (DT)" placeholderTextColor={theme.textSecondary} value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]} />

      <Text style={[typography.bodyBold, { color: theme.textPrimary }]}>Catégorie</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {(categoriesQ.data ?? []).map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setCategoryId(cat.id)}
            style={[styles.chip, { backgroundColor: categoryId === cat.id ? theme.primary : theme.surface, borderColor: categoryId === cat.id ? theme.primary : theme.border }]}
          >
            <Text style={{ color: categoryId === cat.id ? theme.onPrimary : theme.textPrimary }}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={{ color: theme.textPrimary }}>Disponible</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ false: theme.border, true: theme.primary }} />
      </View>
      <View style={styles.switchRow}>
        <Text style={{ color: theme.textPrimary }}>Mettre en avant (page d'accueil)</Text>
        <Switch value={isFeatured} onValueChange={setIsFeatured} trackColor={{ false: theme.border, true: theme.primary }} />
      </View>

      {error && <Text style={{ color: theme.error }}>{error}</Text>}

      <Button label="Enregistrer" onPress={onSave} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imagePreview: { width: "100%", height: 180, borderRadius: radius.lg, backgroundColor: "#eee" },
  input: { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, fontSize: 15 },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
