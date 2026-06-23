"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Pizza } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPizzaAction, updatePizzaAction } from "@/actions/pizzas";

const CATEGORIES = ["Tradicionais", "Especiais", "Vegetarianas", "Doces"] as const;

const pizzaFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    price: z.coerce.number().positive("Preço deve ser positivo"),
    category: z.enum(["Tradicionais", "Especiais", "Vegetarianas", "Doces"], {
        required_error: "Categoria é obrigatória",
    }),
    imageUrl: z.string().url("URL de imagem inválida"),
});

type PizzaFormData = z.infer<typeof pizzaFormSchema>;

type Props =
    | {
          open: boolean;
          onOpenChange: (open: boolean) => void;
          mode: "create";
          pizza?: never;
      }
    | {
          open: boolean;
          onOpenChange: (open: boolean) => void;
          mode: "edit";
          pizza: Pizza;
      };

export function PizzaFormDialog({ open, onOpenChange, mode, pizza }: Props) {
    const isEdit = mode === "edit";

    const form = useForm<PizzaFormData>({
        resolver: zodResolver(pizzaFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: undefined,
            imageUrl: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (isEdit && pizza) {
                form.reset({
                    name: pizza.name,
                    description: pizza.description,
                    price: pizza.price,
                    category: pizza.category as PizzaFormData["category"],
                    imageUrl: pizza.imageUrl,
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    price: 0,
                    category: undefined,
                    imageUrl: "",
                });
            }
        }
    }, [open, isEdit, pizza, form]);

    const onSubmit = async (data: PizzaFormData) => {
        try {
            const result = isEdit
                ? await updatePizzaAction(pizza.id, data)
                : await createPizzaAction(data);

            if (result.success) {
                toast.success(
                    isEdit
                        ? `"${data.name}" atualizada com sucesso.`
                        : `"${data.name}" criada com sucesso.`
                );
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Ocorreu um erro inesperado.");
        }
    };

    const isPending = form.formState.isSubmitting;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Editar pizza" : "Nova pizza"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Margherita"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ingredientes e detalhes da pizza"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="42.00"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoria</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL da imagem</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://..."
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? isEdit
                                        ? "Salvando..."
                                        : "Criando..."
                                    : isEdit
                                      ? "Salvar alterações"
                                      : "Criar pizza"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
