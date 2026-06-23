"use client";

import { ShoppingCart } from "lucide-react";
import { SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/features/cart/store/cartStore";

export function CartTrigger() {
    const itemCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0)
    );

    return (
        <SheetTrigger asChild>
            <button className="relative flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors">
                <ShoppingCart className="size-4" />
                <span className="hidden sm:inline">Carrinho</span>
                {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-mono font-bold text-background">
                        {itemCount}
                    </span>
                )}
            </button>
        </SheetTrigger>
    );
}
