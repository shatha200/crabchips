import { supabase } from "../lib/supabase";
import { CartItem, Order, OrderStatus } from "../types/database";

export interface CheckoutInput {
  restaurantId: string;
  items: CartItem[];
  deliveryAddress: string;
  phone: string;
  note?: string;
}

// Creates the order + its line items in one call. Order total/subtotal are
// computed from cart contents here; the DB doesn't recompute them, so this
// is the single source of truth for pricing at order time.
export async function createOrder({
  restaurantId,
  items,
  deliveryAddress,
  phone,
  note,
}: CheckoutInput): Promise<Order> {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const shortCode = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      short_code: shortCode,
      customer_id: userId,
      restaurant_id: restaurantId,
      status: "pending" as OrderStatus,
      delivery_address: deliveryAddress,
      phone,
      note: note || null,
      subtotal,
      total: subtotal, // extend here if delivery fees / promos are added later
    })
    .select()
    .single();
  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      dish_id: i.dishId,
      name_snapshot: i.name,
      price_snapshot: i.price,
      quantity: i.quantity,
    }))
  );
  if (itemsError) throw itemsError;

  return order as Order;
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (error) throw error;
  return data as Order;
}

// ---- Restaurant side ----

export async function getRestaurantOrders(
  restaurantId: string,
  statuses?: OrderStatus[]
): Promise<Order[]> {
  let query = supabase
    .from("orders")
    .select("*, order_items(*), profiles:customer_id(full_name, phone)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (statuses?.length) query = query.in("status", statuses);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as Order[];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

// Subscribes to realtime inserts/updates for a restaurant's orders so the
// Order Management screen updates live without polling.
export function subscribeToRestaurantOrders(
  restaurantId: string,
  onChange: (payload: { eventType: string; new: Order }) => void
) {
  const channel = supabase
    .channel(`restaurant-orders-${restaurantId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
      (payload) => onChange(payload as any)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// Subscribes a customer to updates on one specific order (used on the Order
// Details / tracking screen so status changes appear live).
export function subscribeToOrder(orderId: string, onChange: (order: Order) => void) {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
      (payload) => onChange(payload.new as Order)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
