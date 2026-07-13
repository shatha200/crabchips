import { supabase } from "../lib/supabase";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export async function getDashboardStats(restaurantId: string): Promise<DashboardStats> {
  const todayStart = startOfToday();

  const [{ data: todayOrders }, { count: pendingCount }, { count: deliveredCount }] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", todayStart),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .in("status", ["pending", "accepted", "preparing", "ready", "out_for_delivery"]),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .eq("status", "delivered")
      .gte("created_at", todayStart),
  ]);

  const todayRevenue = (todayOrders ?? []).reduce((sum, o: any) => sum + Number(o.total), 0);

  return {
    todayOrders: todayOrders?.length ?? 0,
    todayRevenue,
    pendingOrders: pendingCount ?? 0,
    deliveredOrders: deliveredCount ?? 0,
  };
}

export interface FullStats {
  totalOrders: number;
  totalRevenue: number;
  mostPopular: { name: string; order_count: number }[];
  leastPopular: { name: string; order_count: number }[];
}

export async function getFullStatistics(restaurantId: string): Promise<FullStats> {
  const [{ data: allOrders }, { data: popular }, { data: unpopular }] = await Promise.all([
    supabase.from("orders").select("total").eq("restaurant_id", restaurantId).eq("status", "delivered"),
    supabase
      .from("dishes")
      .select("name, order_count")
      .eq("restaurant_id", restaurantId)
      .order("order_count", { ascending: false })
      .limit(5),
    supabase
      .from("dishes")
      .select("name, order_count")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("order_count", { ascending: true })
      .limit(5),
  ]);

  return {
    totalOrders: allOrders?.length ?? 0,
    totalRevenue: (allOrders ?? []).reduce((sum, o: any) => sum + Number(o.total), 0),
    mostPopular: popular ?? [],
    leastPopular: unpopular ?? [],
  };
}

// Customers who have ordered from this restaurant, with order counts.
export async function getRestaurantCustomers(restaurantId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("customer_id, delivery_address, phone, profiles:customer_id(full_name, phone)")
    .eq("restaurant_id", restaurantId);
  if (error) throw error;

  const byCustomer = new Map<string, { name: string; phone: string; address: string; orderCount: number }>();
  for (const row of data as any[]) {
    const existing = byCustomer.get(row.customer_id);
    if (existing) {
      existing.orderCount += 1;
    } else {
      byCustomer.set(row.customer_id, {
        name: row.profiles?.full_name ?? "Client",
        phone: row.profiles?.phone ?? row.phone,
        address: row.delivery_address,
        orderCount: 1,
      });
    }
  }
  return Array.from(byCustomer.entries()).map(([id, v]) => ({ id, ...v }));
}
