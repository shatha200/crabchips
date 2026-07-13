export type UserRole = "customer" | "restaurant_owner" | "restaurant_staff";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line: string;
  is_default: boolean;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  maps_url: string | null;
  is_open: boolean;
  rating: number;
  review_count: number;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  name_ar: string | null;
  sort_order: number;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  name_ar: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_featured: boolean;
  order_count: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string | null;
  name_snapshot: string;
  price_snapshot: number;
  quantity: number;
}

export interface Order {
  id: string;
  short_code: string;
  customer_id: string;
  restaurant_id: string;
  status: OrderStatus;
  payment_method: "cash_on_delivery";
  delivery_address: string;
  phone: string;
  note: string | null;
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: Pick<Profile, "full_name" | "phone">;
}

export interface Review {
  id: string;
  order_id: string;
  customer_id: string;
  restaurant_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Cart is client-only until checkout, so it isn't in the DB schema.
export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}
