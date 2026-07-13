// Supabase Edge Function, triggered by a Database Webhook on
// public.order_status_events (AFTER INSERT). Sends an Expo push notification
// to the customer for order status changes, and to restaurant staff for new
// ('pending') orders.
//
// Deploy: supabase functions deploy notify-order-status
// Wire up: Supabase Dashboard → Database → Webhooks →
//   table: order_status_events, event: INSERT, → this function.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const STATUS_MESSAGES: Record<string, string> = {
  accepted: "Votre commande a été acceptée ✅",
  preparing: "Votre commande est en préparation 👨‍🍳",
  ready: "Votre commande est prête 🎉",
  out_for_delivery: "Votre commande est en cours de livraison 🚗",
  delivered: "Votre commande a été livrée. Bon appétit ! 😋",
  rejected: "Votre commande a été refusée.",
};

async function sendExpoPush(tokens: string[], title: string, body: string, data: Record<string, unknown>) {
  if (!tokens.length) return;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(
      tokens.map((to) => ({ to, title, body, data, sound: "default" }))
    ),
  });
}

serve(async (req) => {
  const payload = await req.json();
  const event = payload.record as { order_id: string; status: string };

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, short_code, customer_id, restaurant_id, restaurants(name)")
    .eq("id", event.order_id)
    .single();
  if (error || !order) return new Response("order not found", { status: 200 });

  if (event.status === "pending") {
    // Notify restaurant staff of a new order.
    const { data: staff } = await supabase
      .from("restaurant_staff")
      .select("user_id")
      .eq("restaurant_id", order.restaurant_id);

    const staffIds = (staff ?? []).map((s: { user_id: string }) => s.user_id);
    const { data: tokens } = await supabase
      .from("push_tokens")
      .select("expo_token")
      .in("user_id", staffIds.length ? staffIds : ["00000000-0000-0000-0000-000000000000"]);

    await sendExpoPush(
      (tokens ?? []).map((t: { expo_token: string }) => t.expo_token),
      "Nouvelle commande 🔔",
      `Commande ${order.short_code}`,
      { orderId: order.id, type: "new_order" }
    );
    return new Response("ok", { status: 200 });
  }

  const message = STATUS_MESSAGES[event.status];
  if (!message) return new Response("no-op", { status: 200 });

  const { data: tokens } = await supabase
    .from("push_tokens")
    .select("expo_token")
    .eq("user_id", order.customer_id);

  await sendExpoPush(
    (tokens ?? []).map((t: { expo_token: string }) => t.expo_token),
    (order as any).restaurants?.name ?? "Mise à jour de commande",
    message,
    { orderId: order.id, type: "status_update", status: event.status }
  );

  return new Response("ok", { status: 200 });
});
