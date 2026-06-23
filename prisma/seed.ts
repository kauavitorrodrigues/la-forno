import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.user.upsert({
        where: { email: "admin@laforno.com" },
        update: {},
        create: {
            email: "admin@laforno.com",
            password: hashedPassword,
        },
    });

    await prisma.pizza.deleteMany({});

    await prisma.pizza.createMany({
        data: [
            {
                name: "Margherita",
                description:
                    "Molho de tomate artesanal, mozzarella de búfala, manjericão fresco e azeite extra-virgem.",
                price: 42,
                category: "Tradicionais",
                imageUrl:
                    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Calabresa",
                description:
                    "Molho artesanal, mozzarella, calabresa fatiada na hora e cebola roxa caramelizada.",
                price: 48,
                category: "Tradicionais",
                imageUrl:
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Quatro Queijos",
                description:
                    "Mozzarella, gorgonzola, parmesão e provolone com toque de alecrim fresco.",
                price: 52,
                category: "Tradicionais",
                imageUrl:
                    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Frango com Catupiry",
                description:
                    "Peito de frango desfiado, catupiry cremoso, milho verde e azeitonas pretas.",
                price: 55,
                category: "Especiais",
                imageUrl:
                    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Camarão Rosa",
                description:
                    "Camarões salteados, requeijão cremoso, tomate cereja e coentro fresco.",
                price: 68,
                category: "Especiais",
                imageUrl:
                    "https://images.unsplash.com/photo-1571407970349-bc81e71e4580?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Trufa Negra & Cogumelos",
                description:
                    "Mix de cogumelos shiitake e paris, creme de trufa negra, rúcula e parmesão raspado.",
                price: 79,
                category: "Especiais",
                imageUrl:
                    "https://images.unsplash.com/photo-1520201163981-8cc9f32a7f87?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Primavera",
                description:
                    "Abobrinha, pimentão colorido, tomate cereja, rúcula fresca e molho pesto caseiro.",
                price: 46,
                category: "Vegetarianas",
                imageUrl:
                    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Espinafre & Ricota",
                description:
                    "Creme de ricota, espinafre refogado, tomate seco e nozes torradas.",
                price: 49,
                category: "Vegetarianas",
                imageUrl:
                    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Nutella & Morango",
                description:
                    "Base doce com Nutella, morangos frescos, leite condensado e coco ralado.",
                price: 44,
                category: "Doces",
                imageUrl:
                    "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=480&q=80&auto=format&fit=crop",
            },
            {
                name: "Romeu e Julieta",
                description:
                    "Mozzarella derretida com goiabada cascão e canela polvilhada.",
                price: 40,
                category: "Doces",
                imageUrl:
                    "https://images.unsplash.com/photo-1548369937-47519962c11a?w=480&q=80&auto=format&fit=crop",
            },
        ],
    });

    console.log("Seed completed: admin user and 10 pizzas created.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
