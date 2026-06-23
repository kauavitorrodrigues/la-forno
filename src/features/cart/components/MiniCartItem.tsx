"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/features/cart/types";

type Props = {
    item: CartItem;
};

export function MiniCartItem({ item }: Props) {
    const { removeItem, updateQuantity } = useCart();

    return (
        <li className="flex items-start gap-3 px-4 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border">
                <Image
                    src={item.pizza.imageUrl}
                    alt={item.pizza.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="line-clamp-1 text-sm font-medium">{item.pizza.name}</p>
                <p className="text-sm font-semibold">{formatPrice(item.pizza.price)}</p>

                <div className="mt-1.5 flex items-center gap-1">
                    <button
                        onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                        className="flex size-6 items-center justify-center rounded border border-border hover:bg-secondary transition-colors"
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                        className="flex size-6 items-center justify-center rounded border border-border hover:bg-secondary transition-colors"
                    >
                        <Plus className="size-3" />
                    </button>
                </div>
            </div>

            <button
                onClick={() => removeItem(item.pizza.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
            >
                <X className="size-3.5" />
            </button>
        </li>
    );
}
