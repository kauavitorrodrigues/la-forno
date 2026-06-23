import { prisma } from "@/lib/db";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
    const pizzas = await prisma.pizza.findMany({
        orderBy: { createdAt: "asc" },
    });

    return <CatalogClient pizzas={pizzas} />;
}
