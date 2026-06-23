"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const pizzaSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    price: z.coerce.number().positive("Preço deve ser positivo"),
    category: z.enum(["Tradicionais", "Especiais", "Vegetarianas", "Doces"], {
        required_error: "Categoria é obrigatória",
    }),
    imageUrl: z.string().url("URL de imagem inválida"),
});

type PizzaFormData = z.infer<typeof pizzaSchema>;

type ActionResult =
    | { success: true }
    | { success: false; error: string };

export async function createPizzaAction(data: PizzaFormData): Promise<ActionResult> {
    const parsed = pizzaSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.pizza.create({
        data: parsed.data,
    });

    revalidatePath("/admin/pizzas");
    revalidatePath("/");

    return { success: true };
}

export async function updatePizzaAction(
    id: string,
    data: PizzaFormData
): Promise<ActionResult> {
    const parsed = pizzaSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const existing = await prisma.pizza.findUnique({ where: { id } });

    if (!existing) {
        return { success: false, error: "Pizza não encontrada." };
    }

    await prisma.pizza.update({
        where: { id },
        data: parsed.data,
    });

    revalidatePath("/admin/pizzas");
    revalidatePath("/");

    return { success: true };
}

export async function deletePizzaAction(id: string): Promise<ActionResult> {
    const existing = await prisma.pizza.findUnique({ where: { id } });

    if (!existing) {
        return { success: false, error: "Pizza não encontrada." };
    }

    await prisma.pizza.delete({ where: { id } });

    revalidatePath("/admin/pizzas");
    revalidatePath("/");

    return { success: true };
}
