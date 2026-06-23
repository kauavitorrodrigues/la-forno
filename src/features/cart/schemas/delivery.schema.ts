import { z } from "zod";

export const DeliverySchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    cep: z
        .string()
        .min(1, "CEP é obrigatório")
        .regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
    state: z.string().min(1, "Estado é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    district: z.string().min(1, "Bairro é obrigatório"),
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
});

export type DeliverySchemaType = z.infer<typeof DeliverySchema>;
