import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartPizza } from "../types";
import { CART_STORAGE_KEY } from "../consts";

type CartState = {
    items: CartItem[];
    addItem: (pizza: CartPizza) => void;
    removeItem: (pizzaId: string) => void;
    updateQuantity: (pizzaId: string, quantity: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            addItem: (pizza) => {
                set((state) => {
                    const existing = state.items.find((item) => item.pizza.id === pizza.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.pizza.id === pizza.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { pizza, quantity: 1 }] };
                });
            },

            removeItem: (pizzaId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.pizza.id !== pizzaId),
                }));
            },

            updateQuantity: (pizzaId, quantity) => {
                if (quantity <= 0) return;
                set((state) => ({
                    items: state.items.map((item) =>
                        item.pizza.id === pizzaId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: CART_STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
