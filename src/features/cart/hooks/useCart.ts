import { useCartStore } from "../store/cartStore";
import { useCartTotal } from "./useCartTotal";

export function useCart() {
    const items = useCartStore((state) => state.items);
    const addItem = useCartStore((state) => state.addItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = useCartTotal();

    return { items, addItem, removeItem, updateQuantity, clearCart, total };
}
