"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { CartItem, CustomerData } from "../types";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { loadCustomerData } from "../hooks/useCustomerData";
import { DeliveryForm } from "./DeliveryForm";
import type { DeliverySchemaType } from "../schemas/delivery.schema";

type Props = {
    items: CartItem[];
    total: number;
};

const EMPTY_DEFAULTS: DeliverySchemaType = {
    name: "",
    cep: "",
    state: "",
    city: "",
    district: "",
    street: "",
    number: "",
    complement: "",
};

function buildDefaults(): DeliverySchemaType {
    if (typeof window === "undefined") return EMPTY_DEFAULTS;
    const saved = loadCustomerData();
    if (!saved) return EMPTY_DEFAULTS;
    return { ...saved, complement: saved.complement ?? "" };
}

export function CartSummary({ items, total }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = (customer: CustomerData) => {
        setIsSubmitting(true);
        const url = buildWhatsAppUrl(items, customer);
        window.open(url, "_blank");
        setIsSubmitting(false);
    };

    return (
        <Card className="sticky top-20">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        {items.reduce((s, i) => s + i.quantity, 0)} itens
                    </span>
                    <span className="font-mono font-semibold">{formatPrice(total)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Total</span>
                    <span className="text-xl font-bold font-mono">{formatPrice(total)}</span>
                </div>

                <Separator />

                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold">Informações de Entrega</h3>
                    <p className="text-xs text-muted-foreground">
                        Preencha seus dados para enviar o pedido via WhatsApp.
                    </p>
                </div>

                <DeliveryForm
                    defaultValues={buildDefaults()}
                    onSubmit={handleCheckout}
                    isSubmitting={isSubmitting}
                />
            </CardContent>
        </Card>
    );
}
