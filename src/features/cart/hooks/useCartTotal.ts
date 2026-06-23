import { useCartStore } from "../store/cartStore";

export function useCartTotal(): number {
    return useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)
    );
}
