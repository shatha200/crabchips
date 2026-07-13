import { supabase } from "../lib/supabase";
import { Category, Dish, Restaurant } from "../types/database";

export async function getRestaurant(restaurantId: string): Promise<Restaurant> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();
  if (error) throw error;
  return data as Restaurant;
}

export async function getCategories(restaurantId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order");
  if (error) throw error;
  return data as Category[];
}

export interface DishFilters {
  categoryId?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "popularity";
}

export async function getDishes(restaurantId: string, filters: DishFilters = {}): Promise<Dish[]> {
  let query = supabase.from("dishes").select("*").eq("restaurant_id", restaurantId);

  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);

  if (filters.sortBy === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sortBy === "price_desc") query = query.order("price", { ascending: false });
  else if (filters.sortBy === "popularity") query = query.order("order_count", { ascending: false });
  else query = query.order("name");

  const { data, error } = await query;
  if (error) throw error;
  return data as Dish[];
}

export async function getFeaturedDishes(restaurantId: string): Promise<Dish[]> {
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_featured", true)
    .eq("is_available", true);
  if (error) throw error;
  return data as Dish[];
}

export async function getPopularDishes(restaurantId: string): Promise<Dish[]> {
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("order_count", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Dish[];
}

export async function getDish(dishId: string): Promise<Dish> {
  const { data, error } = await supabase.from("dishes").select("*").eq("id", dishId).single();
  if (error) throw error;
  return data as Dish;
}

// ---- Restaurant-side management (requires restaurant_staff RLS membership) ----

export async function createCategory(restaurantId: string, name: string, sortOrder = 0) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ restaurant_id: restaurantId, name, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, patch: Partial<Category>) {
  const { error } = await supabase.from("categories").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function createDish(dish: Omit<Dish, "id" | "order_count">) {
  const { data, error } = await supabase.from("dishes").insert(dish).select().single();
  if (error) throw error;
  return data as Dish;
}

export async function updateDish(id: string, patch: Partial<Dish>) {
  const { error } = await supabase.from("dishes").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteDish(id: string) {
  const { error } = await supabase.from("dishes").delete().eq("id", id);
  if (error) throw error;
}

export async function setDishAvailability(id: string, isAvailable: boolean) {
  await updateDish(id, { is_available: isAvailable });
}

// Uploads a local image URI (from expo-image-picker) to Supabase Storage
// and returns its public URL, for use as a dish's image_url.
export async function uploadDishImage(restaurantId: string, dishId: string, localUri: string) {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const path = `${restaurantId}/${dishId}-${Date.now()}.jpg`;

  const { error } = await supabase.storage.from("dish-images").upload(path, blob, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("dish-images").getPublicUrl(path);
  return data.publicUrl;
}
