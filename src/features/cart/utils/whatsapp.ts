import type { CartItem, CustomerData } from "../types";
import { WHATSAPP_PHONE } from "../consts";
import { formatPrice } from "@/lib/utils";

function buildOrderMessage(items: CartItem[], customer: CustomerData): string {
    const lines: string[] = [];

    lines.push("*Pedido — La Forno*");
    lines.push("");
    lines.push(`*Nome:* ${customer.name}`);
    lines.push(`*CEP:* ${customer.cep}`);
    lines.push(`*Estado:* ${customer.state}`);
    lines.push(`*Cidade:* ${customer.city}`);
    lines.push(`*Bairro:* ${customer.district}`);
    lines.push(`*Rua:* ${customer.street}, ${customer.number}`);

    if (customer.complement) {
        lines.push(`*Complemento:* ${customer.complement}`);
    }

    lines.push("");
    lines.push("*Pizzas:*");

    items.forEach((item) => {
        const itemTotal = item.pizza.price * item.quantity;
        lines.push(`• ${item.quantity}x ${item.pizza.name} — ${formatPrice(itemTotal)}`);
    });

    const total = items.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0);

    lines.push("");
    lines.push(`*Total: ${formatPrice(total)}*`);

    return lines.join("\n");
}

export function buildWhatsAppUrl(
    items: CartItem[],
    customer: CustomerData,
    phone: string = WHATSAPP_PHONE
): string {
    const message = buildOrderMessage(items, customer);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
