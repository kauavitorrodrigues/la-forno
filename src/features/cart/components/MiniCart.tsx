"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/features/cart/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { MiniCartItem } from "./MiniCartItem";

type Props = {
    onClose: () => void;
};

export function MiniCart({ onClose }: Props) {
    const { items, total } = useCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <SheetContent side="right" className="flex flex-col gap-0 p-0 sm:max-w-sm">
            <SheetHeader className="border-b px-4 py-4">
                <SheetTitle>
                    Carrinho{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                        ({itemCount} {itemCount === 1 ? "item" : "itens"})
                    </span>
                </SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
                    <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                        <ShoppingCart className="size-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Seu carrinho está vazio</p>
                    <p className="text-xs text-muted-foreground">
                        Adicione algumas pizzas para continuar.
                    </p>
                </div>
            ) : (
                <ul className="flex-1 divide-y overflow-y-auto">
                    {items.map((item) => (
                        <MiniCartItem key={item.pizza.id} item={item} />
                    ))}
                </ul>
            )}

            {items.length > 0 && (
                <SheetFooter className="border-t flex-col gap-2 px-4 py-3">
                    <div className="flex w-full items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold font-mono">{formatPrice(total)}</span>
                    </div>
                    <Link
                        href="/cart"
                        onClick={onClose}
                        className="flex h-9 w-full items-center justify-center rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
                    >
                        Ir para o carrinho
                    </Link>
                </SheetFooter>
            )}
        </SheetContent>
    );
}
