import { prisma } from "@/lib/db";
import { PizzasTable } from "@/components/admin/PizzasTable";

export const dynamic = "force-dynamic";

export default async function AdminPizzasPage() {
    const pizzas = await prisma.pizza.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Pizzas</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie o cardápio da La Forno
                </p>
            </div>
            <PizzasTable pizzas={pizzas} />
        </div>
    );
}
