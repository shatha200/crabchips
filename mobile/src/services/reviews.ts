import { supabase } from "../lib/supabase";
import { Review } from "../types/database";

export async function submitReview(input: {
  orderId: string;
  restaurantId: string;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      order_id: input.orderId,
      customer_id: userId,
      restaurant_id: input.restaurantId,
      rating: input.rating,
      comment: input.comment || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Review;
}

export async function getReviewForOrder(orderId: string): Promise<Review | null> {
  const { data, error } = await supabase.from("reviews").select("*").eq("order_id", orderId).maybeSingle();
  if (error) throw error;
  return data as Review | null;
}

export async function getRestaurantReviews(restaurantId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Review[];
}
