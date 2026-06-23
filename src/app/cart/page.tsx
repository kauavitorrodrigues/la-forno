"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { items, total, removeItem, updateQuantity } = useCart();

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Cardápio</span>
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm font-medium">Carrinho</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                        <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
                            <ShoppingBag className="size-9 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
                        <p className="text-sm text-muted-foreground">
                            Adicione algumas pizzas para continuar.
                        </p>
                        <Link
                            href="/"
                            className="mt-2 flex h-9 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            Voltar ao cardápio
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                        <div className="flex flex-1 flex-col gap-3">
                            <h1 className="text-xl font-semibold tracking-tight">Seu Pedido</h1>
                            <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
                                {items.map((item) => (
                                    <div key={item.pizza.id} className="flex items-center gap-4 p-4">
                                        <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border">
                                            <Image
                                                src={item.pizza.imageUrl}
                                                alt={item.pizza.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <p className="text-sm font-medium truncate">
                                                {item.pizza.name}
                                            </p>
                                            <p className="text-sm font-mono text-muted-foreground">
                                                {formatPrice(item.pizza.price)} / un.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.pizza.id, item.quantity - 1)
                                                }
                                                disabled={item.quantity <= 1}
                                                className="flex size-7 items-center justify-center rounded border border-border hover:bg-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm tabular-nums font-mono font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.pizza.id, item.quantity + 1)
                                                }
                                                className="flex size-7 items-center justify-center rounded border border-border hover:bg-secondary transition-colors"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>

                                        <p className="w-20 text-right text-sm font-mono font-semibold shrink-0">
                                            {formatPrice(item.pizza.price * item.quantity)}
                                        </p>

                                        <button
                                            onClick={() => removeItem(item.pizza.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:max-w-sm">
                            <CartSummary items={items} total={total} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
