import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem } from "../types/database";

interface CartState {
  restaurantId: string | null;
  items: CartItem[];
  note: string;
  addItem: (restaurantId: string, item: CartItem) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  removeItem: (dishId: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      items: [],
      note: "",

      addItem: (restaurantId, item) => {
        const state = get();
        // Cart is single-restaurant: adding from a different restaurant
        // replaces the cart, same behavior customers expect from food apps.
        if (state.restaurantId && state.restaurantId !== restaurantId) {
          set({ restaurantId, items: [item], note: "" });
          return;
        }
        const existing = state.items.find((i) => i.dishId === item.dishId);
        if (existing) {
          set({
            restaurantId,
            items: state.items.map((i) =>
              i.dishId === item.dishId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ restaurantId, items: [...state.items, item] });
        }
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set({ items: get().items.map((i) => (i.dishId === dishId ? { ...i, quantity } : i)) });
      },

      removeItem: (dishId) => {
        const remaining = get().items.filter((i) => i.dishId !== dishId);
        set({ items: remaining, restaurantId: remaining.length ? get().restaurantId : null });
      },

      setNote: (note) => set({ note }),

      clear: () => set({ restaurantId: null, items: [], note: "" }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
