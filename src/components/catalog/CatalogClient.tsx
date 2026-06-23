"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Pizza } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { HeaderCartSheet } from "@/features/cart/components/HeaderCartSheet";
import { useCartStore } from "@/features/cart/store/cartStore";

const CATEGORIES = ["Todas", "Tradicionais", "Especiais", "Vegetarianas", "Doces"] as const;

type Props = {
    pizzas: Pizza[];
};

export function CatalogClient({ pizzas }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>("Todas");
    const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);

    const filtered =
        activeCategory === "Todas"
            ? pizzas
            : pizzas.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm tracking-tight">La Forno</span>
                        <span className="hidden sm:inline text-xs text-muted-foreground">
                            Pizzaria Artesanal
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-1 bg-secondary rounded-md p-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                        activeCategory === cat
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <HeaderCartSheet />
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="border-b border-border bg-secondary/40">
                <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                        Cardápio Digital
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">
                        Pizzas artesanais,
                        <br className="sm:hidden" /> entregues na sua porta
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Tempo médio de entrega: 40 min.
                    </p>
                    <div className="flex md:hidden flex-wrap gap-1.5 mt-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                                    activeCategory === cat
                                        ? "bg-foreground text-background border-foreground"
                                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Catalog Grid */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-16">
                        Nenhum item encontrado.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((pizza) => (
                            <PizzaCard
                                key={pizza.id}
                                pizza={pizza}
                                onSelect={() => setSelectedPizza(pizza)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border mt-16 py-8">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">La Forno</span>
                        <span className="text-muted-foreground">Pizzaria Artesanal</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                        Seg–Dom · 18h–23h · Tempo médio: 40 min
                    </p>
                </div>
            </footer>

            {/* Pizza Detail Modal */}
            <Dialog
                open={selectedPizza !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedPizza(null);
                }}
            >
                {selectedPizza && (
                    <PizzaModal
                        pizza={selectedPizza}
                        onClose={() => setSelectedPizza(null)}
                    />
                )}
            </Dialog>
        </div>
    );
}

type PizzaCardProps = {
    pizza: Pizza;
    onSelect: () => void;
};

function PizzaCard({ pizza, onSelect }: PizzaCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const cartItem = items.find((i) => i.pizza.id === pizza.id);
    const qty = cartItem?.quantity ?? 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({ id: pizza.id, name: pizza.name, price: pizza.price, imageUrl: pizza.imageUrl });
        toast.success(`${pizza.name} adicionada ao carrinho!`);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateQuantity(pizza.id, qty + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (qty <= 1) {
            removeItem(pizza.id);
        } else {
            updateQuantity(pizza.id, qty - 1);
        }
    };

    return (
        <div
            onClick={onSelect}
            className="border border-border rounded-lg overflow-hidden bg-card flex flex-col cursor-pointer hover:border-zinc-300 hover:shadow-md transition-all"
        >
            <div className="relative h-44 bg-secondary overflow-hidden">
                <Image
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-2 left-2">
                    <Badge
                        variant="secondary"
                        className="text-[10px] font-mono uppercase tracking-wider"
                    >
                        {pizza.category}
                    </Badge>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1 gap-3">
                <div>
                    <h3 className="font-semibold text-sm">{pizza.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {pizza.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-sm font-semibold">
                        {formatPrice(pizza.price)}
                    </span>

                    {qty === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="h-8 px-3 rounded-md border border-border text-xs font-medium hover:bg-secondary hover:border-zinc-300 transition-all active:scale-95"
                        >
                            + Adicionar
                        </button>
                    ) : (
                        <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleDecrease}
                                className="flex size-7 items-center justify-center rounded-md border border-border text-xs hover:bg-secondary transition-colors"
                            >
                                <Minus className="size-3" />
                            </button>
                            <span className="text-sm font-mono font-semibold w-4 text-center">
                                {qty}
                            </span>
                            <button
                                onClick={handleIncrease}
                                className="flex size-7 items-center justify-center rounded-md border border-border text-xs hover:bg-secondary transition-colors"
                            >
                                <Plus className="size-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

type PizzaModalProps = {
    pizza: Pizza;
    onClose: () => void;
};

function PizzaModal({ pizza, onClose }: PizzaModalProps) {
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const cartItem = items.find((i) => i.pizza.id === pizza.id);
    const qty = cartItem?.quantity ?? 0;

    const handleAdd = () => {
        addItem({ id: pizza.id, name: pizza.name, price: pizza.price, imageUrl: pizza.imageUrl });
        toast.success(`${pizza.name} adicionada ao carrinho!`);
    };

    const handleIncrease = () => updateQuantity(pizza.id, qty + 1);

    const handleDecrease = () => {
        if (qty <= 1) {
            removeItem(pizza.id);
        } else {
            updateQuantity(pizza.id, qty - 1);
        }
    };

    return (
        <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="relative h-56 bg-secondary overflow-hidden">
                <Image
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 448px"
                />
            </div>
            <div className="p-5 space-y-4">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-2">
                        <DialogTitle className="text-lg font-semibold">
                            {pizza.name}
                        </DialogTitle>
                        <span className="text-xs border border-border rounded-full px-2 py-0.5 text-muted-foreground font-mono shrink-0">
                            {pizza.category}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed text-left">
                        {pizza.description}
                    </p>
                </DialogHeader>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <span className="font-mono font-semibold text-base">
                        {formatPrice(pizza.price)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    {qty === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="flex-1 h-10 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
                        >
                            Adicionar ao carrinho
                        </button>
                    ) : (
                        <div className="flex flex-1 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDecrease}
                                    className="flex size-9 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                                >
                                    <Minus className="size-3.5" />
                                </button>
                                <span className="text-sm font-mono font-semibold w-5 text-center">
                                    {qty}
                                </span>
                                <button
                                    onClick={handleIncrease}
                                    className="flex size-9 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Ver carrinho
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}
